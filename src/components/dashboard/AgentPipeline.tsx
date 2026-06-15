"use client";

import { motion } from "framer-motion";
import { ArrowDown, Radio, ActivitySquare, Users, ShieldAlert, Lightbulb, CheckCircle2, Loader2, XCircle } from "lucide-react";
import { cn } from "../../lib/utils";

const stepsConfig = [
  { id: "signal", label: "Signal Agent", icon: Radio, color: "text-sky-500", bg: "bg-sky-500/10", border: "border-sky-500/20" },
  { id: "disruption", label: "Disruption Agent", icon: ActivitySquare, color: "text-red-500", bg: "bg-red-500/10", border: "border-red-500/20" },
  { id: "supplier", label: "Supplier Agent", icon: Users, color: "text-emerald-500", bg: "bg-emerald-500/10", border: "border-emerald-500/20" },
  { id: "risk", label: "Risk Agent", icon: ShieldAlert, color: "text-purple-500", bg: "bg-purple-500/10", border: "border-purple-500/20" },
  { id: "strategy", label: "Strategy Agent", icon: Lightbulb, color: "text-amber-500", bg: "bg-amber-500/10", border: "border-amber-500/20" }
];

export interface AgentStepStatus {
  id: string;
  status: "waiting" | "running" | "completed" | "failed";
  summary?: string;
  confidence?: number;
  timeMs?: number;
}

export function AgentPipeline({ statuses }: { statuses?: AgentStepStatus[] }) {
  
  return (
    <div className="flex flex-col items-stretch w-full py-2 space-y-2">
      {stepsConfig.map((step, index) => {
        const stepStatus = statuses?.find(s => s.id === step.id);
        const status = stepStatus?.status || "waiting";
        const isWaiting = status === "waiting";
        const isRunning = status === "running";
        const isCompleted = status === "completed";
        const isFailed = status === "failed";
        
        return (
          <div key={step.id} className="flex flex-col items-center w-full relative">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={cn(
                "w-full p-4 rounded-xl border flex flex-col shadow-lg transition-all duration-500",
                step.bg, 
                isRunning ? `ring-2 ring-indigo-500/50 ${step.border} opacity-100` : 
                isCompleted ? `${step.border} opacity-100` :
                isFailed ? "border-red-500/50 opacity-100" :
                "border-slate-800/50 opacity-40 grayscale"
              )}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={cn("p-2 rounded-lg bg-slate-950", step.color)}>
                    <step.icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-200 text-sm">{step.label}</h4>
                    <div className="flex items-center space-x-2 mt-1">
                      {isWaiting && <span className="text-[10px] uppercase text-slate-500 font-bold tracking-wider">Waiting</span>}
                      {isRunning && <span className="text-[10px] uppercase text-indigo-400 font-bold tracking-wider flex items-center"><Loader2 className="w-3 h-3 mr-1 animate-spin" /> Running</span>}
                      {isCompleted && <span className="text-[10px] uppercase text-emerald-400 font-bold tracking-wider flex items-center"><CheckCircle2 className="w-3 h-3 mr-1" /> Completed</span>}
                      {isFailed && <span className="text-[10px] uppercase text-red-400 font-bold tracking-wider flex items-center"><XCircle className="w-3 h-3 mr-1" /> Failed</span>}
                      
                      {stepStatus?.timeMs && (
                        <span className="text-[10px] text-slate-500 border-l border-slate-700 pl-2">
                          {stepStatus.timeMs}ms
                        </span>
                      )}
                      {stepStatus?.confidence && (
                        <span className="text-[10px] text-indigo-300 border-l border-slate-700 pl-2">
                          {stepStatus.confidence}% Conf.
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              
              {stepStatus?.summary && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  className="mt-3 pt-3 border-t border-slate-800/50 text-xs text-slate-400"
                >
                  {stepStatus.summary}
                </motion.div>
              )}
            </motion.div>
            
            {index < stepsConfig.length - 1 && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 16, opacity: 1 }}
                transition={{ delay: index * 0.1 + 0.1 }}
                className="my-1"
              >
                <ArrowDown className={cn("w-4 h-4", isCompleted ? step.color : "text-slate-700")} />
              </motion.div>
            )}
          </div>
        );
      })}
    </div>
  );
}
