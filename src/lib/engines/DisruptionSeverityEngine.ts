import { DisruptionData } from "../core/types";

export class DisruptionSeverityEngine {
  public static calculate(disruption: DisruptionData): number {
    let score = 0;
    
    // Base score from impact level
    switch(disruption.impact_level) {
      case "high": score += 7; break;
      case "medium": score += 4; break;
      case "low": score += 2; break;
    }

    // Adjust based on critical sectors
    const criticalSectors = ["health", "construction", "energy", "food"];
    if (criticalSectors.some(sector => disruption.affected_sector.toLowerCase().includes(sector))) {
      score += 3;
    }

    // Normalize to 1-10
    return Math.min(Math.max(score, 1), 10);
  }
}
