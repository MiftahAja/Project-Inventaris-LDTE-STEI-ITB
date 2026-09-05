"use client";

import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import AuthLayout from "@/components/AuthLayout";
import { useAuth } from "@/lib/auth-context";
import MejaForm from "../../MejaForm";

export default function MejaEditPage() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const [initialData, setInitialData] = useState<{ id: number; meja: string; ruangLabId: number } | undefined>(undefined);
  const [ruangLabs, setRuangLabs] = useState<{ id: number; namaRuang: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [mejaRes, ruangLabRes] = await Promise.all([
          fetch(`/api/meja?page=1&pageSize=100`),
          fetch(`/api/ruang-lab?page=1&pageSize=100`),
        ]);
        const mejaData = await mejaRes.json();
        const ruangLabData = await ruangLabRes.json();

        const meja = mejaData.data.find((m: { id: number }) => Number(m.id) === Number(id));
        if (meja) {
          setInitialData({ id: Number(meja.id), meja: meja.meja, ruangLabId: Number(meja.ruangLabId) });
        } else {
          setNotFound(true);
        }

        setRuangLabs(ruangLabData.data.map((rl: { id: number; namaRuang: string }) => ({
          id: Number(rl.id),
          namaRuang: rl.namaRuang,
        })));
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
          <p className="text-gray-500">Meja tidak ditemukan</p>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout>
      <MejaForm
        initialData={initialData}
        ruangLabs={ruangLabs}
        assignedLabIds={[]}
        userRole={user?.role || ""}
      />
    </AuthLayout>
  );
}
