"use client";

import { useState, useEffect, useCallback } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import DataTable from "@/components/DataTable";
import ConfirmDeleteModal from "@/components/ConfirmDeleteModal";
import SuccessNotification from "@/components/SuccessNotification";
import { Package, X } from "lucide-react";
interface UnitBarang {
  id: number;
  kodeBarang: string;
  namaBarang: string;
  kondisiBarang: string;
  status: string;
}

interface Meja {
  id: number;
  meja: string;
  ruangLab: string;
  ruangLabId: number;
  barangCount: number;
}

interface MejaClientProps {
  initialMejas: Meja[];
  initialTotal: number;
  userRole: string;
  assignedLabIds: number[];
  ruangLabOptions: { id: number; namaRuang: string }[];
}

export default function MejaClient({
  initialMejas,
  initialTotal,
  userRole,
  assignedLabIds,
  ruangLabOptions,
}: MejaClientProps) {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const canWrite = userRole === "admin" || assignedLabIds.length > 0;

  const [mejas, setMejas] = useState<Meja[]>(initialMejas);
  const [total, setTotal] = useState(initialTotal);
  const [loading, setLoading] = useState(false);

  const [selectedMeja, setSelectedMeja] = useState<Meja | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Meja | null>(null);
  const successMessage = searchParams.get("success");

  const page = parseInt(searchParams.get("page") || "1");
  const pageSize = 10;

  const fetchData = useCallback(async (page: number) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/meja?page=${page}&pageSize=${pageSize}`);
      const result = await response.json();
      setMejas(result.data);
      setTotal(result.total);
    } catch (error) {
      console.error("Fetch error:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData(page);
  }, [page, fetchData]);

  const handlePageChange = (newPage: number) => {
    navigate(`/meja?page=${newPage}`);
  };

  const handleEdit = (item: Meja) => {
    navigate(`/meja/edit/${item.id}`);
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await fetch(`/api/meja/${deleteTarget.id}`, { method: "DELETE" });
      setDeleteTarget(null);
      fetchData(page);
    } catch (error) {
      console.error("Delete error:", error);
    }
  };

  const [ruangLabFilter, setRuangLabFilter] = useState<number | "">(assignedLabIds.length > 0 && ruangLabOptions.find((rl) => assignedLabIds.includes(rl.id)) ? assignedLabIds[0] : "");
  const [mejasById, setMejasById] = useState<Record<number, Meja[]>>({});
  const [filteredMejas, setFilteredMejas] = useState<Meja[]>(initialMejas);

  const loadMejasByRuangLab = useCallback(async (ruangLabId: number) => {
    try {
      const response = await fetch(`/api/meja?ruangLabId=${ruangLabId}`);
      const result = await response.json();
      setMejasById((prev) => (prev[ruangLabId] = result.data || []));
    } catch (error) {
      console.error("Error loading mejas:", error);
    }
  }, []);

  useEffect(() => {
    if (ruangLabFilter) {
      loadMejasByRuangLab(ruangLabFilter);
    }
  }, [ruangLabFilter]);

  useEffect(() => {
    if (ruangLabFilter && mejasById[ruangLabFilter]) {
      setFilteredMejas(mejasById[ruangLabFilter]);
      setTotal(mejasById[ruangLabFilter].length);
    } else {
      setFilteredMejas(initialMejas);
      setTotal(initialTotal);
    }
  }, [ruangLabFilter, mejasById, initialMejas, initialTotal]);

  const handleViewBarang = (item: Meja) => {
    setSelectedMeja(item);
    setShowModal(true);
  };

  const [barangList, setBarangList] = useState<UnitBarang[]>([]);

  const loadBarangList = useCallback(async (mejaId: number) => {
    setBarangList([]);
    try {
      const response = await fetch(`/api/unit-barang?mejaId=${mejaId}`);
      const result = await response.json();
      setBarangList(result.data || result || []);
    } catch (error) {
      console.error("Error loading barang:", error);
      setBarangList([]);
    }
  }, []);

  useEffect(() => {
    if (selectedMeja) {
      loadBarangList(selectedMeja.id);
    }
  }, [selectedMeja, loadBarangList]);

  return (
    <div className="space-y-4">
      {successMessage && (
        <SuccessNotification
          message={successMessage}
          onDismiss={() => {
            const params = new URLSearchParams(searchParams.toString());
            params.delete("success");
            navigate(`/meja?${params.toString()}`, { replace: true });
          }}
        />
      )}
      <div className="flex flex-wrap items-center gap-3 mb-4">
        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Filter Ruang Lab</label>
        <select
          value={ruangLabFilter || ""}
          onChange={(e) => setRuangLabFilter(e.target.value ? Number(e.target.value) : "")}
          className="px-3 py-2 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-lg text-sm"
        >
          <option value="">Semua</option>
          {ruangLabOptions.map((rl) => (
            <option key={rl.id} value={rl.id}>
              {rl.namaRuang}
            </option>
          ))}
        </select>
      </div>
      <DataTable
        data={filteredMejas}
        columns={[
          { key: "meja", label: "Nomor Meja" },
          { key: "ruangLab", label: "Ruang Lab" },
          {
            key: "barangCount",
            label: "Jumlah Barang",
            render: (item) => (
              <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
                {item.barangCount ?? 0} item
              </span>
            ),
          },
        ]}
        title="Daftar Meja"
        searchPlaceholder="Cari nomor meja..."
        searchKey="meja"
        onEdit={canWrite ? handleEdit : undefined}
        onDelete={canWrite ? (item) => setDeleteTarget(item) : undefined}
        onView={handleViewBarang}
        totalItems={total}
        currentPage={page}
        onPageChange={handlePageChange}
        pageSizeOptions={[10, 20, 50]}
        itemsPerPage={pageSize}
      />

      <ConfirmDeleteModal
        isOpen={deleteTarget !== null}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        requiredText={deleteTarget?.meja || ""}
        title="Hapus Meja"
        description={`Ketik nomor meja "${deleteTarget?.meja || ""}" untuk menghapusnya.`}
      />

      {/* Modal Lihat Barang */}
      {showModal && selectedMeja && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 animate-fade-in-overlay">
          <div className="bg-white dark:bg-gray-900 rounded-xl shadow-xl w-full max-w-lg mx-4 max-h-[80vh] flex flex-col animate-scale-in">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-700">
              <div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                  Barang di {selectedMeja.meja}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {selectedMeja.ruangLab} &middot; {barangList.length} item
                </p>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg btn-press"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-6 py-4">
              {barangList.length === 0 ? (
                <div className="text-center py-8">
                  <Package className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
                  <p className="text-gray-500 dark:text-gray-400">Tidak ada barang di meja ini</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {barangList.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-100 dark:border-gray-700 card-hover"
                    >
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          {item.namaBarang}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {item.kodeBarang}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
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
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
