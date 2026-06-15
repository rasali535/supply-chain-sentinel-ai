import { NextResponse } from "next/server";
import { IntelligenceWorkflow } from "../../../../lib/workflows/IntelligenceWorkflow";
import { Signal } from "../../../../lib/core/types";

export async function POST(req: Request) {
  try {
    const { query } = await req.json();

    if (!query) {
      return NextResponse.json({ error: "Query is required" }, { status: 400 });
    }

    // Map the string query to a Signal for our intelligence layer
    const signal: Signal = {
      id: crypto.randomUUID(),
      signal: query,
      region: "Global", // Can be extracted via NER in a future iteration
      timestamp: new Date().toISOString()
    };

    // Execute the full intelligence layer workflow
    const context = await IntelligenceWorkflow.execute(signal);

    return NextResponse.json({
      success: true,
      agents: {
        signalMonitoring: context.signal,
        disruptionDetection: context.disruption,
        alternativeSupplier: context.alternatives,
        riskScoring: context.trustScoring ? Object.values(context.trustScoring)[0] : null,
        strategy: context.strategy
      },
      workflowId: context.workflowId,
      memoryStatus: context.status,
      opportunities: context.opportunities
    });

  } catch (error) {
    console.error("Agent pipeline error:", error);
    return NextResponse.json({ error: "Pipeline failed" }, { status: 500 });
  }
}
