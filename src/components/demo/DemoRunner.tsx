"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Terminal, CheckCircle2, Loader2, Maximize, Minimize, ShieldCheck, Zap, Server, BrainCircuit, Activity, BarChart3 } from "lucide-react";
import { AgentPipeline, AgentStepStatus } from "../dashboard/AgentPipeline";
import { DemoScenario } from "../../lib/demo/scenarios";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { cn } from "../../lib/utils";

const STEPS = ["signal", "disruption", "supplier", "risk", "strategy", "completed"];

export function DemoRunner({ scenario, onReset }: { scenario: DemoScenario, onReset: () => void }) {
  const [stepIndex, setStepIndex] = useState(0);
  const [logs, setLogs] = useState<string[]>([]);
  const [agentStatuses, setAgentStatuses] = useState<AgentStepStatus[]>([]);
  const [visibleReasoning, setVisibleReasoning] = useState<string[]>([]);
  const [activeJson, setActiveJson] = useState<{agent: string, payload: unknown} | null>(null);
  const [presentationMode, setPresentationMode] = useState(false);
  const [liveMetrics, setLiveMetrics] = useState({ agents: 0, suppliers: 0, risks: 0 });

  useEffect(() => {
    // Reset when scenario changes
    // eslint-disable-next-line
    setStepIndex(0);
    // eslint-disable-next-line
    setLogs([`> Initialization: Loading scenario [${scenario.id}]...`]);
    setAgentStatuses([
      { id: "signal", status: "waiting" },
      { id: "disruption", status: "waiting" },
      { id: "supplier", status: "waiting" },
      { id: "risk", status: "waiting" },
      { id: "strategy", status: "waiting" },
    ]);
    setVisibleReasoning([]);
    setActiveJson(null);
    setLiveMetrics({ agents: 0, suppliers: 0, risks: 0 });

    const timeouts: NodeJS.Timeout[] = [];

    const schedule = (delay: number, fn: () => void) => {
      timeouts.push(setTimeout(fn, delay));
    };

    const updateAgent = (id: string, status: Partial<AgentStepStatus>) => {
      setAgentStatuses(prev => prev.map(a => a.id === id ? { ...a, ...status } : a));
    };

    // --- TIMELINE ---
    // Start Signal (0s)
    schedule(1000, () => {
      setStepIndex(0);
      updateAgent("signal", { status: "running" });
      setLogs(prev => [...prev, `> [SignalAgent] Ingesting: "${scenario.signal}"`]);
      setLiveMetrics(prev => ({ ...prev, agents: 1 }));
    });
    schedule(2000, () => {
      updateAgent("signal", { status: "completed", summary: "Signal ingested.", timeMs: 450, confidence: 99 });
      setVisibleReasoning(prev => [...prev, scenario.reasoning[0]]);
      setActiveJson({ agent: "SignalAgent", payload: { signal: scenario.signal, timestamp: new Date().toISOString() } });
    });

    // Disruption (3s)
    schedule(3000, () => {
      setStepIndex(1);
      updateAgent("disruption", { status: "running" });
      setLogs(prev => [...prev, `> [DisruptionAgent] Analyzing sector impact...`]);
      setLiveMetrics(prev => ({ ...prev, agents: 2 }));
    });
    schedule(4500, () => {
      updateAgent("disruption", { status: "completed", summary: `Classified as ${scenario.expectedDisruption.impact_level} impact.`, timeMs: 820, confidence: 94 });
      setVisibleReasoning(prev => [...prev, scenario.reasoning[1]]);
      setActiveJson({ agent: "DisruptionAgent", payload: scenario.expectedDisruption });
    });

    // Supplier (6s)
    schedule(6000, () => {
      setStepIndex(2);
      updateAgent("supplier", { status: "running" });
      setLogs(prev => [...prev, `> [SupplierAgent] Searching global DB for alternatives in ${scenario.region}...`]);
      setLiveMetrics(prev => ({ ...prev, agents: 3 }));
    });
    schedule(7500, () => {
      updateAgent("supplier", { status: "completed", summary: `Found ${scenario.expectedAlternatives.alternatives.length} viable alternatives.`, timeMs: 1200, confidence: 89 });
      setVisibleReasoning(prev => [...prev, scenario.reasoning[2]]);
      setLiveMetrics(prev => ({ ...prev, suppliers: scenario.metrics.suppliers }));
      setActiveJson({ agent: "SupplierAgent", payload: scenario.expectedAlternatives });
    });

    // Risk (9s)
    schedule(9000, () => {
      setStepIndex(3);
      updateAgent("risk", { status: "running" });
      setLogs(prev => [...prev, `> [RiskAgent] Verifying compliance for ${scenario.expectedAlternatives.best_match}...`]);
      setLiveMetrics(prev => ({ ...prev, agents: 4 }));
    });
    schedule(10500, () => {
      updateAgent("risk", { status: "completed", summary: `Verified. Risk Level: ${scenario.expectedTrust[scenario.expectedAlternatives.best_match].risk_level}`, timeMs: 1540, confidence: 96 });
      setVisibleReasoning(prev => [...prev, scenario.reasoning[3]]);
      setLiveMetrics(prev => ({ ...prev, risks: scenario.metrics.risks }));
      setActiveJson({ agent: "RiskAgent", payload: scenario.expectedTrust });
    });

    // Strategy (12s)
    schedule(12000, () => {
      setStepIndex(4);
      updateAgent("strategy", { status: "running" });
      setLogs(prev => [...prev, `> [StrategyAgent] Formulating mitigation matrix...`]);
      setLiveMetrics(prev => ({ ...prev, agents: 5 }));
    });
    schedule(13500, () => {
      updateAgent("strategy", { status: "completed", summary: `Selected strategy: ${scenario.expectedStrategy.strategy}`, timeMs: 2100, confidence: scenario.expectedStrategy.confidence_score });
      setVisibleReasoning(prev => [...prev, scenario.reasoning[4]]);
      setActiveJson({ agent: "StrategyAgent", payload: scenario.expectedStrategy });
    });

    // Complete (15s)
    schedule(15000, () => {
      setStepIndex(5);
      setLogs(prev => [...prev, `> [Compliance Engine] Strategy approved. Execution trace securely logged for internal audit.`]);
    });

    return () => timeouts.forEach(clearTimeout);
  }, [scenario]);

  const activeStepId = STEPS[stepIndex];
  const isComplete = activeStepId === "completed";

  return (
    <div className={cn("transition-all duration-700 bg-[#020617] text-slate-200", presentationMode ? "fixed inset-0 z-50 overflow-y-auto p-6 md:p-12" : "space-y-8 animate-in fade-in")}>
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <div className="flex items-center space-x-3 mb-2">
            <div className="flex space-x-1">
              <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            </div>
            <span className="text-xs font-mono text-red-400 uppercase tracking-widest font-bold">Live Hackathon Demo Mode</span>
          </div>
          <h3 className="text-3xl font-bold text-white tracking-tight">{scenario.title}</h3>
          <p className="text-slate-400 mt-1 max-w-2xl">{scenario.description}</p>
        </div>
        <div className="flex space-x-4 self-stretch md:self-auto">
          <button onClick={() => setPresentationMode(!presentationMode)} className="px-4 py-2 text-sm border border-slate-700 hover:bg-slate-800 text-white rounded-md transition flex items-center justify-center">
            {presentationMode ? <Minimize className="w-4 h-4 mr-2" /> : <Maximize className="w-4 h-4 mr-2" />}
            {presentationMode ? "Exit Fullscreen" : "Presentation Mode"}
          </button>
          <button onClick={onReset} className="px-6 py-2 text-sm bg-indigo-600 hover:bg-indigo-500 text-white rounded-md transition font-medium shadow-lg shadow-indigo-900/20">
            End Demo
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        
        {/* Left Column: Visualization & Metrics */}
        <div className="xl:col-span-3 space-y-6">
          <Card className="bg-[#0f172a] border-slate-800 shadow-xl">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm uppercase tracking-wider text-slate-400 flex items-center">
                <Activity className="w-4 h-4 mr-2 text-indigo-400" /> Live Orchestration
              </CardTitle>
            </CardHeader>
            <CardContent>
              <AgentPipeline statuses={agentStatuses} />
            </CardContent>
          </Card>

          <Card className="bg-[#0f172a] border-slate-800 shadow-xl">
            <CardContent className="p-6">
              <h4 className="text-xs uppercase tracking-wider text-slate-500 font-bold mb-4 flex items-center">
                <BarChart3 className="w-4 h-4 mr-2 text-sky-400" /> Demo Metrics
              </h4>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-900/50 p-3 rounded-lg border border-slate-800 text-center">
                  <div className="text-2xl font-black text-indigo-400">{liveMetrics.agents}</div>
                  <div className="text-[10px] uppercase text-slate-500 font-bold mt-1">Agents Run</div>
                </div>
                <div className="bg-slate-900/50 p-3 rounded-lg border border-slate-800 text-center">
                  <div className="text-2xl font-black text-emerald-400">{isComplete ? scenario.metrics.time : "--"}</div>
                  <div className="text-[10px] uppercase text-slate-500 font-bold mt-1">Total Time</div>
                </div>
                <div className="bg-slate-900/50 p-3 rounded-lg border border-slate-800 text-center">
                  <div className="text-2xl font-black text-amber-400">{liveMetrics.suppliers}</div>
                  <div className="text-[10px] uppercase text-slate-500 font-bold mt-1">Suppliers Scored</div>
                </div>
                <div className="bg-slate-900/50 p-3 rounded-lg border border-slate-800 text-center">
                  <div className="text-2xl font-black text-red-400">{liveMetrics.risks}</div>
                  <div className="text-[10px] uppercase text-slate-500 font-bold mt-1">Risks Flagged</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Center Column: AI Reasoning & Terminal */}
        <div className="xl:col-span-5 space-y-6">
          <Card className="bg-[#0f172a] border-slate-800 shadow-xl h-full flex flex-col">
            <CardHeader className="pb-2 border-b border-slate-800">
              <CardTitle className="text-sm uppercase tracking-wider text-slate-400 flex items-center">
                <BrainCircuit className="w-4 h-4 mr-2 text-emerald-400" /> Featherless Strategic Reasoning
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 flex-1">
              <div className="space-y-4">
                <AnimatePresence>
                  {visibleReasoning.map((reason, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="flex items-start"
                    >
                      <div className="w-6 h-6 rounded-full bg-slate-800 flex items-center justify-center mr-3 mt-0.5 border border-slate-700 shrink-0">
                        <span className="text-xs font-bold text-slate-400">{i + 1}</span>
                      </div>
                      <p className="text-slate-300 leading-relaxed text-sm">{reason}</p>
                    </motion.div>
                  ))}
                  {!isComplete && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ repeat: Infinity, duration: 1 }}
                      className="flex items-center text-slate-500 text-sm mt-4 ml-9"
                    >
                      <Loader2 className="w-4 h-4 mr-2 animate-spin text-indigo-500" /> Synthesizing strategy...
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Transparency & Executive Report */}
        <div className="xl:col-span-4 space-y-6 flex flex-col">
          
          <Card className="bg-[#0a0f1c] border-slate-800 shadow-xl flex-1 flex flex-col overflow-hidden">
             <div className="flex items-center px-4 py-3 bg-[#161b26] border-b border-slate-800">
              <Server className="w-4 h-4 text-slate-500 mr-2" />
              <span className="text-slate-400 text-xs font-mono font-bold uppercase tracking-widest">Agent Transparency Drop</span>
            </div>
            <div className="p-4 flex-1 overflow-y-auto font-mono text-[11px] leading-relaxed relative">
               <AnimatePresence mode="wait">
                  {activeJson ? (
                    <motion.div
                      key={activeJson.agent}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="text-emerald-400"
                    >
                      <div className="text-slate-500 mb-2">{'//'} {activeJson.agent} Memory Context Payload</div>
                      <pre className="whitespace-pre-wrap break-words">{JSON.stringify(activeJson.payload, null, 2)}</pre>
                    </motion.div>
                  ) : (
                    <div className="text-slate-600 italic">Awaiting agent payload...</div>
                  )}
               </AnimatePresence>
            </div>
          </Card>

          <AnimatePresence>
            {isComplete && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-gradient-to-br from-indigo-900/40 to-slate-900 border border-indigo-500/30 rounded-xl p-6 shadow-2xl relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 p-4">
                   <ShieldCheck className="w-12 h-12 text-indigo-500/20" />
                </div>
                <h4 className="text-indigo-400 font-bold uppercase tracking-widest text-xs mb-4 flex items-center">
                  <CheckCircle2 className="w-4 h-4 mr-2" /> Executive Summary
                </h4>
                
                <div className="space-y-4 relative z-10">
                  <div>
                    <div className="text-[10px] uppercase text-slate-500 font-bold mb-1">Recommendation</div>
                    <div className="text-slate-200 text-sm">{scenario.executiveSummary.recommendation}</div>
                  </div>
                  <div>
                    <div className="text-[10px] uppercase text-slate-500 font-bold mb-1">Automated Action</div>
                    <div className="text-emerald-400 font-medium text-sm flex items-center">
                      <Zap className="w-3 h-3 mr-1" /> {scenario.executiveSummary.action}
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4 pt-2 border-t border-indigo-500/20">
                    <div>
                      <div className="text-[10px] uppercase text-slate-500 font-bold mb-1">Expected Outcome</div>
                      <div className="text-slate-300 text-xs">{scenario.executiveSummary.outcome}</div>
                    </div>
                    <div>
                      <div className="text-[10px] uppercase text-slate-500 font-bold mb-1">Estimated Impact</div>
                      <div className="text-slate-300 text-xs">{scenario.executiveSummary.impact}</div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          
        </div>
      </div>

      {/* Audit Log Terminal at bottom */}
      <Card className="bg-[#0D1117] border-slate-800 font-mono text-sm shadow-2xl mt-6">
        <div className="flex items-center px-4 py-2 bg-[#161B22] border-b border-slate-800">
          <Terminal className="w-4 h-4 text-slate-500 mr-2" />
          <span className="text-slate-400 mr-3 text-xs">sentinel-audit.log</span>
          <div className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 uppercase tracking-wider">
            Secure Audit Trail
          </div>
          <div className="ml-auto flex space-x-2">
            <div className="w-3 h-3 rounded-full bg-slate-700" />
            <div className="w-3 h-3 rounded-full bg-slate-700" />
            <div className="w-3 h-3 rounded-full bg-slate-700" />
          </div>
        </div>
        <CardContent className="p-4 h-[180px] overflow-y-auto">
          <div className="space-y-1 text-xs">
            <AnimatePresence>
              {logs.map((log, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className={`${log.includes("complete") || log.includes("approved") ? "text-emerald-400" : log.includes("Error") ? "text-red-400" : log.includes("Agent") ? "text-sky-300" : "text-slate-400"}`}
                >
                  <span className="text-slate-600 mr-2">[{new Date().toISOString().split('T')[1].substring(0, 8)}]</span>
                  {log}
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </CardContent>
      </Card>
      
    </div>
  );
}
