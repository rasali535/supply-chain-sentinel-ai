"use client";

import { motion } from "framer-motion";
import { ArrowDown, Radio, ActivitySquare, Users, ShieldAlert, Lightbulb } from "lucide-react";
import { cn } from "../../lib/utils";

const steps = [
  { id: "signal", label: "Signal Agent", icon: Radio, color: "text-sky-500", bg: "bg-sky-500/10", border: "border-sky-500/20" },
  { id: "disruption", label: "Disruption Agent", icon: ActivitySquare, color: "text-red-500", bg: "bg-red-500/10", border: "border-red-500/20" },
  { id: "supplier", label: "Supplier Agent", icon: Users, color: "text-emerald-500", bg: "bg-emerald-500/10", border: "border-emerald-500/20" },
  { id: "risk", label: "Risk Agent", icon: ShieldAlert, color: "text-purple-500", bg: "bg-purple-500/10", border: "border-purple-500/20" },
  { id: "strategy", label: "Strategy Agent", icon: Lightbulb, color: "text-amber-500", bg: "bg-amber-500/10", border: "border-amber-500/20" }
];

export function AgentPipeline({ activeStep }: { activeStep?: string }) {
  // Determine current active index based on logs or simply animate them all for the demo.
  // We'll animate sequentially.
  
  return (
    <div className="flex flex-col items-center py-8">
      {steps.map((step, index) => {
        const isActive = activeStep === step.id || !activeStep; // if no specific step, highlight all
        
        return (
          <div key={step.id} className="flex flex-col items-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.3 }}
              className={cn(
                "w-64 p-4 rounded-xl border flex items-center shadow-lg",
                step.bg, step.border,
                isActive ? "opacity-100 ring-2 ring-indigo-500/50" : "opacity-50 grayscale"
              )}
            >
              <div className={cn("p-3 rounded-lg bg-slate-950 mr-4", step.color)}>
                <step.icon className="w-6 h-6" />
              </div>
              <div className="font-semibold text-slate-200">{step.label}</div>
            </motion.div>
            
            {index < steps.length - 1 && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 32, opacity: 1 }}
                transition={{ delay: index * 0.3 + 0.2 }}
                className="my-2"
              >
                <ArrowDown className="w-6 h-6 text-slate-600 animate-pulse" />
              </motion.div>
            )}
          </div>
        );
      })}
    </div>
  );
}
