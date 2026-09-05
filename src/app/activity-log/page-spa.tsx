"use client";

import { useState, useEffect } from "react";
import AuthLayout from "@/components/AuthLayout";
import ActivityLogClient from "./ActivityLogClient";

export default function ActivityLogPage() {
  const [logs, setLogs] = useState<{ id: number; logName: string; description: string; event: string; userName: string; createdAt: string }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("/api/activity-log");
        const data = await res.json();
        setLogs((data.data || data || []).map((log: Record<string, unknown>) => ({
          id: Number(log.id),
          logName: (log.logName as string) || "-",
          description: log.description as string,
          event: (log.event as string) || "-",
          userName: (log.userName as string) || "System",
          createdAt: (log.createdAt as string) || "",
        })));
      } catch (error) {
        console.error("Error:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <AuthLayout>
        <div className="flex items-center justify-center h-64">
          <div className="w-8 h-8 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin" />
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout>
      <ActivityLogClient logs={logs} />
    </AuthLayout>
  );
}
