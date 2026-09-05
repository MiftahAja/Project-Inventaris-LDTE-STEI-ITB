"use client";

import { useState, useEffect } from "react";
import AuthLayout from "@/components/AuthLayout";
import MutasiStokClient from "./MutasiStokClient";

export default function MutasiStokPage() {
  const [mutasiStoks, setMutasiStoks] = useState<{ id: number; namaBarang: string; kodeBarang: string; tanggal: string; tipe: string; keterangan: string }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("/api/mutasi-stok");
        const data = await res.json();
        setMutasiStoks((data.data || data || []).map((ms: Record<string, unknown>) => ({
          id: Number(ms.id),
          namaBarang: ms.namaBarang as string,
          kodeBarang: ms.kodeBarang as string,
          tanggal: ms.tanggal as string,
          tipe: ms.tipe as string,
          keterangan: (ms.keterangan as string) || "-",
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
      <MutasiStokClient mutasiStoks={mutasiStoks} />
    </AuthLayout>
  );
}
