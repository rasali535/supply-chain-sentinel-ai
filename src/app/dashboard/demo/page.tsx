"use client";

import { useState } from "react";
import { PlayCircle, Globe, Droplet, Package, Truck } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../../../components/ui/card";
import { DemoRunner } from "../../../components/demo/DemoRunner";
import { demoScenarios, DemoScenario } from "../../../lib/demo/scenarios";
import { cn } from "../../../lib/utils";

const ICONS: Record<string, any> = {
  "cement-botswana": Globe,
  "fuel-disruption": Droplet,
  "agri-shortage": Package,
  "cross-border-delay": Truck
};

export default function DemoCenter() {
  const [activeScenario, setActiveScenario] = useState<DemoScenario | null>(null);

  if (activeScenario) {
    return <DemoRunner scenario={activeScenario} onReset={() => setActiveScenario(null)} />;
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="max-w-2xl">
        <h2 className="text-4xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-sky-400">
          Live Demo Center
        </h2>
        <p className="text-lg text-slate-400 mt-4">
          Experience Sentinel AI's autonomous multi-agent orchestration. Select a real-world scenario below to watch the intelligence layer analyze, verify, and resolve a massive supply chain disruption in real-time.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2 mt-8">
        {demoScenarios.map((scenario) => {
          const Icon = ICONS[scenario.id] || Globe;
          return (
            <Card key={scenario.id} onClick={() => setActiveScenario(scenario)} className="bg-slate-900 border-slate-800 hover:border-indigo-500/50 transition-all duration-300 group cursor-pointer overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="p-3 bg-slate-950 rounded-lg text-indigo-400 group-hover:text-indigo-300 transition-colors">
                    <Icon className="w-6 h-6" />
                  </div>
                  <button 
                    className="flex items-center space-x-2 bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-full font-medium transition shadow-lg shadow-indigo-900/20 transform group-hover:scale-105 pointer-events-none"
                  >
                    <PlayCircle className="w-4 h-4" />
                    <span>Run Scenario</span>
                  </button>
                </div>
                <CardTitle className="text-xl text-slate-200 mt-4">{scenario.title}</CardTitle>
                <CardDescription className="text-slate-400 text-base">{scenario.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-sm font-mono text-slate-500 bg-slate-950 p-3 rounded border border-slate-800 truncate">
                  <span className="text-red-400 font-semibold uppercase text-xs mr-2">Signal</span>
                  {scenario.signal}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
