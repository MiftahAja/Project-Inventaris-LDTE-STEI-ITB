"use client";

import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import AuthLayout from "@/components/AuthLayout";
import { useAuth } from "@/lib/auth-context";
import UnitBarangForm from "../../UnitBarangForm";

export default function UnitBarangEditPage() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const [initialData, setInitialData] = useState<{ id: number; barangId: number; kodeBarang: string; kondisiBarang: string; status: string; ruangLabId: number; mejaId: number } | undefined>(undefined);
  const [barangs, setBarangs] = useState<{ id: number; namaBarang: string }[]>([]);
  const [ruangLabs, setRuangLabs] = useState<{ id: number; namaRuang: string }[]>([]);
  const [mejas, setMejas] = useState<{ id: number; meja: string; ruangLabId: number }[]>([]);
  const [assignedLabIds, setAssignedLabIds] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [ubRes, bRes, rlRes, mRes, assignedLabsRes] = await Promise.all([
          fetch(`/api/unit-barang?page=1&pageSize=100`),
          fetch("/api/barang?page=1&pageSize=100"),
          fetch("/api/ruang-lab?page=1&pageSize=100"),
          fetch("/api/meja?page=1&pageSize=100"),
          fetch("/api/auth/assigned-labs"),
        ]);
        const ubData = await ubRes.json();
        const bData = await bRes.json();
        const rlData = await rlRes.json();
        const mData = await mRes.json();

        const ub = ubData.data.find((u: { id: number }) => Number(u.id) === Number(id));
        if (ub) {
          setInitialData({
            id: Number(ub.id),
            barangId: Number(ub.barangId),
            kodeBarang: ub.kodeBarang,
            kondisiBarang: ub.kondisiBarang,
            status: ub.status,
            ruangLabId: Number(ub.ruangLabId),
            mejaId: Number(ub.mejaId),
          });
        } else {
          setNotFound(true);
        }

        setBarangs(bData.data.map((b: { id: number; namaBarang: string }) => ({ id: Number(b.id), namaBarang: b.namaBarang })));
        setRuangLabs(rlData.data.map((rl: { id: number; namaRuang: string }) => ({ id: Number(rl.id), namaRuang: rl.namaRuang })));
        setMejas(mData.data.map((m: { id: number; meja: string; ruangLabId: number }) => ({ id: Number(m.id), meja: m.meja, ruangLabId: Number(m.ruangLabId) })));

        const assignedLabsData = await assignedLabsRes.json();
        setAssignedLabIds(assignedLabsData.labIds || []);
      } catch {
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  if (loading) {
    return (
      <AuthLayout>
        <div className="flex items-center justify-center h-64">
          <div className="w-8 h-8 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin" />
        </div>
      </AuthLayout>
    );
  }

  if (notFound) {
    return (
      <AuthLayout>
        <div className="flex items-center justify-center h-64">
          <p className="text-gray-500">Unit Barang tidak ditemukan</p>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout>
      <UnitBarangForm
        initialData={initialData}
        barangs={barangs}
        ruangLabs={ruangLabs}
        mejas={mejas}
        assignedLabIds={assignedLabIds}
        userRole={user?.role || ""}
      />
    </AuthLayout>
  );
}
