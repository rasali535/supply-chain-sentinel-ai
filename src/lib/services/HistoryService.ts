import { LogEntry, MemoryContext } from "../core/types";

class HistoryService {
  private static instance: HistoryService;
  private logStore: Map<string, LogEntry[]>;
  private historyStore: Map<string, MemoryContext>;

  private constructor() {
    this.logStore = new Map();
    this.historyStore = new Map();
  }

  public static getInstance(): HistoryService {
    if (!HistoryService.instance) {
      HistoryService.instance = new HistoryService();
    }
    return HistoryService.instance;
  }

  public logAction(entry: Omit<LogEntry, "id" | "timestamp">): void {
    const id = crypto.randomUUID();
    const fullEntry: LogEntry = {
      ...entry,
      id,
      timestamp: new Date().toISOString()
    };
    
    if (!this.logStore.has(entry.workflowId)) {
      this.logStore.set(entry.workflowId, []);
    }
    
    this.logStore.get(entry.workflowId)!.push(fullEntry);
  }

  public getLogs(workflowId: string): LogEntry[] {
    return this.logStore.get(workflowId) || [];
  }

  public saveExecutionHistory(workflowId: string, finalContext: MemoryContext): void {
    this.historyStore.set(workflowId, finalContext);
  }

  public replayExecution(workflowId: string): { context?: MemoryContext, logs: LogEntry[] } {
    return {
      context: this.historyStore.get(workflowId),
      logs: this.getLogs(workflowId)
    };
  }
}

export const historyService = HistoryService.getInstance();
