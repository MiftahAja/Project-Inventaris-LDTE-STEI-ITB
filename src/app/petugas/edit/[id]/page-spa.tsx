"use client";

import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import AuthLayout from "@/components/AuthLayout";
import PetugasForm from "../../PetugasForm";

export default function PetugasEditPage() {
  const { id } = useParams<{ id: string }>();
  const [initialData, setInitialData] = useState<{ id: number; name: string; email: string } | undefined>(undefined);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`/api/petugas?page=1&pageSize=100`);
        const data = await res.json();
        const user = data.data.find((u: { id: number }) => Number(u.id) === Number(id));
        if (user) {
          setInitialData({ id: Number(user.id), name: user.name, email: user.email });
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
          <p className="text-gray-500">Petugas tidak ditemukan</p>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout>
      <PetugasForm initialData={initialData} isEdit />
    </AuthLayout>
  );
}
