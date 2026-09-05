"use client";

import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import AuthLayout from "@/components/AuthLayout";
import RuangLabForm from "../../RuangLabForm";

export default function RuangLabEditPage() {
  const { id } = useParams<{ id: string }>();
  const [initialData, setInitialData] = useState<{ id: number; namaRuang: string; deskripsi: string } | undefined>(undefined);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`/api/ruang-lab?page=1&pageSize=100`);
        const data = await res.json();
        const rl = data.data.find((r: { id: number }) => Number(r.id) === Number(id));
        if (rl) {
          setInitialData({ id: Number(rl.id), namaRuang: rl.namaRuang, deskripsi: rl.deskripsi || "" });
        } else {
          setNotFound(true);
        }
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
          <p className="text-gray-500">Ruang Lab tidak ditemukan</p>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout>
      <RuangLabForm initialData={initialData} />
    </AuthLayout>
  );
}
