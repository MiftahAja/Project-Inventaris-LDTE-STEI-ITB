"use client";

import { useState, useEffect } from "react";
import AuthLayout from "@/components/AuthLayout";
import PetugasClient from "./PetugasClient";

export default function PetugasPage() {
  const [users, setUsers] = useState<{ id: number; name: string; email: string; noTelp: string; alamat: string }[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("/api/petugas?page=1&pageSize=10");
        const data = await res.json();
        setUsers(data.data.map((u: Record<string, unknown>) => ({
          id: Number(u.id),
          name: u.name as string,
          email: u.email as string,
          noTelp: (u.noTelp as string) || "-",
          alamat: (u.alamat as string) || "-",
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
      <PetugasClient initialUsers={users} initialTotal={total} />
    </AuthLayout>
  );
}
