"use client";

import { useDashboardData } from "../../../hooks/useDashboardData";
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card";
import { Lightbulb, TrendingUp, Target } from "lucide-react";
import { Progress } from "../../../components/ui/progress";

export default function StrategyRecommendationCenter() {
  const { data, loading } = useDashboardData();

  if (loading) return <div className="animate-pulse">Loading Strategy Center...</div>;

  const strategy = data?.activeWorkflow?.strategy;

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Strategy Recommendation Center</h2>
        <p className="text-muted-foreground mt-2">AI-driven actionable insights and mitigation paths.</p>
      </div>

      {strategy ? (
        <div className="grid gap-6 md:grid-cols-2">
          <Card className="col-span-2 bg-amber-950/20 border-amber-900/50">
            <CardHeader className="flex flex-row items-center space-x-2">
               <Lightbulb className="w-6 h-6 text-amber-500"/>
              <CardTitle className="text-amber-200 text-xl">Primary AI Recommendation</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white mb-4 leading-relaxed">
                {strategy.recommendation}
              </div>
              <div className="p-4 bg-slate-950 rounded-lg border border-slate-800 text-slate-300">
                <span className="font-semibold text-slate-400 block mb-1">Underlying Strategy:</span>
                {strategy.strategy}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-900 border-slate-800">
            <CardHeader className="flex flex-row items-center space-x-2">
               <Target className="w-5 h-5 text-sky-500"/>
              <CardTitle className="text-slate-200">Expected Impact</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-lg text-slate-300">{strategy.expected_impact}</p>
            </CardContent>
          </Card>

          <Card className="bg-slate-900 border-slate-800">
            <CardHeader className="flex flex-row items-center space-x-2">
               <TrendingUp className="w-5 h-5 text-emerald-500"/>
              <CardTitle className="text-slate-200">AI Confidence Score</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-end justify-between mb-2">
                <span className="text-4xl font-bold text-white">{strategy.confidence_score}%</span>
                <span className="text-sm text-slate-400 mb-1">Based on trust & disruption data</span>
              </div>
              <Progress value={strategy.confidence_score || 0} className="h-3 bg-slate-800" indicatorClassName="bg-emerald-500" />
            </CardContent>
          </Card>
        </div>
      ) : (
        <Card className="bg-slate-900 border-slate-800">
           <CardContent className="p-6 text-slate-500">No active strategy recommendation available.</CardContent>
        </Card>
      )}
    </div>
  );
}
