import { MemoryContext } from "../core/types";

class MemoryService {
  private static instance: MemoryService;
  private memoryStore: Map<string, MemoryContext>;

  private constructor() {
    this.memoryStore = new Map();
  }

  public static getInstance(): MemoryService {
    if (!MemoryService.instance) {
      MemoryService.instance = new MemoryService();
    }
    return MemoryService.instance;
  }

  public createContext(workflowId: string): MemoryContext {
    const context: MemoryContext = {
      workflowId,
      messages: [],
      status: "running",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    this.memoryStore.set(workflowId, context);
    return context;
  }

  public getContext(workflowId: string): MemoryContext | undefined {
    return this.memoryStore.get(workflowId);
  }

  public updateContext(workflowId: string, partial: Partial<MemoryContext>): void {
    const context = this.memoryStore.get(workflowId);
    if (context) {
      Object.assign(context, partial, { updatedAt: new Date().toISOString() });
      this.memoryStore.set(workflowId, context);
    }
  }

  public addMessage(workflowId: string, agentId: string, content: string): void {
    const context = this.memoryStore.get(workflowId);
    if (context) {
      context.messages.push({
        agentId,
        content,
        timestamp: new Date().toISOString()
      });
      context.updatedAt = new Date().toISOString();
      this.memoryStore.set(workflowId, context);
    }
  }
}

export const memoryService = MemoryService.getInstance();
