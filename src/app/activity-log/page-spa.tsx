"use client";

import { useState, useEffect, useCallback } from "react";
import AuthLayout from "@/components/AuthLayout";
import ActivityLogClient from "./ActivityLogClient";

const PAGE_SIZE = 20;

export default function ActivityLogPage() {
  const [pageSize, setPageSize] = useState(PAGE_SIZE);
  const [logs, setLogs] = useState<{ id: number; logName: string; description: string; event: string; userName: string; createdAt: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  const fetchData = useCallback(async (page: number) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/activity-log?page=${page}&pageSize=${pageSize}`);
      const data = await res.json();
      console.log("[ACT] api res", { page, pageSize, hasData: Array.isArray(data?.data), total: data?.total });
      setLogs((data.data || data || []).map((log: Record<string, unknown>) => ({
        id: Number(log.id),
        logName: (log.logName as string) || "-",
        description: log.description as string,
        event: (log.event as string) || "-",
        userName: (log.userName as string) || "System",
        createdAt: (log.createdAt as string) || "",
      })));
      setTotalItems(data.total || 0);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  }, [pageSize]);

  useEffect(() => {
    fetchData(currentPage);
  }, [currentPage, fetchData]);

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
      <ActivityLogClient
        logs={logs}
        totalItems={totalItems}
        currentPage={currentPage}
        onPageChange={setCurrentPage}
        itemsPerPage={pageSize}
        pageSizeOptions={[10, 20, 50, 100]}
        onPageSizeChange={setPageSize}
      />
    </AuthLayout>
  );
}
