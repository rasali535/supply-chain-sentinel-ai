"use client";

import { useDashboardData } from "../../../hooks/useDashboardData";
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card";
import { ActivitySquare, Clock } from "lucide-react";
import { ScrollArea } from "../../../components/ui/scroll-area";

export default function AgentActivityCenter() {
  const { data, loading } = useDashboardData();

  if (loading) return <div className="animate-pulse">Loading Activity Center...</div>;

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Agent Activity Center</h2>
        <p className="text-muted-foreground mt-2">Real-time execution log of the Band agent network.</p>
      </div>

      <Card className="bg-slate-900 border-slate-800">
        <CardHeader className="flex flex-row items-center space-x-2">
           <ActivitySquare className="w-5 h-5 text-purple-500"/>
          <CardTitle className="text-slate-200">Execution Logs</CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[600px] w-full rounded-md border border-slate-800 bg-slate-950 p-4">
            <div className="space-y-6 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-800 before:to-transparent">
              {data?.logs.map((log) => (
                <div key={log.id} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                  
                  {/* Icon */}
                  <div className="flex items-center justify-center w-10 h-10 rounded-full border border-slate-700 bg-slate-900 text-slate-400 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2">
                    <ActivitySquare className="w-4 h-4" />
                  </div>
                  
                  {/* Card */}
                  <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-lg border border-slate-800 bg-slate-900 shadow-sm">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-semibold text-purple-400">{log.agent}</span>
                      <time className="text-xs font-medium text-slate-500 flex items-center">
                        <Clock className="w-3 h-3 mr-1"/>
                        {new Date(log.timestamp).toLocaleTimeString()}
                      </time>
                    </div>
                    <div className="text-slate-300 text-sm">
                      {log.action}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
}
