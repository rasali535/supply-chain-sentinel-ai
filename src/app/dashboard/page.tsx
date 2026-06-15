"use client";

import { useDashboardData } from "../../hooks/useDashboardData";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Activity, AlertTriangle, ShieldCheck, Cpu } from "lucide-react";

export default function ExecutiveDashboard() {
  const { data, loading } = useDashboardData();

  if (loading) return <div className="animate-pulse flex space-x-4">Loading Dashboard Data...</div>;
  if (!data) return <div>Failed to load data.</div>;

  return (
    <div className="space-y-8 animate-in fade-in zoom-in duration-500">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Executive Dashboard</h2>
        <p className="text-muted-foreground mt-2">
          Real-time overview of your supply chain intelligence network.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-slate-900 border-slate-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-300">Total Disruptions</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{data.stats.totalDisruptions}</div>
            <p className="text-xs text-slate-500">+4% from last month</p>
          </CardContent>
        </Card>
        
        <Card className="bg-slate-900 border-slate-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-300">Active Workflows</CardTitle>
            <Activity className="h-4 w-4 text-sky-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{data.stats.activeWorkflows}</div>
            <p className="text-xs text-slate-500">2 requiring attention</p>
          </CardContent>
        </Card>

        <Card className="bg-slate-900 border-slate-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-300">Average Trust Score</CardTitle>
            <ShieldCheck className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{data.stats.avgTrustScore}</div>
            <p className="text-xs text-slate-500">Across tier 1 suppliers</p>
          </CardContent>
        </Card>

        <Card className="bg-slate-900 border-slate-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-300">Mitigated Risks</CardTitle>
            <Cpu className="h-4 w-4 text-indigo-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{data.stats.mitigatedRisks}</div>
            <p className="text-xs text-slate-500">Actions taken automatically</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4 bg-slate-900 border-slate-800">
          <CardHeader>
            <CardTitle className="text-slate-200">Latest Active Signal</CardTitle>
          </CardHeader>
          <CardContent>
            {data.activeWorkflow ? (
              <div className="space-y-4">
                <div className="p-4 bg-slate-950 rounded-lg border border-slate-800">
                  <div className="font-semibold text-lg text-red-400">
                    {data.activeWorkflow.signal?.signal}
                  </div>
                  <div className="text-sm text-slate-400 mt-1">
                    Region: {data.activeWorkflow.signal?.region}
                  </div>
                </div>
                {data.activeWorkflow.strategy && (
                  <div className="p-4 bg-indigo-950/30 rounded-lg border border-indigo-500/20">
                    <div className="font-semibold text-indigo-300 flex items-center">
                      <Lightbulb className="w-4 h-4 mr-2"/>
                      AI Recommendation
                    </div>
                    <div className="text-sm text-slate-300 mt-2">
                      {data.activeWorkflow.strategy.recommendation}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-slate-500">No active signals.</div>
            )}
          </CardContent>
        </Card>

        <Card className="col-span-3 bg-slate-900 border-slate-800">
          <CardHeader>
            <CardTitle className="text-slate-200">Recent Logs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {data.logs.slice(-4).reverse().map((log) => (
                <div key={log.id} className="flex items-start">
                  <span className="flex h-2 w-2 translate-y-1.5 rounded-full bg-sky-500 mr-2" />
                  <div>
                    <p className="text-sm font-medium text-slate-200">{log.action}</p>
                    <p className="text-xs text-slate-500">{log.agent}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// Ensure Lightbulb is imported
import { Lightbulb } from "lucide-react";
