"use client";

import { useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { ArrowLeft, UserPlus, UserMinus } from "lucide-react";
import { formatDate } from "@/lib/utils";

interface Assignment {
  id: number;
  userName: string;
  isActive: boolean;
  createdAt: string;
}

interface Petugas {
  id: number;
  name: string;
}

interface AssignmentDetailClientProps {
  ruangLab: { id: number; namaRuang: string };
  assignments: Assignment[];
  petugas: Petugas[];
}

export default function AssignmentDetailClient({
  ruangLab,
  assignments,
  petugas,
}: AssignmentDetailClientProps) {
  const navigate = useNavigate();
  const [selectedPetugas, setSelectedPetugas] = useState("");
  const [loading, setLoading] = useState(false);

  const activeAssignment = assignments.find((a) => a.isActive);

  const handleAssign = async () => {
    if (!selectedPetugas) return;
    setLoading(true);

    try {
      const res = await fetch("/api/assignments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: selectedPetugas,
          ruangLabId: ruangLab.id,
        }),
      });

      if (res.ok) {
        window.location.reload();
        setSelectedPetugas("");
      }
    } catch (error) {
      console.error("Assign error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeactivate = async (assignmentId: number) => {
    setLoading(true);
    try {
      await fetch(`/api/assignments/${assignmentId}`, {
        method: "DELETE",
      });
      window.location.reload();
    } catch (error) {
      console.error("Deactivate error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link
          to="/assignments"
          className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            Kelola Penugasan - {ruangLab.namaRuang}
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            {activeAssignment
              ? `Petugas aktif: ${activeAssignment.userName}`
              : "Belum ada petugas yang ditugaskan"}
          </p>
        </div>
      </div>

      {/* Assign Form */}
      <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          {activeAssignment ? "Ganti Petugas" : "Tambah Penugasan"}
        </h3>
        <div className="flex items-end gap-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
              Pilih Petugas
            </label>
            <select
              value={selectedPetugas}
              onChange={(e) => setSelectedPetugas(e.target.value)}
              className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Pilih Petugas</option>
              {petugas.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>
          <button
            onClick={handleAssign}
            disabled={!selectedPetugas || loading}
            className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium rounded-lg transition-colors"
          >
            <UserPlus className="w-4 h-4" />
            {loading ? "Menyimpan..." : "Simpan"}
          </button>
        </div>
      </div>

      {/* Assignment History */}
      <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Riwayat Penugasan
        </h3>
        {assignments.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            Belum ada riwayat penugasan
          </p>
        ) : (
          <div className="space-y-3">
            {assignments.map((a) => (
              <div
                key={a.id}
                className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
              >
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {a.userName}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {formatDate(a.createdAt)}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className={`px-2 py-1 text-xs font-medium rounded-full ${
                      a.isActive
                        ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                        : "bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400"
                    }`}
                  >
                    {a.isActive ? "Aktif" : "Nonaktif"}
                  </span>
                  {a.isActive && (
                    <button
                      onClick={() => handleDeactivate(a.id)}
                      disabled={loading}
                      className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                    >
                      <UserMinus className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
