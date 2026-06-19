import { Signal, MemoryContext, TrustScoreData } from "../core/types";
import { memoryService } from "../services/MemoryService";
import { historyService } from "../services/HistoryService";
import { DisruptionAgent } from "../agents/DisruptionAgent";
import { DisruptionSeverityEngine } from "../engines/DisruptionSeverityEngine";
import { SupplierAgent } from "../agents/SupplierAgent";
import { TrustScoringEngine } from "../engines/TrustScoringEngine";
import { SupplierRankingEngine } from "../engines/SupplierRankingEngine";
import { OpportunityDetectionEngine } from "../engines/OpportunityDetectionEngine";
import { StrategyAgent } from "../agents/StrategyAgent";
import { RecommendationConfidenceEngine } from "../engines/RecommendationConfidenceEngine";
import { ThenvoiLink } from "@band-ai/sdk";
import { getBandCredentials } from "../agents/BandClient";

export class IntelligenceWorkflow {
  public static async execute(signal: Signal): Promise<MemoryContext> {
    const workflowId = signal.id || crypto.randomUUID();
    const context = memoryService.createContext(workflowId);
    context.signal = signal;

    // Log start
    historyService.logAction({
      workflowId,
      agent: "System",
      action: "Workflow Started",
      data: { signal }
    });

    console.log(`[Workflow] Attempting to run via Band SDK...`);
    
    let link: ThenvoiLink | null = null;
    let completed = false;

    // Track the execution events locally so we can stream them to the UI
    const logEvent = (agent: string, action: string, data: any) => {
      historyService.logAction({ workflowId, agent, action, data });
    };

    try {
      const credentials = getBandCredentials("coordinator-agent");
      link = new ThenvoiLink({
        agentId: credentials.agentId,
        apiKey: credentials.apiKey,
        wsUrl: credentials.wsUrl,
        restUrl: credentials.restUrl,
      });

      // Connect with a timeout
      await Promise.race([
        link.connect(),
        new Promise((_, reject) => setTimeout(() => reject(new Error("Connection timeout")), 8000))
      ]);

      console.log(`[Workflow] Connected to Band server. Creating chatroom...`);
      const chat = await link.rest.createChat(workflowId);
      const chatId = chat.id;

      // Add agents as participants
      const agentIds = [
        process.env.BAND_DISRUPTION_DETECTION_AGENT_ID || "disruption-agent",
        process.env.BAND_ALTERNATIVE_SUPPLIER_AGENT_ID || "supplier-agent",
        process.env.BAND_STRATEGY_AGENT_ID || "strategy-agent"
      ];
      for (const agentId of agentIds) {
        try {
          await link.rest.addChatParticipant(chatId, { participantId: agentId, role: "member" });
        } catch (e) {
          console.warn(`Could not add agent ${agentId} to chatroom:`, e);
        }
      }

      await link.subscribeRoom(chatId);

      // Post initial signal to kick off the multi-agent cascade
      await link.rest.createChatMessage(chatId, {
        content: `workflow-signal: ${JSON.stringify(signal)}`
      });
      
      console.log(`[Workflow] Initial signal sent to room ${chatId}. Waiting for agent collaboration...`);

      // Set a maximum execution timeout of 25 seconds
      const timeoutPromise = new Promise<never>((_, reject) => {
        setTimeout(() => reject(new Error("Workflow execution timeout")), 25000);
      });

      const loopPromise = async () => {
        if (!link) return;
        for await (const event of link) {
          if (event.type === "message_created" && event.roomId === chatId) {
            const message = event.payload;
            const content = message.content;

            if (content.startsWith("workflow-disruption:")) {
              const disruption = JSON.parse(content.substring("workflow-disruption:".length).trim());
              context.disruption = disruption;
              memoryService.addMessage(workflowId, "DisruptionAgent", `Disruption analyzed with severity ${disruption.severity_score}`);
              logEvent("DisruptionAgent", "Disruption Analyzed", disruption);
            } 
            else if (content.startsWith("workflow-alternatives:")) {
              const payload = JSON.parse(content.substring("workflow-alternatives:".length).trim());
              const { trustScoring, opportunities, ...alternatives } = payload;
              context.alternatives = alternatives;
              context.trustScoring = trustScoring;
              context.opportunities = opportunities;
              memoryService.addMessage(workflowId, "SupplierAgent", `Found ${alternatives.alternatives.length} alternatives in ${signal.region}`);
              logEvent("SupplierAgent", "Alternatives Found", alternatives);
            } 
            else if (content.startsWith("workflow-strategy:")) {
              const payload = JSON.parse(content.substring("workflow-strategy:".length).trim());
              context.strategy = payload.strategy;
              context.status = "completed";
              memoryService.addMessage(workflowId, "StrategyAgent", `Strategy generated with ${payload.strategy.confidence_score}% confidence`);
              logEvent("StrategyAgent", "Strategy Generated", payload.strategy);
              completed = true;
              break;
            }
          }
        }
      };

      // Race the event loop against the timeout
      await Promise.race([loopPromise(), timeoutPromise]);

    } catch (error) {
      console.warn("Band SDK workflow execution failed or timed out. Falling back to local simulation...", error);
    } finally {
      if (link) {
        try {
          await link.disconnect();
        } catch (e) {
          console.warn("Error disconnecting link:", e);
        }
      }
    }

    // FALLBACK: If Band workflow was not completed, execute using local inline sequential fallback
    if (!completed) {
      console.log("[Workflow] Running local inline simulation fallback to ensure presentation success.");
      try {
        // 1. Disruption Analysis
        const disruptionData = await DisruptionAgent.analyze(signal);
        disruptionData.severity_score = DisruptionSeverityEngine.calculate(disruptionData);
        context.disruption = disruptionData;
        memoryService.addMessage(workflowId, "DisruptionAgent", `Disruption analyzed with severity ${disruptionData.severity_score} (Fallback)`);
        logEvent("DisruptionAgent", "Disruption Analyzed (Fallback)", disruptionData);

        // 2. Alternative Suppliers
        const alternativesData = await SupplierAgent.findAlternatives(disruptionData, signal.region);
        context.alternatives = alternativesData;
        memoryService.addMessage(workflowId, "SupplierAgent", `Found ${alternativesData.alternatives.length} alternatives in ${signal.region} (Fallback)`);
        logEvent("SupplierAgent", "Alternatives Found (Fallback)", alternativesData);

        // 3. Trust Scoring & Ranking
        const trustScoring: Record<string, TrustScoreData> = {};
        alternativesData.alternatives.forEach(supplier => {
          trustScoring[supplier.name] = TrustScoringEngine.evaluate(supplier);
        });
        context.trustScoring = trustScoring;
        
        const rankedSuppliers = SupplierRankingEngine.rank(alternativesData.alternatives, trustScoring);
        alternativesData.alternatives = rankedSuppliers;
        alternativesData.best_match = rankedSuppliers[0]?.name || alternativesData.best_match;
        
        memoryService.addMessage(workflowId, "TrustScoringEngine", "Suppliers scored and ranked (Fallback).");
        logEvent("TrustScoringEngine", "Suppliers Ranked (Fallback)", { rankedSuppliers, trustScoring });

        // 4. Opportunity Detection
        const opportunities = OpportunityDetectionEngine.detect(disruptionData, alternativesData);
        context.opportunities = opportunities;
        memoryService.addMessage(workflowId, "OpportunityDetectionEngine", `Detected ${opportunities.filter(o => o.has_opportunity).length} opportunities (Fallback)`);
        logEvent("OpportunityDetectionEngine", "Opportunities Detected (Fallback)", opportunities);

        // 5. Strategy & Confidence
        const strategyData = await StrategyAgent.generate(context);
        strategyData.confidence_score = RecommendationConfidenceEngine.calculate(context);
        context.strategy = strategyData;
        memoryService.addMessage(workflowId, "StrategyAgent", `Strategy generated with ${strategyData.confidence_score}% confidence (Fallback)`);
        logEvent("StrategyAgent", "Strategy Generated (Fallback)", strategyData);

        context.status = "completed";
      } catch (err) {
        context.status = "failed";
        historyService.logAction({ workflowId, agent: "System", action: "Workflow Failed", data: { err } });
        throw err;
      }
    }

    // Finalize memory context
    memoryService.updateContext(workflowId, { status: "completed" });
    historyService.saveExecutionHistory(workflowId, context);

    return context;
  }
}
