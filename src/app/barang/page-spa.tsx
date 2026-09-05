"use client";

import { useState, useEffect } from "react";
import AuthLayout from "@/components/AuthLayout";
import { useAuth } from "@/lib/auth-context";
import BarangClient from "./BarangClient";

export default function BarangPage() {
  const { user } = useAuth();
  const [barangs, setBarangs] = useState<{ id: number; namaBarang: string; createdAt: string }[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("/api/barang?page=1&pageSize=10");
        const data = await res.json();
        setBarangs(data.data.map((b: { id: number; namaBarang: string; createdAt: string }) => ({
          id: Number(b.id),
          namaBarang: b.namaBarang,
          createdAt: b.createdAt || "",
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
      <BarangClient
        initialBarangs={barangs}
        initialTotal={total}
        userRole={user?.role || ""}
      />
    </AuthLayout>
  );
}
