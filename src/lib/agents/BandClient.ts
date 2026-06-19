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

// Load Band credentials using the BAND_ prefix from environment variables
export const getBandCredentials = (agentId: string) => {
  const credentials = loadAgentConfigFromEnv({ prefix: "BAND_" });
  return {
    ...credentials,
    agentId,
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
