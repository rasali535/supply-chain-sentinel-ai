import { AlternativeSupplier, TrustScoreData } from "../core/types";

export class TrustScoringEngine {
  public static evaluate(supplier: AlternativeSupplier): TrustScoreData {
    // In a real system, this would query a DB for historical performance
    // For now, we simulate based on string hashing or simple logic
    
    let baseScore = 70; // baseline

    if (supplier.name.toLowerCase().includes("global")) baseScore += 10;
    if (supplier.location.toLowerCase().includes("south africa")) baseScore += 5;
    
    // Add some determinism
    const charSum = supplier.name.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
    baseScore += (charSum % 15);

    const score = Math.min(Math.max(baseScore, 0), 100);

    let risk: "low" | "medium" | "high" = "medium";
    if (score >= 80) risk = "low";
    else if (score < 60) risk = "high";

    return {
      supplier: supplier.name,
      trust_score: score,
      risk_level: risk
    };
  }
}
