"use client";

import { useDashboardData } from "../../../hooks/useDashboardData";
import { AgentPipeline } from "../../../components/dashboard/AgentPipeline";
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card";
import { GitMerge } from "lucide-react";

export default function WorkflowCenter() {
  const { data, loading } = useDashboardData();

  if (loading) return <div className="animate-pulse flex space-x-4">Loading Workflow Center...</div>;
  if (!data) return <div>Failed to load data.</div>;

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Workflow Visualization</h2>
        <p className="text-muted-foreground mt-2">
          Real-time multi-agent orchestration via Band network.
        </p>
      </div>

      <div className="grid gap-8 md:grid-cols-2">
        <Card className="bg-slate-900 border-slate-800">
          <CardHeader className="flex flex-row items-center space-x-2">
             <GitMerge className="w-5 h-5 text-indigo-500"/>
            <CardTitle className="text-slate-200">Execution Sequence</CardTitle>
          </CardHeader>
          <CardContent>
            <AgentPipeline />
          </CardContent>
        </Card>

        <Card className="bg-slate-900 border-slate-800">
          <CardHeader>
            <CardTitle className="text-slate-200">Current Workflow Context</CardTitle>
          </CardHeader>
          <CardContent>
             {data.activeWorkflow ? (
               <pre className="p-4 rounded-lg bg-slate-950 border border-slate-800 text-xs text-sky-300 overflow-x-auto">
                 {JSON.stringify(data.activeWorkflow, null, 2)}
               </pre>
             ) : (
               <div className="text-slate-500">No active workflow context available.</div>
             )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
