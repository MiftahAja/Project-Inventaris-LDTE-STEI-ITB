"use client";

import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import AuthLayout from "@/components/AuthLayout";
import BarangForm from "../../BarangForm";

export default function BarangEditPage() {
  const { id } = useParams<{ id: string }>();
  const [initialData, setInitialData] = useState<{ id: number; namaBarang: string } | undefined>(undefined);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`/api/barang?page=1&pageSize=100`);
        const data = await res.json();
        const barang = data.data.find((b: { id: number }) => Number(b.id) === Number(id));
        if (barang) {
          setInitialData({ id: Number(barang.id), namaBarang: barang.namaBarang });
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
          <p className="text-gray-500">Barang tidak ditemukan</p>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout>
      <BarangForm initialData={initialData} />
    </AuthLayout>
  );
}
