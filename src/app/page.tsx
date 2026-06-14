"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Activity, AlertTriangle, Box, Globe, ShieldAlert, Zap, MapPin } from "lucide-react";
import { motion } from "framer-motion";

export default function Dashboard() {
  const [query, setQuery] = useState("");
  const [isRunning, setIsRunning] = useState(false);
  const [data, setData] = useState<any>(null);
  
  const [events, setEvents] = useState([
    { id: 1, agent: "System", action: "Ready for input", time: "Just now" }
  ]);
  
  const handleRun = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query) return;
    setIsRunning(true);
    setEvents(prev => [...prev, { id: Date.now(), agent: "User", action: `Query: "${query}"`, time: "Just now" }]);
    
    try {
      // Simulate sequential Band multi-agent execution
      setTimeout(() => setEvents(prev => [...prev, { id: Date.now(), agent: "Signal Monitoring", action: "Analyzing supply chain inputs...", time: "Just now" }]), 500);
      setTimeout(() => setEvents(prev => [...prev, { id: Date.now(), agent: "Disruption Detection", action: "Classifying risk and severity...", time: "Just now" }]), 1500);
      setTimeout(() => setEvents(prev => [...prev, { id: Date.now(), agent: "Alternative Supplier", action: "Matching global suppliers...", time: "Just now" }]), 2500);
      setTimeout(() => setEvents(prev => [...prev, { id: Date.now(), agent: "AI/ML Risk Scoring", action: "Evaluating supplier trust metrics...", time: "Just now" }]), 3500);
      setTimeout(() => setEvents(prev => [...prev, { id: Date.now(), agent: "Strategy (Featherless)", action: "Generating final recommendation...", time: "Just now" }]), 4500);

      const res = await fetch("/api/agents/run", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query }),
      });
      
      const result = await res.json();
      
      setTimeout(() => {
        if (result.success) {
          setData(result.agents);
          setEvents(prev => [...prev, { id: Date.now(), agent: "System", action: "Workflow completed successfully", time: "Just now" }]);
        }
        setIsRunning(false);
      }, 5000); // sync with UI simulation
      
    } catch (err) {
      console.error(err);
      setIsRunning(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 dark p-4 md:p-8 font-sans selection:bg-blue-500/30">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header */}
        <header className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-500/10 rounded-lg border border-blue-500/20">
              <Globe className="w-6 h-6 text-blue-400" />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
                SupplyChain Sentinel AI
              </h1>
              <p className="text-sm text-slate-400">Autonomous Multi-Agent Intelligence</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Badge variant="outline" className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20">
              <span className="w-2 h-2 rounded-full bg-emerald-500 mr-2 animate-pulse"></span>
              Band Orchestration Active (5 Agents)
            </Badge>
          </div>
        </header>

        {/* Input Area */}
        <Card className="bg-slate-900 border-slate-800 shadow-xl overflow-hidden">
          <CardContent className="p-0">
            <form onSubmit={handleRun} className="flex flex-col sm:flex-row items-center p-2 relative">
              <div className="absolute left-6 text-slate-500 hidden sm:block">
                <Zap className="w-5 h-5" />
              </div>
              <input 
                type="text" 
                placeholder="Describe a supply chain event (e.g., 'There is a cement shortage in Botswana')"
                className="flex-1 bg-transparent border-none outline-none sm:pl-12 px-4 py-4 text-lg text-slate-100 placeholder:text-slate-600 focus:ring-0 w-full"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                disabled={isRunning}
              />
              <button 
                type="submit"
                disabled={isRunning || !query}
                className="w-full sm:w-auto px-6 py-3 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:hover:bg-blue-600 text-white rounded-md font-medium transition-all sm:mr-2 flex items-center justify-center gap-2"
              >
                {isRunning ? (
                  <><span className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></span> Processing</>
                ) : (
                  <>Analyze Signal</>
                )}
              </button>
            </form>
          </CardContent>
        </Card>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Left Column: Intelligence & Strategy */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Risk Overview */}
            <Card className="bg-slate-900 border-slate-800 shadow-lg">
              <CardHeader className="pb-3 border-b border-slate-800/50">
                <CardTitle className="flex items-center gap-2 text-lg font-medium text-slate-200">
                  <ShieldAlert className="w-5 h-5 text-rose-400" />
                  Risk & Disruption Intelligence
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="flex flex-col md:flex-row gap-6">
                  <div className="flex-1 space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400 text-sm">Detected Signal</span>
                      <Badge variant="secondary" className="bg-slate-800 text-slate-300">
                        {data ? data.signalMonitoring.signal : "Awaiting Input"}
                      </Badge>
                    </div>
                    <Separator className="bg-slate-800" />
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400 text-sm">Disruption Classification</span>
                      <Badge variant="secondary" className="bg-slate-800 text-slate-300">
                        {data ? data.disruptionDetection.disruption : "--"}
                      </Badge>
                    </div>
                    <Separator className="bg-slate-800" />
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-slate-400 text-sm">Severity Impact</span>
                        <span className={`text-sm font-medium ${data && data.disruptionDetection.impact_level === "high" ? "text-rose-400" : "text-slate-300"}`}>
                          {data ? data.disruptionDetection.impact_level.toUpperCase() : "--"}
                        </span>
                      </div>
                      <Progress 
                        value={data ? (data.disruptionDetection.impact_level === 'high' ? 90 : 50) : 0} 
                        className="h-2 bg-slate-800" 
                        indicatorClassName={data && data.disruptionDetection.impact_level === "high" ? "bg-rose-500" : "bg-slate-600"} 
                      />
                    </div>
                  </div>
                  <div className={`w-full md:w-1/3 rounded-lg p-4 border flex items-center justify-center min-h-[120px] transition-all ${data ? 'bg-rose-500/10 border-rose-500/20' : 'bg-slate-800/50 border-slate-700/50'}`}>
                    {data ? (
                      <div className="text-center">
                        <AlertTriangle className="w-8 h-8 text-rose-400 mx-auto mb-2" />
                        <span className="text-rose-200 font-medium">Critical Alert</span>
                        <p className="text-xs text-rose-300/70 mt-1">Region: {data.signalMonitoring.region}</p>
                      </div>
                    ) : (
                      <p className="text-sm text-slate-500 text-center">Awaiting signal detection...</p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Strategy & Recommendations */}
            <Card className="bg-slate-900 border-slate-800 shadow-lg relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-full blur-3xl"></div>
              <CardHeader className="pb-3 border-b border-slate-800/50">
                <CardTitle className="flex items-center gap-2 text-lg font-medium text-slate-200">
                  <Activity className="w-5 h-5 text-indigo-400" />
                  Strategic Action Plan
                </CardTitle>
                <CardDescription className="text-slate-400">Generated by Featherless AI Reasoning</CardDescription>
              </CardHeader>
              <CardContent className="pt-6 min-h-[160px] flex items-center justify-center text-slate-500">
                {data ? (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="w-full space-y-4">
                    <div className="p-4 bg-indigo-500/10 border border-indigo-500/20 rounded-lg">
                      <h4 className="text-indigo-300 font-medium mb-1">Recommended Strategy</h4>
                      <p className="text-slate-200">{data.strategy.strategy || data.strategy.recommendation}</p>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-4 bg-slate-800/50 rounded-lg">
                        <span className="text-xs text-slate-400 block mb-1">Expected Impact</span>
                        <span className="text-sm text-slate-300">{data.strategy.expected_impact || "Mitigates disruption"}</span>
                      </div>
                      <div className="p-4 bg-slate-800/50 rounded-lg">
                        <span className="text-xs text-slate-400 block mb-1">Sector Affected</span>
                        <span className="text-sm text-slate-300 capitalize">{data.disruptionDetection.affected_sector}</span>
                      </div>
                    </div>
                  </motion.div>
                ) : (
                  <p>Submit a query to generate AI-driven logistics strategy.</p>
                )}
              </CardContent>
            </Card>

          </div>

          {/* Right Column: Suppliers & Timeline */}
          <div className="space-y-6">
            
            {/* Alternative Suppliers */}
            <Card className="bg-slate-900 border-slate-800 shadow-lg">
              <CardHeader className="pb-3 border-b border-slate-800/50">
                <CardTitle className="flex items-center gap-2 text-lg font-medium text-slate-200">
                  <Box className="w-5 h-5 text-orange-400" />
                  Supplier Alternatives
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4 px-2">
                <ScrollArea className="h-[200px] px-4">
                  {data ? (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-3 pb-2">
                      <div className="p-3 bg-orange-500/10 border border-orange-500/20 rounded-lg">
                        <div className="flex justify-between items-start mb-2">
                          <span className="font-medium text-orange-200">{data.alternativeSupplier.best_match}</span>
                          <Badge variant="outline" className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20">
                            Score: {data.riskScoring.trust_score}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-1 text-xs text-slate-400">
                          <MapPin className="w-3 h-3" />
                          {data.alternativeSupplier.location}
                        </div>
                        <div className="mt-2 text-xs">
                          <span className="text-slate-500">AI/ML Risk Level: </span>
                          <span className="text-emerald-400 capitalize">{data.riskScoring.risk_level}</span>
                        </div>
                      </div>
                      
                      {data.alternativeSupplier.alternatives.filter((a: string) => a !== data.alternativeSupplier.best_match).map((alt: string, i: number) => (
                        <div key={i} className="p-3 bg-slate-800/50 rounded-lg border border-slate-700/50">
                          <span className="text-sm text-slate-300 block">{alt}</span>
                          <span className="text-xs text-slate-500">Alternative Match</span>
                        </div>
                      ))}
                    </motion.div>
                  ) : (
                    <div className="flex flex-col gap-3 py-2 items-center justify-center h-full text-slate-500 text-sm">
                      No alternatives sourced yet.
                    </div>
                  )}
                </ScrollArea>
              </CardContent>
            </Card>

            {/* Agent Timeline */}
            <Card className="bg-slate-900 border-slate-800 shadow-lg flex-1">
              <CardHeader className="pb-3 border-b border-slate-800/50">
                <CardTitle className="flex items-center gap-2 text-lg font-medium text-slate-200">
                  <Activity className="w-5 h-5 text-blue-400" />
                  Agent Execution Flow
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4 px-2">
                <ScrollArea className="h-[250px] px-4">
                  <div className="space-y-4 py-2">
                    {events.map((event, i) => (
                      <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} key={event.id} className="flex gap-3 relative">
                        {i !== events.length - 1 && (
                          <div className="absolute left-2.5 top-7 w-[1px] h-full bg-slate-800"></div>
                        )}
                        <div className={`relative z-10 w-5 h-5 rounded-full border flex items-center justify-center shrink-0 mt-0.5 ${
                          event.agent === 'System' ? 'bg-slate-800 border-slate-700' : 'bg-blue-500/20 border-blue-500/50'
                        }`}>
                          <div className={`w-1.5 h-1.5 rounded-full ${event.agent === 'System' ? 'bg-slate-400' : 'bg-blue-400'}`}></div>
                        </div>
                        <div className="flex-1 pb-2">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-sm font-medium text-slate-300">{event.agent}</span>
                            <span className="text-xs text-slate-500">{event.time}</span>
                          </div>
                          <p className="text-sm text-slate-400">{event.action}</p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>

          </div>
        </div>
      </div>
    </div>
  );
}
