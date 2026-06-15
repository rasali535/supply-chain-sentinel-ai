"use client";

import { useDashboardData } from "../../../hooks/useDashboardData";
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card";
import { Users, ShieldCheck, AlertTriangle } from "lucide-react";
import { Progress } from "../../../components/ui/progress";

export default function SupplierIntelligence() {
  const { data, loading } = useDashboardData();

  if (loading) return <div className="animate-pulse">Loading Supplier Intelligence...</div>;

  const alternatives = data?.activeWorkflow?.alternatives?.alternatives || [];
  const trustScores = data?.activeWorkflow?.trustScoring || {};

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Supplier Intelligence Center</h2>
        <p className="text-muted-foreground mt-2">Real-time alternative supplier matching and trust scoring.</p>
      </div>

      <div className="grid gap-6">
        <Card className="bg-slate-900 border-slate-800">
          <CardHeader className="flex flex-row items-center space-x-2">
             <Users className="w-5 h-5 text-emerald-500"/>
            <CardTitle className="text-slate-200">Alternative Suppliers</CardTitle>
          </CardHeader>
          <CardContent>
            {alternatives.length > 0 ? (
              <div className="space-y-6">
                {alternatives.map((supplier: any) => {
                  const trust = trustScores[supplier.name];
                  const trustScore = trust?.trust_score || 0;
                  const isHighRisk = trust?.risk_level === "high";

                  return (
                    <div key={supplier.name} className="p-4 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-between">
                      <div className="flex-1">
                        <div className="font-semibold text-lg text-white">{supplier.name}</div>
                        <div className="text-sm text-slate-400">{supplier.location}</div>
                        {trust?.ranking_score && (
                          <div className="text-xs text-emerald-400 mt-1">Match/Ranking Score: {trust.ranking_score}</div>
                        )}
                      </div>
                      
                      <div className="w-64 space-y-2 text-right">
                        <div className="flex justify-between text-sm">
                          <span className="text-slate-400">Trust Score</span>
                          <span className={isHighRisk ? "text-red-400" : "text-emerald-400"}>{trustScore}%</span>
                        </div>
                        <Progress value={trustScore} className="h-2 bg-slate-800" indicatorClassName={isHighRisk ? "bg-red-500" : "bg-emerald-500"} />
                        {isHighRisk && (
                          <div className="flex items-center justify-end text-xs text-red-500 mt-1">
                            <AlertTriangle className="w-3 h-3 mr-1" /> High Risk
                          </div>
                        )}
                        {trust?.risk_level === "low" && (
                          <div className="flex items-center justify-end text-xs text-emerald-500 mt-1">
                            <ShieldCheck className="w-3 h-3 mr-1" /> Verified Safe
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-slate-500">No active alternatives available.</div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
