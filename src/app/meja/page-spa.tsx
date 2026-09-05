"use client";

import { useState, useEffect } from "react";
import AuthLayout from "@/components/AuthLayout";
import { useAuth } from "@/lib/auth-context";
import MejaClient from "./MejaClient";

export default function MejaPage() {
  const { user } = useAuth();
  const [mejas, setMejas] = useState<{ id: number; meja: string; ruangLab: string; ruangLabId: number; barangCount: number }[]>([]);
  const [total, setTotal] = useState(0);
  const [unitBarangByMeja, setUnitBarangByMeja] = useState<Record<number, { id: number; kodeBarang: string; namaBarang: string; kondisiBarang: string; status: string }[]>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [mejaRes, ruangLabRes] = await Promise.all([
          fetch("/api/meja?page=1&pageSize=10"),
          fetch("/api/ruang-lab?page=1&pageSize=100"),
        ]);
        const mejaData = await mejaRes.json();
        const ruangLabData = await ruangLabRes.json();

        setMejas(mejaData.data.map((m: { id: number; meja: string; ruangLab: string; ruangLabId: number; barangCount: number }) => ({
          id: Number(m.id),
          meja: m.meja,
          ruangLab: m.ruangLab,
          ruangLabId: Number(m.ruangLabId),
          barangCount: m.barangCount || 0,
        })));
        setTotal(mejaData.total);
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
      <MejaClient
        initialMejas={mejas}
        initialTotal={total}
        unitBarangByMeja={unitBarangByMeja}
        userRole={user?.role || ""}
        assignedLabIds={[]}
      />
    </AuthLayout>
  );
}
