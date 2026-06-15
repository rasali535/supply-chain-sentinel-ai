import OpenAI from "openai";

export const featherlessClient = new OpenAI({
  baseURL: "https://api.featherless.ai/v1",
  apiKey: process.env.FEATHERLESS_API_KEY,
});

export const aimlClient = new OpenAI({
  baseURL: "https://api.aimlapi.com/v1",
  apiKey: process.env.AIML_API_KEY,
});

export class BandOrchestrator {
  private workflowId: string;
  
  constructor(workflowId: string) {
    this.workflowId = workflowId;
  }
  
  getWorkflowId() {
    return this.workflowId;
  }
}
