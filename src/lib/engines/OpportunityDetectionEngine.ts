import { AlternativesData, DisruptionData, OpportunityData } from "../core/types";

export class OpportunityDetectionEngine {
  public static detect(disruption: DisruptionData, alternatives: AlternativesData): OpportunityData[] {
    const opportunities: OpportunityData[] = [];

    // Check nearshoring opportunity
    if (alternatives.location.toLowerCase().includes("local") || 
        alternatives.location.toLowerCase().includes("nearby")) {
      opportunities.push({
        has_opportunity: true,
        type: "nearshoring",
        description: `Potential to nearshore supply using ${alternatives.best_match}.`
      });
    }

    // Cost arbitrage (simulated)
    if (disruption.impact_level === "high" && alternatives.alternatives.length > 2) {
      opportunities.push({
        has_opportunity: true,
        type: "cost_arbitrage",
        description: "Multiple alternatives available. Good leverage for cost negotiation."
      });
    }

    if (opportunities.length === 0) {
      opportunities.push({
        has_opportunity: false,
        type: "none",
        description: "No immediate strategic opportunities detected."
      });
    }

    return opportunities;
  }
}
