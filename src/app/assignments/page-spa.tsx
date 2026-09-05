"use client";

import { useState, useEffect } from "react";
import AuthLayout from "@/components/AuthLayout";
import AssignmentClient from "./AssignmentClient";
import { DoorOpen, Users, AlertCircle } from "lucide-react";

export default function AssignmentsPage() {
  const [ruangLabs, setRuangLabs] = useState<{ id: number; namaRuang: string; deskripsi: string; petugas: string | null; isActive: boolean }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("/api/assignments");
        const data = await res.json();
        setRuangLabs((data.data || data || []).map((rl: Record<string, unknown>) => ({
          id: Number(rl.id),
          namaRuang: rl.namaRuang as string,
          deskripsi: (rl.deskripsi as string) || "",
          petugas: (rl.petugas as string) || null,
          isActive: rl.isActive as boolean,
        })));
      } catch (error) {
        console.error("Error:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const totalLabs = ruangLabs.length;
  const assignedLabs = ruangLabs.filter((rl) => rl.isActive).length;
  const unassignedLabs = totalLabs - assignedLabs;

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
      <div className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-5 border border-blue-200 dark:border-blue-800">
            <div className="flex items-center gap-3">
              <div className="bg-blue-500 p-3 rounded-xl">
                <DoorOpen className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Total Lab</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{totalLabs}</p>
              </div>
            </div>
          </div>

          <div className="bg-green-50 dark:bg-green-900/20 rounded-xl p-5 border border-green-200 dark:border-green-800">
            <div className="flex items-center gap-3">
              <div className="bg-green-500 p-3 rounded-xl">
                <Users className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Lab Ditugaskan</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{assignedLabs}</p>
              </div>
            </div>
          </div>

          <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-xl p-5 border border-yellow-200 dark:border-yellow-800">
            <div className="flex items-center gap-3">
              <div className="bg-yellow-500 p-3 rounded-xl">
                <AlertCircle className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Belum Ditugaskan</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{unassignedLabs}</p>
              </div>
            </div>
          </div>
        </div>

        <AssignmentClient ruangLabs={ruangLabs} />
      </div>
    </AuthLayout>
  );
}
