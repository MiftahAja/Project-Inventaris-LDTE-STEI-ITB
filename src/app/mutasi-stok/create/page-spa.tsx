"use client";

import { useState, useEffect } from "react";
import AuthLayout from "@/components/AuthLayout";
import MutasiStokForm from "../MutasiStokForm";

export default function MutasiStokCreatePage() {
  const [unitBarangs, setUnitBarangs] = useState<{ id: number; kodeBarang: string; namaBarang: string }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("/api/unit-barang?page=1&pageSize=100");
        const data = await res.json();
        setUnitBarangs(data.data.map((ub: Record<string, unknown>) => ({
          id: Number(ub.id),
          kodeBarang: ub.kodeBarang as string,
          namaBarang: ub.namaBarang as string,
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
      <MutasiStokForm unitBarangs={unitBarangs} />
    </AuthLayout>
  );
}
