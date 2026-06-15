import { DisruptionData, AlternativesData } from "../core/types";
import { aimlClient } from "./BandClient";
import { AlternativesSchema } from "../core/schemas";

export class SupplierAgent {
  public static async findAlternatives(disruption: DisruptionData, region: string): Promise<AlternativesData> {
    try {
      const completion = await aimlClient.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          { role: "system", content: `You are a Supplier Matching AI. Output JSON matching this schema: ${JSON.stringify(AlternativesSchema)}` },
          { role: "user", content: `Find alternative suppliers for a ${disruption.affected_sector} disruption (${disruption.disruption}) in ${region}.` }
        ],
        response_format: { type: "json_object" }
      });

      const content = completion.choices[0].message.content;
      if (content) {
        return JSON.parse(content) as AlternativesData;
      }
    } catch (error) {
      console.warn("AI/ML API call failed in SupplierAgent, using fallback.", error);
    }
    
    // Fallback
    return {
      alternatives: [
        { name: "PPC Cement", location: "South Africa" },
        { name: "AfriSam", location: "South Africa" },
        { name: "Dangote Cement SA", location: "South Africa" }
      ],
      best_match: "PPC Cement",
      location: "South Africa"
    };
  }
}
