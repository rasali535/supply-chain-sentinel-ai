"use client";

import { useDashboardData } from "../../../hooks/useDashboardData";
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card";
import { ShieldAlert, AlertCircle } from "lucide-react";

export default function RiskMonitor() {
  const { data, loading } = useDashboardData();

  if (loading) return <div className="animate-pulse">Loading Risk Monitor...</div>;

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Supply Chain Risk Monitor</h2>
        <p className="text-muted-foreground mt-2">Active disruption tracking and severity analysis.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {data?.activeWorkflow?.disruption ? (
          <Card className="bg-red-950/20 border-red-900/50">
            <CardHeader className="flex flex-row items-center space-x-2">
              <AlertCircle className="w-5 h-5 text-red-500" />
              <CardTitle className="text-red-200">Active Alert</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white mb-2">{data.activeWorkflow.disruption.disruption}</div>
              <div className="space-y-1 text-sm text-slate-300">
                <p>Sector: <span className="text-red-400">{data.activeWorkflow.disruption.affected_sector}</span></p>
                <p>Severity Score: <span className="text-red-400 font-bold">{data.activeWorkflow.disruption.severity_score}/10</span></p>
                <p>Impact Level: <span className="uppercase text-red-500 font-bold">{data.activeWorkflow.disruption.impact_level}</span></p>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card className="bg-slate-900 border-slate-800">
             <CardContent className="p-6 text-slate-500">No active disruptions detected.</CardContent>
          </Card>
        )}
        
        {/* Mock risk matrix or heatmap visualization can be added here */}
        <Card className="col-span-2 bg-slate-900 border-slate-800">
            <CardHeader className="flex flex-row items-center space-x-2">
              <ShieldAlert className="w-5 h-5 text-orange-500" />
              <CardTitle className="text-slate-200">Global Risk Heatmap</CardTitle>
            </CardHeader>
            <CardContent>
               <div className="h-[200px] rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-center text-slate-600">
                 [Interactive Leaflet/Mapbox component integration goes here]
               </div>
            </CardContent>
        </Card>
      </div>
    </div>
  );
}
