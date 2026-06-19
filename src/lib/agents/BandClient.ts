import OpenAI from "openai";
import { loadAgentConfigFromEnv } from "@band-ai/sdk";

export const featherlessClient = new OpenAI({
  baseURL: "https://api.featherless.ai/v1",
  apiKey: process.env.FEATHERLESS_API_KEY || "dummy_key_for_build",
});

export const aimlClient = new OpenAI({
  baseURL: "https://api.aimlapi.com/v1",
  apiKey: process.env.AIML_API_KEY || "dummy_key_for_build",
});

// Load Band credentials manually to bypass strict agent ID validation checks in the SDK
export const getBandCredentials = (agentId: string) => {
  let mappedAgentId = agentId;
  if (agentId === "coordinator-agent" || agentId === "signal-monitoring-agent") {
    mappedAgentId = process.env.BAND_SIGNAL_MONITORING_AGENT_ID || agentId;
  } else if (agentId === "disruption-agent" || agentId === "disruption-detection-age") {
    mappedAgentId = process.env.BAND_DISRUPTION_DETECTION_AGENT_ID || agentId;
  } else if (agentId === "supplier-agent" || agentId === "alternative-supplier-age") {
    mappedAgentId = process.env.BAND_ALTERNATIVE_SUPPLIER_AGENT_ID || agentId;
  } else if (agentId === "risk-scoring-agent") {
    mappedAgentId = process.env.BAND_RISK_SCORING_AGENT_ID || agentId;
  } else if (agentId === "strategy-agent") {
    mappedAgentId = process.env.BAND_STRATEGY_AGENT_ID || agentId;
  }

  return {
    agentId: mappedAgentId,
    apiKey: process.env.BAND_API_KEY || "",
    wsUrl: process.env.BAND_WS_URL || undefined,
    restUrl: process.env.BAND_REST_URL || undefined,
  };
};

export class BandOrchestrator {
  private workflowId: string;
  
  constructor(workflowId: string) {
    this.workflowId = workflowId;
  }
  
  getWorkflowId() {
    return this.workflowId;
  }
}
