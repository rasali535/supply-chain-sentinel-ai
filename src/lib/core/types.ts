export interface Signal {
  id: string;
  signal: string;
  region: string;
  timestamp: string;
}

export interface DisruptionData {
  disruption: string;
  impact_level: "low" | "medium" | "high";
  affected_sector: string;
  severity_score?: number; // Added by engine
}

export interface AlternativeSupplier {
  name: string;
  location: string;
  match_score?: number;
}

export interface AlternativesData {
  alternatives: AlternativeSupplier[];
  best_match: string;
  location: string;
}

export interface TrustScoreData {
  supplier: string;
  trust_score: number;
  risk_level: "low" | "medium" | "high";
  ranking_score?: number; // Added by Ranking Engine
}

export interface OpportunityData {
  has_opportunity: boolean;
  type: string; // e.g. "nearshoring", "cost_arbitrage", "none"
  description: string;
}

export interface StrategyData {
  strategy: string;
  recommendation: string;
  expected_impact: string;
  confidence_score?: number; // Added by Confidence Engine
}

export interface AgentMessage {
  agentId: string;
  content: string;
  timestamp: string;
}

export interface MemoryContext {
  workflowId: string;
  signal?: Signal;
  disruption?: DisruptionData;
  alternatives?: AlternativesData;
  trustScoring?: Record<string, TrustScoreData>;
  opportunities?: OpportunityData[];
  strategy?: StrategyData;
  messages: AgentMessage[];
  status: "running" | "completed" | "failed";
  createdAt: string;
  updatedAt: string;
}

export interface LogEntry {
  id: string;
  workflowId: string;
  agent: string;
  action: string;
  data?: unknown;
  timestamp: string;
}
