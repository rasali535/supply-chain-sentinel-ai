import { Signal, MemoryContext } from "../core/types";
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

export class IntelligenceWorkflow {
  public static async execute(signal: Signal): Promise<MemoryContext> {
    const workflowId = signal.id || crypto.randomUUID();
    const context = memoryService.createContext(workflowId);
    
    // Log start
    historyService.logAction({
      workflowId,
      agent: "System",
      action: "Workflow Started",
      data: { signal }
    });

    try {
      context.signal = signal;

      // 1. Disruption Analysis
      const disruptionData = await DisruptionAgent.analyze(signal);
      disruptionData.severity_score = DisruptionSeverityEngine.calculate(disruptionData);
      context.disruption = disruptionData;
      memoryService.addMessage(workflowId, "DisruptionAgent", `Disruption analyzed with severity ${disruptionData.severity_score}`);
      historyService.logAction({ workflowId, agent: "DisruptionAgent", action: "Disruption Analyzed", data: disruptionData });

      // 2. Alternative Suppliers
      const alternativesData = await SupplierAgent.findAlternatives(disruptionData, signal.region);
      context.alternatives = alternativesData;
      memoryService.addMessage(workflowId, "SupplierAgent", `Found ${alternativesData.alternatives.length} alternatives in ${signal.region}`);
      historyService.logAction({ workflowId, agent: "SupplierAgent", action: "Alternatives Found", data: alternativesData });

      // 3. Trust Scoring & Ranking
      const trustScoring: Record<string, any> = {};
      alternativesData.alternatives.forEach(supplier => {
        trustScoring[supplier.name] = TrustScoringEngine.evaluate(supplier);
      });
      context.trustScoring = trustScoring;
      
      const rankedSuppliers = SupplierRankingEngine.rank(alternativesData.alternatives, trustScoring);
      alternativesData.alternatives = rankedSuppliers;
      alternativesData.best_match = rankedSuppliers[0]?.name || alternativesData.best_match;
      
      memoryService.addMessage(workflowId, "TrustScoringEngine", "Suppliers scored and ranked.");
      historyService.logAction({ workflowId, agent: "TrustScoringEngine", action: "Suppliers Ranked", data: { rankedSuppliers, trustScoring } });

      // 4. Opportunity Detection
      const opportunities = OpportunityDetectionEngine.detect(disruptionData, alternativesData);
      context.opportunities = opportunities;
      memoryService.addMessage(workflowId, "OpportunityDetectionEngine", `Detected ${opportunities.filter(o => o.has_opportunity).length} opportunities`);
      historyService.logAction({ workflowId, agent: "OpportunityDetectionEngine", action: "Opportunities Detected", data: opportunities });

      // 5. Strategy & Confidence
      const strategyData = await StrategyAgent.generate(context);
      strategyData.confidence_score = RecommendationConfidenceEngine.calculate(context);
      context.strategy = strategyData;
      memoryService.addMessage(workflowId, "StrategyAgent", `Strategy generated with ${strategyData.confidence_score}% confidence`);
      historyService.logAction({ workflowId, agent: "StrategyAgent", action: "Strategy Generated", data: strategyData });

      // Finalize
      context.status = "completed";
      memoryService.updateContext(workflowId, { status: "completed" });
      historyService.saveExecutionHistory(workflowId, context);

      return context;
    } catch (error) {
      context.status = "failed";
      memoryService.updateContext(workflowId, { status: "failed" });
      historyService.logAction({ workflowId, agent: "System", action: "Workflow Failed", data: { error } });
      historyService.saveExecutionHistory(workflowId, context);
      throw error;
    }
  }
}
