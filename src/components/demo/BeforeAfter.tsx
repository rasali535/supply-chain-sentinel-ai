"use client";

import { motion } from "framer-motion";
import { ArrowRight, AlertOctagon, CheckCircle2 } from "lucide-react";
import { Card, CardContent } from "../ui/card";
import { DemoScenario } from "../../lib/demo/scenarios";

export function BeforeAfter({ scenario }: { scenario: DemoScenario }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="mt-8"
    >
      <div className="grid md:grid-cols-[1fr_auto_1fr] gap-4 items-center">
        <Card className="bg-red-950/20 border-red-900/50 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1 h-full bg-red-500" />
          <CardContent className="p-6">
            <div className="flex items-center space-x-2 text-red-500 mb-4">
              <AlertOctagon className="w-6 h-6" />
              <h3 className="font-bold text-lg">Before Sentinel AI</h3>
            </div>
            <div className="space-y-3">
              <div className="p-3 bg-slate-950 rounded border border-slate-800">
                <p className="text-xs text-slate-500 font-semibold uppercase">Raw Signal</p>
                <p className="text-sm text-slate-300 mt-1">{scenario.signal}</p>
              </div>
              <div className="p-3 bg-slate-950 rounded border border-slate-800">
                <p className="text-xs text-slate-500 font-semibold uppercase">Projected Impact</p>
                <p className="text-sm font-semibold text-red-400 mt-1">High Severity - Unmitigated Risk</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="hidden md:flex flex-col items-center justify-center p-4">
          <motion.div 
            animate={{ x: [0, 10, 0] }} 
            transition={{ repeat: Infinity, duration: 2 }}
          >
            <ArrowRight className="w-8 h-8 text-slate-500" />
          </motion.div>
        </div>

        <Card className="bg-emerald-950/20 border-emerald-900/50 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1 h-full bg-emerald-500" />
          <CardContent className="p-6">
            <div className="flex items-center space-x-2 text-emerald-500 mb-4">
              <CheckCircle2 className="w-6 h-6" />
              <h3 className="font-bold text-lg">After Sentinel AI</h3>
            </div>
            <div className="space-y-3">
              <div className="p-3 bg-slate-950 rounded border border-slate-800">
                <p className="text-xs text-slate-500 font-semibold uppercase">Autonomous Strategy</p>
                <p className="text-sm text-slate-300 mt-1">{scenario.expectedStrategy.recommendation}</p>
              </div>
              <div className="p-3 bg-slate-950 rounded border border-slate-800">
                <p className="text-xs text-slate-500 font-semibold uppercase">Resolution</p>
                <p className="text-sm font-semibold text-emerald-400 mt-1">{scenario.expectedStrategy.expected_impact}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </motion.div>
  );
}
