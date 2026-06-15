"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Terminal, CheckCircle2, Loader2 } from "lucide-react";
import { AgentPipeline } from "../dashboard/AgentPipeline";
import { BeforeAfter } from "./BeforeAfter";
import { DemoScenario } from "../../lib/demo/scenarios";
import { Card, CardContent } from "../ui/card";

const STEPS = ["signal", "disruption", "supplier", "risk", "strategy", "completed"];

export function DemoRunner({ scenario, onReset }: { scenario: DemoScenario, onReset: () => void }) {
  const [stepIndex, setStepIndex] = useState(0);
  const [logs, setLogs] = useState<string[]>([]);

  useEffect(() => {
    // Reset when scenario changes
    // eslint-disable-next-line
    setStepIndex(0);
    // eslint-disable-next-line
    setLogs([`> Initialization: Loading scenario [${scenario.id}]...`]);

    const timeouts: NodeJS.Timeout[] = [];

    const schedule = (delay: number, newStep: number, logMsg: string) => {
      timeouts.push(
        setTimeout(() => {
          setStepIndex(newStep);
          setLogs(prev => [...prev, logMsg]);
        }, delay)
      );
    };

    // Staggered execution timeline simulating 15-30s run
    // Signal
    schedule(1500, 0, `> [SignalAgent] Ingesting: "${scenario.signal}"`);
    // Disruption
    schedule(4000, 1, `> [DisruptionAgent] Analyzing sector impact...`);
    schedule(5500, 1, `> [DisruptionSeverityEngine] Classified as ${scenario.expectedDisruption.impact_level} impact (Score: ${scenario.expectedDisruption.severity_score}/10)`);
    // Supplier
    schedule(8500, 2, `> [SupplierAgent] Searching global DB for alternatives in ${scenario.region}...`);
    schedule(10000, 2, `> [SupplierAgent] Found ${scenario.expectedAlternatives.alternatives.length} viable alternatives.`);
    // Risk
    schedule(13000, 3, `> [TrustScoringEngine] Verifying compliance and historical trust for ${scenario.expectedAlternatives.best_match}...`);
    schedule(15000, 3, `> [TrustScoringEngine] Verified. Risk Level: ${scenario.expectedTrust[scenario.expectedAlternatives.best_match].risk_level}.`);
    // Strategy
    schedule(18000, 4, `> [StrategyAgent] Formulating mitigation matrix...`);
    schedule(20000, 4, `> [StrategyAgent] Selected strategy: ${scenario.expectedStrategy.strategy}`);
    // Complete
    schedule(23000, 5, `> [Compliance Engine] Strategy approved. Execution trace securely logged for internal audit. Confidence: ${scenario.expectedStrategy.confidence_score}%.`);

    return () => timeouts.forEach(clearTimeout);
  }, [scenario]);

  const activeStepId = STEPS[stepIndex];
  const isComplete = activeStepId === "completed";

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h3 className="text-2xl font-bold text-white">Live Execution: <span className="text-indigo-400">{scenario.title}</span></h3>
          <p className="text-slate-400 mt-1">Multi-agent Band orchestration in progress.</p>
        </div>
        <button onClick={onReset} className="px-6 py-2 text-sm bg-slate-800 hover:bg-slate-700 text-white rounded-md transition whitespace-nowrap self-stretch md:self-auto text-center font-medium">
          Exit Demo
        </button>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Pipeline Visualization */}
        <Card className="bg-slate-900 border-slate-800 relative overflow-hidden">
           <CardContent className="p-8">
              <AgentPipeline activeStep={isComplete ? undefined : activeStepId} />
           </CardContent>
        </Card>

        {/* AI Reasoning Terminal */}
        <Card className="bg-[#0D1117] border-slate-800 font-mono text-sm shadow-2xl relative">
          <div className="flex items-center px-4 py-2 bg-[#161B22] border-b border-slate-800">
            <Terminal className="w-4 h-4 text-slate-500 mr-2" />
            <span className="text-slate-400 mr-3">sentinel-reasoning.log</span>
            <div className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 uppercase tracking-wider">
              Secure Audit Trail Enabled
            </div>
            <div className="ml-auto flex space-x-2">
              <div className="w-3 h-3 rounded-full bg-slate-700" />
              <div className="w-3 h-3 rounded-full bg-slate-700" />
              <div className="w-3 h-3 rounded-full bg-slate-700" />
            </div>
          </div>
          <CardContent className="p-4 h-[400px] overflow-y-auto">
            <div className="space-y-2">
              <AnimatePresence>
                {logs.map((log, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className={`${log.includes("complete") ? "text-emerald-400" : log.includes("Error") ? "text-red-400" : log.includes("Engine") ? "text-sky-300" : "text-slate-300"}`}
                  >
                    {log}
                  </motion.div>
                ))}
                {!isComplete && (
                  <motion.div 
                    initial={{ opacity: 0 }} 
                    animate={{ opacity: 1 }} 
                    transition={{ repeat: Infinity, duration: 0.8 }}
                    className="flex items-center text-slate-500 mt-4"
                  >
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Processing...
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </CardContent>
        </Card>
      </div>

      {isComplete && <BeforeAfter scenario={scenario} />}
    </div>
  );
}
