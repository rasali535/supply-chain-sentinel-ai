import { AlternativeSupplier, TrustScoreData } from "../core/types";

export class SupplierRankingEngine {
  public static rank(suppliers: AlternativeSupplier[], trustScores: Record<string, TrustScoreData>): AlternativeSupplier[] {
    return [...suppliers].map(supplier => {
      const ts = trustScores[supplier.name];
      let rankScore = ts ? ts.trust_score : 50;

      // Penalize if missing location
      if (!supplier.location) rankScore -= 10;
      
      // Update the trust score record with the ranking score
      if (ts) {
         ts.ranking_score = rankScore;
      }
      
      return { ...supplier, match_score: rankScore };
    }).sort((a, b) => (b.match_score || 0) - (a.match_score || 0));
  }
}
