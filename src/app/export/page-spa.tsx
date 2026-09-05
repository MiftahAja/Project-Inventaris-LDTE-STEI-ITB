"use client";

import { useState, useEffect } from "react";
import AuthLayout from "@/components/AuthLayout";
import { useAuth } from "@/lib/auth-context";
import ExportClient from "./ExportClient";

export default function ExportPage() {
  const { user } = useAuth();
  const [ruangLabs, setRuangLabs] = useState<{ id: number; namaRuang: string; deskripsi: string; mejas: { id: number; meja: string; unitBarangs: { id: number; kodeBarang: string; namaBarang: string; kondisiBarang: string; status: string }[] }[] }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("/api/ruang-lab?page=1&pageSize=100");
        const data = await res.json();
        setRuangLabs((data.data || []).map((lab: Record<string, unknown>) => ({
          id: Number(lab.id),
          namaRuang: lab.namaRuang as string,
          deskripsi: (lab.deskripsi as string) || "",
          mejas: (lab.mejas as Array<Record<string, unknown>> || []).map((m) => ({
            id: Number(m.id),
            meja: m.meja as string,
            unitBarangs: (m.unitBarangs as Array<Record<string, unknown>> || []).map((ub) => ({
              id: Number(ub.id),
              kodeBarang: ub.kodeBarang as string,
              namaBarang: ub.namaBarang as string,
              kondisiBarang: ub.kondisiBarang as string,
              status: ub.status as string,
            })),
          })),
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
      <ExportClient ruangLabs={ruangLabs} />
    </AuthLayout>
  );
}
