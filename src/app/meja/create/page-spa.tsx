"use client";

import { useState, useEffect } from "react";
import AuthLayout from "@/components/AuthLayout";
import { useAuth } from "@/lib/auth-context";
import MejaForm from "../MejaForm";

export default function MejaCreatePage() {
  const { user } = useAuth();
  const [ruangLabs, setRuangLabs] = useState<{ id: number; namaRuang: string }[]>([]);
  const [assignedLabIds, setAssignedLabIds] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [ruangLabRes, assignedLabsRes] = await Promise.all([
          fetch("/api/ruang-lab?page=1&pageSize=100"),
          fetch("/api/auth/assigned-labs"),
        ]);
        const ruangLabData = await ruangLabRes.json();
        const assignedLabsData = await assignedLabsRes.json();

        setRuangLabs(ruangLabData.data.map((rl: { id: number; namaRuang: string }) => ({
          id: Number(rl.id),
          namaRuang: rl.namaRuang,
        })));
        setAssignedLabIds(assignedLabsData.labIds || []);
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
      <MejaForm
        ruangLabs={ruangLabs}
        assignedLabIds={assignedLabIds}
        userRole={user?.role || ""}
      />
    </AuthLayout>
  );
}
