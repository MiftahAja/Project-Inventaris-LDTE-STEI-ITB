"use client";

import { useState, useEffect } from "react";
import { Settings, Plus } from "lucide-react";
import { Link } from "react-router-dom";

interface RuangLab {
  id: number;
  namaRuang: string;
  deskripsi: string;
  petugas: string | null;
  isActive: boolean;
}

interface Petugas {
  id: number;
  name: string;
}

interface AssignmentClientProps {
  ruangLabs: RuangLab[];
}

export default function AssignmentClient({ ruangLabs }: AssignmentClientProps) {
  const [showModal, setShowModal] = useState(false);
  const [selectedRuangLab, setSelectedRuangLab] = useState("");
  const [selectedPetugas, setSelectedPetugas] = useState("");
  const [petugasList, setPetugasList] = useState<Petugas[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (showModal) {
      fetch("/api/petugas?page=1&pageSize=100")
        .then((res) => res.json())
        .then((data) => {
          setPetugasList(data.data.map((p: { id: number; name: string }) => ({
            id: Number(p.id),
            name: p.name,
          })));
        })
        .catch((error) => console.error("Error fetching petugas:", error));
    }
  }, [showModal]);

  const handleAssign = async () => {
    if (!selectedRuangLab || !selectedPetugas) return;
    setLoading(true);

    try {
      const res = await fetch("/api/assignments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: selectedPetugas,
          ruangLabId: Number(selectedRuangLab),
        }),
      });

      if (res.ok) {
        setShowModal(false);
        setSelectedRuangLab("");
        setSelectedPetugas("");
        window.location.reload();
      }
    } catch (error) {
      console.error("Assign error:", error);
    } finally {
      setLoading(false);
    }
  };

  const unassignedLabs = ruangLabs.filter((rl) => !rl.isActive);

  return (
    <>
      <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">
            Daftar Penugasan
          </h3>
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            Tambah Penugasan
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">
                  No
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">
                  Nama Lab
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">
                  Petugas
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">
                  Status
                </th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody>
              {ruangLabs.map((rl, index) => (
                <tr
                  key={rl.id}
                  className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50"
                >
                  <td className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">
                    {index + 1}
                  </td>
                  <td className="px-4 py-3">
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {rl.namaRuang}
                      </p>
                      {rl.deskripsi && (
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                          {rl.deskripsi}
                        </p>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    {rl.petugas ? (
                      <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 rounded-full">
                        {rl.petugas}
                      </span>
                    ) : (
                      <span className="px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400 rounded-full">
                        Belum ditugaskan
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`px-2 py-1 text-xs font-medium rounded-full ${
                        rl.isActive
                          ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                          : "bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400"
                      }`}
                    >
                      {rl.isActive ? "Aktif" : "Kosong"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Link
                      to={`/assignments/ruang-lab/${rl.id}`}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-blue-600 hover:text-blue-700 bg-blue-50 dark:bg-blue-900/20 rounded-lg transition-colors"
                    >
                      <Settings className="w-3.5 h-3.5" />
                      Kelola
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Assignment Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white dark:bg-gray-900 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 w-full max-w-md mx-4 p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Tambah Penugasan Baru
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                  Pilih Ruang Lab
                </label>
                <select
                  value={selectedRuangLab}
                  onChange={(e) => setSelectedRuangLab(e.target.value)}
                  className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Pilih Ruang Lab</option>
                  {unassignedLabs.map((rl) => (
                    <option key={rl.id} value={rl.id}>
                      {rl.namaRuang}
                    </option>
                  ))}
                  {unassignedLabs.length === 0 && (
                    <option value="" disabled>
                      Semua lab sudah ditugaskan
                    </option>
                  )}
                </select>
                {unassignedLabs.length === 0 && (
                  <p className="text-xs text-yellow-600 dark:text-yellow-400 mt-1">
                    Semua ruang lab sudah memiliki petugas. Kelola penugasan di detail masing-masing lab.
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                  Pilih Petugas
                </label>
                <select
                  value={selectedPetugas}
                  onChange={(e) => setSelectedPetugas(e.target.value)}
                  className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Pilih Petugas</option>
                  {petugasList.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => {
                  setShowModal(false);
                  setSelectedRuangLab("");
                  setSelectedPetugas("");
                }}
                className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
              >
                Batal
              </button>
              <button
                onClick={handleAssign}
                disabled={!selectedRuangLab || !selectedPetugas || loading}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 rounded-lg transition-colors"
              >
                {loading ? "Menyimpan..." : "Simpan"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
