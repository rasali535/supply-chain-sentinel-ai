import { Signal, DisruptionData } from "../core/types";
import { aimlClient } from "./BandClient";
import { DisruptionSchema } from "../core/schemas";

export class DisruptionAgent {
  public static async analyze(signal: Signal): Promise<DisruptionData> {
    try {
      const completion = await aimlClient.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          { role: "system", content: `You are a Disruption Analysis AI. Output JSON matching this schema: ${JSON.stringify(DisruptionSchema)}` },
          { role: "user", content: `Analyze the disruption: ${signal.signal} in ${signal.region}.` }
        ],
        response_format: { type: "json_object" }
      });

      const content = completion.choices[0].message.content;
      if (content) {
        return JSON.parse(content) as DisruptionData;
      }
    } catch (error) {
      console.warn("AI/ML API call failed in DisruptionAgent, using fallback.", error);
    }
    
    // Fallback
    return {
      disruption: "transport delay",
      impact_level: "high",
      affected_sector: "construction"
    };
  }
}
