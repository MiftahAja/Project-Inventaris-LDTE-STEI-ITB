"use client";

import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import DataTable from "@/components/DataTable";
import ConfirmDeleteModal from "@/components/ConfirmDeleteModal";
import SuccessNotification from "@/components/SuccessNotification";
import { Filter, X } from "lucide-react";

interface UnitBarang {
  id: number;
  kodeBarang: string;
  namaBarang: string;
  ruangLab: string;
  meja: string;
  kondisiBarang: string;
  status: string;
  ruangLabId: number;
  mejaId: number;
  barangId: number;
}

interface RuangLab {
  id: number;
  namaRuang: string;
}

interface Meja {
  id: number;
  meja: string;
  ruangLabId: number;
  namaRuang: string;
}

interface UnitBarangClientProps {
  unitBarangs: UnitBarang[];
  ruangLabs: RuangLab[];
  mejas: Meja[];
  userRole: string;
  assignedLabIds: number[];
}

export default function UnitBarangClient({
  unitBarangs,
  ruangLabs,
  mejas,
  userRole,
  assignedLabIds,
}: UnitBarangClientProps) {
  const navigate = useNavigate();
  const canWrite = userRole === "admin" || assignedLabIds.length > 0;

  const [filterRuangLab, setFilterRuangLab] = useState<number | "">("");
  const [filterMeja, setFilterMeja] = useState<number | "">("");
  const [searchParams] = useSearchParams();
  const [deleteTarget, setDeleteTarget] = useState<UnitBarang | null>(null);
  const successMessage = searchParams.get("success");

  const availableMejas = filterRuangLab !== ""
    ? mejas.filter((m) => m.ruangLabId === filterRuangLab)
    : mejas;

  const filteredUnitBarangs = unitBarangs.filter((item) => {
    if (filterRuangLab !== "" && item.ruangLabId !== filterRuangLab) return false;
    if (filterMeja !== "" && item.mejaId !== filterMeja) return false;
    return true;
  });

  const handleEdit = (item: UnitBarang) => {
    navigate(`/unit-barang/edit/${item.id}`);
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await fetch(`/api/unit-barang/${deleteTarget.id}`, { method: "DELETE" });
      setDeleteTarget(null);
      window.location.reload();
    } catch (error) {
      console.error("Delete error:", error);
    }
  };

  const clearFilters = () => {
    setFilterRuangLab("");
    setFilterMeja("");
  };

  const hasActiveFilter = filterRuangLab !== "" || filterMeja !== "";

  return (
    <div className="space-y-4">
      {successMessage && (
        <SuccessNotification
          message={successMessage}
          onDismiss={() => {
            const params = new URLSearchParams(searchParams.toString());
            params.delete("success");
            navigate(`/unit-barang?${params.toString()}`, { replace: true });
          }}
        />
      )}
      <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 p-4 animate-slide-up">
        <div className="flex items-center gap-2 mb-3">
          <Filter className="w-4 h-4 text-gray-500 dark:text-gray-400" />
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Filter</span>
          <div className="ml-auto flex items-center gap-2">
            {hasActiveFilter && (
              <button
                onClick={clearFilters}
                className="flex items-center gap-1 text-xs text-red-500 hover:text-red-600 btn-press"
              >
                <X className="w-3 h-3" />
                Reset
              </button>
            )}
          </div>
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1">
            <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">Ruang Lab</label>
            <select
              value={filterRuangLab}
              onChange={(e) => {
                const val = e.target.value ? Number(e.target.value) : "";
                setFilterRuangLab(val);
                setFilterMeja("");
              }}
              className="w-full px-3 py-2 text-sm bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 dark:text-white transition-all"
            >
              <option value="">Semua Ruang Lab</option>
              {ruangLabs.map((lab) => (
                <option key={lab.id} value={lab.id}>
                  {lab.namaRuang}
                </option>
              ))}
            </select>
          </div>
          <div className="flex-1">
            <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">Meja</label>
            <select
              value={filterMeja}
              onChange={(e) => setFilterMeja(e.target.value ? Number(e.target.value) : "")}
              className="w-full px-3 py-2 text-sm bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 dark:text-white transition-all"
            >
              <option value="">Semua Meja</option>
              {availableMejas.map((meja) => (
                <option key={meja.id} value={meja.id}>
                  {meja.meja} ({meja.namaRuang})
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <DataTable
        data={filteredUnitBarangs}
        columns={[
          { key: "kodeBarang", label: "Kode Barang" },
          { key: "namaBarang", label: "Nama Barang" },
          { key: "ruangLab", label: "Ruang Lab" },
          { key: "meja", label: "Meja" },
          {
            key: "kondisiBarang",
            label: "Kondisi",
            render: (item) => (
              <span
                className={`px-2 py-1 text-xs font-medium rounded-full ${
                  item.kondisiBarang === "baik"
                    ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                    : item.kondisiBarang === "rusak"
                    ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400"
                    : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                }`}
              >
                {item.kondisiBarang}
              </span>
            ),
          },
          {
            key: "status",
            label: "Status",
            render: (item) => (
              <span
                className={`px-2 py-1 text-xs font-medium rounded-full ${
                  item.status === "Tersedia"
                    ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
                    : item.status === "Dipinjam"
                    ? "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400"
                    : "bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400"
                }`}
              >
                {item.status}
              </span>
            ),
          },
        ]}
        title="Daftar Unit Barang"
        addHref={canWrite ? "/unit-barang/create" : undefined}
        addLabel="Tambah Unit"
        searchPlaceholder="Cari kode barang..."
        searchKey="kodeBarang"
        onEdit={canWrite ? handleEdit : undefined}
        onDelete={canWrite ? (item) => setDeleteTarget(item) : undefined}
      />
      <ConfirmDeleteModal
        isOpen={deleteTarget !== null}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        requiredText={deleteTarget?.kodeBarang || ""}
        title="Hapus Unit Barang"
        description={`Ketik kode barang "${deleteTarget?.kodeBarang || ""}" untuk menghapusnya.`}
      />
    </div>
  );
}
