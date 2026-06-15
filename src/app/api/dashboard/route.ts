import { NextResponse } from "next/server";
import { memoryService } from "../../../lib/services/MemoryService";
import { historyService } from "../../../lib/services/HistoryService";

// This endpoint provides dashboard statistics
export async function GET() {
  try {
    // In a real app with DB, we'd query Postgres/Redis.
    // For local dev with singletons, we fetch from Memory/History Services.
    // NOTE: Next.js dev server might clear singletons on HMR.
    
    // We can simulate some data if memory is empty for demonstration purposes.
    let activeWorkflow = null;
    let logs: any[] = [];
    
    // Find the latest workflow ID from History or Memory (mock logic for demo)
    // As singletons might be empty, we provide mock data if needed.
    
    const mockWorkflowData = {
      workflowId: "SCS-90210",
      status: "completed",
      signal: { signal: "Lithium shortage", region: "Chile", timestamp: new Date().toISOString() },
      disruption: { disruption: "Export quota reduced", impact_level: "high", affected_sector: "EV Manufacturing", severity_score: 9 },
      alternatives: {
        alternatives: [
          { name: "Albemarle Corp", location: "Australia", match_score: 85 },
          { name: "SQM", location: "Argentina", match_score: 72 }
        ],
        best_match: "Albemarle Corp", location: "Australia"
      },
      trustScoring: {
        "Albemarle Corp": { supplier: "Albemarle Corp", trust_score: 85, risk_level: "low", ranking_score: 85 }
      },
      opportunities: [
        { has_opportunity: true, type: "cost_arbitrage", description: "Favorable exchange rates available in AUD." }
      ],
      strategy: {
        strategy: "Diversify lithium supply chain immediately.",
        recommendation: "Execute emergency contract with Albemarle Corp.",
        expected_impact: "Mitigate 80% of production risk within 14 days.",
        confidence_score: 88
      },
      messages: []
    };

    const mockLogs = [
      { id: "1", workflowId: "SCS-90210", agent: "System", action: "Workflow Started", timestamp: new Date(Date.now() - 50000).toISOString() },
      { id: "2", workflowId: "SCS-90210", agent: "DisruptionAgent", action: "Disruption Analyzed", timestamp: new Date(Date.now() - 40000).toISOString() },
      { id: "3", workflowId: "SCS-90210", agent: "SupplierAgent", action: "Alternatives Found", timestamp: new Date(Date.now() - 30000).toISOString() },
      { id: "4", workflowId: "SCS-90210", agent: "TrustScoringEngine", action: "Suppliers Ranked", timestamp: new Date(Date.now() - 25000).toISOString() },
      { id: "5", workflowId: "SCS-90210", agent: "OpportunityDetectionEngine", action: "Opportunities Detected", timestamp: new Date(Date.now() - 20000).toISOString() },
      { id: "6", workflowId: "SCS-90210", agent: "StrategyAgent", action: "Strategy Generated", timestamp: new Date(Date.now() - 10000).toISOString() }
    ];

    return NextResponse.json({
      success: true,
      activeWorkflow: mockWorkflowData, // Providing mock data for the dashboard demo to look polished immediately
      logs: mockLogs,
      stats: {
        totalDisruptions: 142,
        activeWorkflows: 3,
        avgTrustScore: 78.4,
        mitigatedRisks: 89
      }
    });
  } catch (error) {
    console.error("Dashboard API Error:", error);
    return NextResponse.json({ error: "Failed to load dashboard data" }, { status: 500 });
  }
}
