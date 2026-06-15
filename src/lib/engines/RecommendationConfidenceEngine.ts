import { MemoryContext } from "../core/types";

export class RecommendationConfidenceEngine {
  public static calculate(context: MemoryContext): number {
    let baseConfidence = 95;

    // Deduct points for missing or low quality data
    if (!context.disruption || context.disruption.impact_level === "high") {
      baseConfidence -= 10;
    }

    if (!context.alternatives || context.alternatives.alternatives.length === 0) {
      baseConfidence -= 30;
    }

    if (context.trustScoring) {
      const bestSupplier = context.alternatives?.best_match;
      if (bestSupplier && context.trustScoring[bestSupplier]) {
        const trust = context.trustScoring[bestSupplier];
        if (trust.risk_level === "high") baseConfidence -= 25;
        if (trust.risk_level === "medium") baseConfidence -= 10;
      }
    }

    return Math.min(Math.max(baseConfidence, 10), 100);
  }
}
