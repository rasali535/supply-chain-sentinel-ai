"use client";

import { useState, useEffect } from "react";
import { MemoryContext, LogEntry } from "../lib/core/types";

export interface DashboardData {
  activeWorkflow: MemoryContext | null;
  logs: LogEntry[];
  stats: {
    totalDisruptions: number;
    activeWorkflows: number;
    avgTrustScore: number;
    mitigatedRisks: number;
  };
}

export function useDashboardData() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const res = await fetch("/api/dashboard");
        if (res.ok) {
          const json = await res.json();
          setData({
            activeWorkflow: json.activeWorkflow,
            logs: json.logs,
            stats: json.stats
          });
        }
      } catch (err) {
        console.error("Failed to fetch dashboard data", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
    // Poll every 5 seconds
    const interval = setInterval(fetchDashboardData, 5000);
    return () => clearInterval(interval);
  }, []);

  return { data, loading };
}
