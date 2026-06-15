export const DisruptionSchema = {
  type: "object",
  properties: {
    disruption: { type: "string" },
    impact_level: { type: "string", enum: ["low", "medium", "high"] },
    affected_sector: { type: "string" }
  },
  required: ["disruption", "impact_level", "affected_sector"]
};

export const AlternativesSchema = {
  type: "object",
  properties: {
    alternatives: {
      type: "array",
      items: {
        type: "object",
        properties: {
          name: { type: "string" },
          location: { type: "string" }
        },
        required: ["name", "location"]
      }
    },
    best_match: { type: "string" },
    location: { type: "string" }
  },
  required: ["alternatives", "best_match", "location"]
};

export const StrategySchema = {
  type: "object",
  properties: {
    strategy: { type: "string" },
    recommendation: { type: "string" },
    expected_impact: { type: "string" }
  },
  required: ["strategy", "recommendation", "expected_impact"]
};
