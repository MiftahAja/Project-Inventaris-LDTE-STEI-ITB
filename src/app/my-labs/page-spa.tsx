"use client";

import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import AuthLayout from "@/components/AuthLayout";
import { useAuth } from "@/lib/auth-context";
import { DoorOpen, Package } from "lucide-react";

export default function MyLabsPage() {
  const { user } = useAuth();
  const [labs, setLabs] = useState<{ id: number; namaRuang: string; deskripsi: string; unitCount: number }[]>([]);
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
        const assignedLabIds = assignedLabsData.labIds || [];

        // Filter labs to only show assigned ones
        const filteredLabs = ruangLabData.data
          .filter((lab: { id: number }) => assignedLabIds.includes(Number(lab.id)))
          .map((lab: Record<string, unknown>) => ({
            id: Number(lab.id),
            namaRuang: lab.namaRuang as string,
            deskripsi: (lab.deskripsi as string) || "",
            unitCount: (lab.unitCount as number) || 0,
          }));
        setLabs(filteredLabs);
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
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Lab Saya</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Anda ditugaskan di {labs.length} laboratorium
          </p>
        </div>

        {labs.length === 0 ? (
          <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 p-12 text-center">
            <DoorOpen className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              Belum Ditugaskan
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Anda belum ditugaskan ke lab manapun. Hubungi admin untuk penugasan.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {labs.map((lab) => (
              <Link
                key={lab.id}
                to={`/unit-barang?lab=${lab.id}`}
                className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 p-6 hover:shadow-lg transition-shadow"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="bg-blue-100 dark:bg-blue-900/30 p-3 rounded-xl">
                    <DoorOpen className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">
                      {lab.namaRuang}
                    </h3>
                    {lab.deskripsi && (
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {lab.deskripsi}
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                  <Package className="w-4 h-4" />
                  <span>{lab.unitCount} unit barang</span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </AuthLayout>
  );
}
