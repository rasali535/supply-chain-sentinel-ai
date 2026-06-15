import { MemoryContext, StrategyData } from "../core/types";
import { featherlessClient } from "./BandClient";
import { StrategySchema } from "../core/schemas";

export class StrategyAgent {
  public static async generate(context: MemoryContext): Promise<StrategyData> {
    try {
      const bestSupplier = context.alternatives?.best_match || "Unknown";
      const riskLevel = context.trustScoring?.[bestSupplier]?.risk_level || "Unknown";
      
      const completion = await featherlessClient.chat.completions.create({
        model: "meta-llama/Meta-Llama-3-8B-Instruct", // common featherless model
        messages: [
          { role: "system", content: `You are a strategic logistics AI. Output JSON matching this schema: ${JSON.stringify(StrategySchema)}` },
          { role: "user", content: `Provide strategy for ${context.signal?.signal} in ${context.signal?.region}. Recommended supplier: ${bestSupplier}. Risk: ${riskLevel}.` }
        ],
        response_format: { type: "json_object" }
      });

      const content = completion.choices[0].message.content;
      if (content) {
        return JSON.parse(content) as StrategyData;
      }
    } catch (error) {
      console.warn("Featherless API call failed in StrategyAgent, using fallback.", error);
    }
    
    // Fallback
    return {
      strategy: "Reroute supply from South Africa",
      recommendation: `Establish immediate contract with ${context.alternatives?.best_match || "PPC Cement"}.`,
      expected_impact: "Will mitigate shortage within 7 days."
    };
  }
}
