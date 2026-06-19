import "dotenv/config";
import { Agent, GenericAdapter } from "@band-ai/sdk";
import { getBandCredentials } from "./BandClient";
import { DisruptionAgent } from "./DisruptionAgent";
import { SupplierAgent } from "./SupplierAgent";
import { StrategyAgent } from "./StrategyAgent";
import { DisruptionSeverityEngine } from "../engines/DisruptionSeverityEngine";
import { TrustScoringEngine } from "../engines/TrustScoringEngine";
import { SupplierRankingEngine } from "../engines/SupplierRankingEngine";
import { OpportunityDetectionEngine } from "../engines/OpportunityDetectionEngine";
import { RecommendationConfidenceEngine } from "../engines/RecommendationConfidenceEngine";

// Helper to parse specific prefix messages from room history safely
const findMessageInHistory = (history: any, prefix: string) => {
  if (!history || !history.raw) return null;
  const msg = history.raw.find((m: any) => {
    const content = m.content || m.payload?.content;
    return typeof content === "string" && content.startsWith(prefix);
  });
  if (!msg) return null;
  const content = msg.content || msg.payload?.content;
  return content.substring(prefix.length).trim();
};

async function main() {
  console.log("Initializing Band Agents...");

  // 1. Disruption Detection Agent
  const disruptionAdapter = new GenericAdapter(async ({ message, tools, roomId }) => {
    const content = message.content;
    if (content.startsWith("workflow-signal:")) {
      console.log(`[Disruption Agent] Received signal in room ${roomId}`);
      try {
        const signalJson = content.substring("workflow-signal:".length).trim();
        const signal = JSON.parse(signalJson);
        
        // Analyze disruption
        const result = await DisruptionAgent.analyze(signal);
        
        // Calculate severity
        result.severity_score = DisruptionSeverityEngine.calculate(result);
        
        await tools.sendMessage(`workflow-disruption: ${JSON.stringify(result)}`);
        console.log(`[Disruption Agent] Finished and posted disruption analysis.`);
      } catch (e) {
        console.error("[Disruption Agent] Failed to process:", e);
      }
    }
  });

  const disruptionAgent = Agent.create({
    adapter: disruptionAdapter,
    ...getBandCredentials("disruption-agent"),
    identity: {
      name: "Disruption Detection Agent",
      description: "Identify risks, classify disruptions, and assess severity."
    }
  });

  // 2. Alternative Supplier Agent
  const supplierAdapter = new GenericAdapter(async ({ message, tools, history, roomId }) => {
    const content = message.content;
    if (content.startsWith("workflow-disruption:")) {
      console.log(`[Supplier Agent] Received disruption in room ${roomId}`);
      try {
        const disruptionJson = content.substring("workflow-disruption:".length).trim();
        const disruption = JSON.parse(disruptionJson);

        // Find signal region from history
        let region = "Global";
        const signalContent = findMessageInHistory(history, "workflow-signal:");
        if (signalContent) {
          const signal = JSON.parse(signalContent);
          region = signal.region || "Global";
        }

        // Find alternative suppliers
        const result = await SupplierAgent.findAlternatives(disruption, region);
        
        // Calculate trust scoring & ranking
        const trustScoring: any = {};
        result.alternatives.forEach((supplier: any) => {
          trustScoring[supplier.name] = TrustScoringEngine.evaluate(supplier);
        });
        
        const rankedSuppliers = SupplierRankingEngine.rank(result.alternatives, trustScoring);
        result.alternatives = rankedSuppliers;
        result.best_match = rankedSuppliers[0]?.name || result.best_match;
        
        // Detect opportunities
        const opportunities = OpportunityDetectionEngine.detect(disruption, result);
        
        // Package the results together
        const payload = {
          ...result,
          trustScoring,
          opportunities
        };
        
        await tools.sendMessage(`workflow-alternatives: ${JSON.stringify(payload)}`);
        console.log(`[Supplier Agent] Finished and posted alternative suppliers & trust scores.`);
      } catch (e) {
        console.error("[Supplier Agent] Failed to process:", e);
      }
    }
  });

  const supplierAgent = Agent.create({
    adapter: supplierAdapter,
    ...getBandCredentials("supplier-agent"),
    identity: {
      name: "Alternative Supplier Agent",
      description: "Find alternative suppliers matching product type globally."
    }
  });

  // 3. Strategy Agent
  const strategyAdapter = new GenericAdapter(async ({ message, tools, history, roomId }) => {
    const content = message.content;
    if (content.startsWith("workflow-alternatives:")) {
      console.log(`[Strategy Agent] Received alternatives in room ${roomId}`);
      try {
        const alternativesPayload = JSON.parse(content.substring("workflow-alternatives:".length).trim());
        const { trustScoring, opportunities, ...alternatives } = alternativesPayload;

        // Reconstruct context for StrategyAgent
        const signalContent = findMessageInHistory(history, "workflow-signal:");
        const disruptionContent = findMessageInHistory(history, "workflow-disruption:");

        const signal = signalContent ? JSON.parse(signalContent) : null;
        const disruption = disruptionContent ? JSON.parse(disruptionContent) : null;

        const context = {
          workflowId: roomId,
          status: "in-progress" as const,
          signal,
          disruption,
          alternatives,
          trustScoring,
        };

        // Generate strategy
        const result = await StrategyAgent.generate(context);
        
        // Compute recommendation confidence
        result.confidence_score = RecommendationConfidenceEngine.calculate(context);
        
        // Send strategy payload back containing everything the frontend needs
        const finalPayload = {
          strategy: result,
          disruption,
          alternatives,
          trustScoring,
          opportunities
        };
        
        await tools.sendMessage(`workflow-strategy: ${JSON.stringify(finalPayload)}`);
        console.log(`[Strategy Agent] Finished and posted final strategy.`);
      } catch (e) {
        console.error("[Strategy Agent] Failed to process:", e);
      }
    }
  });

  const strategyAgent = Agent.create({
    adapter: strategyAdapter,
    ...getBandCredentials("strategy-agent"),
    identity: {
      name: "Strategy Agent",
      description: "Generate final actionable recommendations and logistics routing."
    }
  });

  // Start all agents concurrently
  console.log("Starting Band Agents connection loop...");
  await Promise.all([
    disruptionAgent.start(),
    supplierAgent.start(),
    strategyAgent.start(),
  ]);

  console.log("Band Agents are running and listening to messages!");
}

main().catch((err) => {
  console.error("Fatal error running Band agents:", err);
});
