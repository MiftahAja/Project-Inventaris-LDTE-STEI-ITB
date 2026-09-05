"use client";

import { useState, useEffect } from "react";
import AuthLayout from "@/components/AuthLayout";
import { useAuth } from "@/lib/auth-context";
import UnitBarangForm from "../UnitBarangForm";

export default function UnitBarangCreatePage() {
  const { user } = useAuth();
  const [barangs, setBarangs] = useState<{ id: number; namaBarang: string }[]>([]);
  const [ruangLabs, setRuangLabs] = useState<{ id: number; namaRuang: string }[]>([]);
  const [mejas, setMejas] = useState<{ id: number; meja: string; ruangLabId: number }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [bRes, rlRes, mRes] = await Promise.all([
          fetch("/api/barang?page=1&pageSize=100"),
          fetch("/api/ruang-lab?page=1&pageSize=100"),
          fetch("/api/meja?page=1&pageSize=100"),
        ]);
        const bData = await bRes.json();
        const rlData = await rlRes.json();
        const mData = await mRes.json();

        setBarangs(bData.data.map((b: { id: number; namaBarang: string }) => ({ id: Number(b.id), namaBarang: b.namaBarang })));
        setRuangLabs(rlData.data.map((rl: { id: number; namaRuang: string }) => ({ id: Number(rl.id), namaRuang: rl.namaRuang })));
        setMejas(mData.data.map((m: { id: number; meja: string; ruangLabId: number }) => ({ id: Number(m.id), meja: m.meja, ruangLabId: Number(m.ruangLabId) })));
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
      <UnitBarangForm
        barangs={barangs}
        ruangLabs={ruangLabs}
        mejas={mejas}
        assignedLabIds={[]}
        userRole={user?.role || ""}
      />
    </AuthLayout>
  );
}
