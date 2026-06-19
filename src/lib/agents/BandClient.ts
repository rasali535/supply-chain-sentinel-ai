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
  return {
    agentId,
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
