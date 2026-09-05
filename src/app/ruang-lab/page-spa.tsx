"use client";

import { useState, useEffect } from "react";
import AuthLayout from "@/components/AuthLayout";
import { useAuth } from "@/lib/auth-context";
import RuangLabClient from "./RuangLabClient";

export default function RuangLabPage() {
  const { user } = useAuth();
  const [ruangLabs, setRuangLabs] = useState<{ id: number; namaRuang: string; deskripsi: string; unitCount: number }[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("/api/ruang-lab?page=1&pageSize=10");
        const data = await res.json();
        setRuangLabs(data.data.map((rl: { id: number; namaRuang: string; deskripsi: string; unitCount: number }) => ({
          id: Number(rl.id),
          namaRuang: rl.namaRuang,
          deskripsi: rl.deskripsi || "",
          unitCount: rl.unitCount || 0,
        })));
        setTotal(data.total);
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
      <RuangLabClient
        initialRuangLabs={ruangLabs}
        initialTotal={total}
        userRole={user?.role || ""}
      />
    </AuthLayout>
  );
}
