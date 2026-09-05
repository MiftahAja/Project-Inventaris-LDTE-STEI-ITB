"use client";

import { useState, useEffect } from "react";
import AuthLayout from "@/components/AuthLayout";
import { useAuth } from "@/lib/auth-context";
import ExportClient from "./ExportClient";

export default function ExportPage() {
  const { user } = useAuth();
  const [ruangLabs, setRuangLabs] = useState<{ id: number; namaRuang: string; deskripsi: string; mejas: { id: number; meja: string; unitBarangs: { id: number; kodeBarang: string; namaBarang: string; kondisiBarang: string; status: string }[] }[] }[]>([]);
  const [assignedLabIds, setAssignedLabIds] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch metadata from /api/ruang-lab (no pagination/limited, adjust as needed)
        // Note: For now, I'll fetch a larger page size to ensure all labs are loaded
        const [labsRes, assignedRes] = await Promise.all([
          fetch("/api/ruang-lab?page=1&pageSize=100"),
          fetch("/api/auth/assigned-labs"),
        ]);
        const labsJson = await labsRes.json();
        const assignedData = await assignedRes.json();

        // Map response to match expected structure in ExportClient
        // Note: ExportClient expects 'mejas' which might not be fully populated here
        // If ExportClient needs mejas, I might need to adjust or handle this.
        // Let's re-examine ExportClient requirements.
        const labs = (labsJson.data || []).map((lab: { id: number | string; namaRuang: string; deskripsi?: string }) => ({
          id: Number(lab.id),
          namaRuang: lab.namaRuang,
          deskripsi: lab.deskripsi || "",
          mejas: [], 
        }));

        console.log("[EXPORT] fetched labs metadata", { total: labs.length });

        setRuangLabs(labs);
        setAssignedLabIds(assignedData.labIds || []);
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
      <ExportClient
        ruangLabs={ruangLabs}
        userRole={user?.role || ""}
        assignedLabIds={assignedLabIds}
      />
    </AuthLayout>
  );
}
