"use client";

import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Save, ArrowLeft } from "lucide-react";

interface UnitBarangFormProps {
  initialData?: {
    id: number;
    barangId: number;
    kodeBarang: string;
    kondisiBarang: string;
    status: string;
    ruangLabId: number;
    mejaId: number;
  };
  barangs: { id: number; namaBarang: string }[];
  ruangLabs: { id: number; namaRuang: string }[];
  mejas: { id: number; meja: string; ruangLabId: number }[];
  assignedLabIds: number[];
  userRole: string;
}

export default function UnitBarangForm({
  initialData,
  barangs,
  ruangLabs,
  mejas,
  assignedLabIds,
  userRole,
}: UnitBarangFormProps) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    barangId: initialData?.barangId?.toString() || "",
    kodeBarang: initialData?.kodeBarang || "",
    kondisiBarang: initialData?.kondisiBarang || "baik",
    status: initialData?.status || "Tersedia",
    ruangLabId: initialData?.ruangLabId?.toString() || "",
    mejaId: initialData?.mejaId?.toString() || "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const availableRuangLabs = userRole === "admin"
    ? ruangLabs
    : ruangLabs.filter((rl) => assignedLabIds.includes(rl.id));

  const filteredMejas = mejas.filter(
    (m) => {
      if (!formData.ruangLabId) {
        return userRole === "admin" || assignedLabIds.includes(m.ruangLabId);
      }
      return m.ruangLabId === Number(formData.ruangLabId);
    }
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const url = initialData
        ? `/api/unit-barang/${initialData.id}`
        : "/api/unit-barang";
      const method = initialData ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        navigate(initialData ? "/unit-barang?success=Unit barang berhasil diupdate" : "/unit-barang?success=Unit barang berhasil ditambahkan");
      } else {
        const data = await res.json();
        setError(data.error || "Terjadi kesalahan");
      }
    } catch {
      setError("Terjadi kesalahan server");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center gap-4 mb-6">
        <Link
          to="/unit-barang"
          className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">
          {initialData ? "Edit Unit Barang" : "Tambah Unit Barang"}
        </h2>
      </div>

      <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
        {error && (
          <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
            <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
              Nama Barang
            </label>
            <select
              value={formData.barangId}
              onChange={(e) =>
                setFormData({ ...formData, barangId: e.target.value })
              }
              required
              className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Pilih Barang</option>
              {barangs.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.namaBarang}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
              Kode Barang
            </label>
            <input
              type="text"
              value={formData.kodeBarang}
              onChange={(e) =>
                setFormData({ ...formData, kodeBarang: e.target.value })
              }
              required
              className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Masukkan kode barang"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                Ruang Lab
              </label>
              <select
                value={formData.ruangLabId}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    ruangLabId: e.target.value,
                    mejaId: "",
                  })
                }
                className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
              <option value="">Pilih Ruang Lab</option>
              {availableRuangLabs.map((rl) => (
                <option key={rl.id} value={rl.id}>
                  {rl.namaRuang}
                </option>
              ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                Meja
              </label>
              <select
                value={formData.mejaId}
                onChange={(e) =>
                  setFormData({ ...formData, mejaId: e.target.value })
                }
                className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Pilih Meja</option>
                {filteredMejas.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.meja}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                Kondisi Barang
              </label>
              <select
                value={formData.kondisiBarang}
                onChange={(e) =>
                  setFormData({ ...formData, kondisiBarang: e.target.value })
                }
                className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="baik">Baik</option>
                <option value="rusak">Rusak</option>
                <option value="hilang">Hilang</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                Status
              </label>
              <select
                value={formData.status}
                onChange={(e) =>
                  setFormData({ ...formData, status: e.target.value })
                }
                className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="Tersedia">Tersedia</option>
                <option value="Dipinjam">Dipinjam</option>
                <option value="Rusak">Rusak</option>
              </select>
            </div>
          </div>

          <div className="flex items-center gap-3 pt-4">
            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium rounded-lg transition-colors"
            >
              <Save className="w-4 h-4" />
              {loading ? "Menyimpan..." : "Simpan"}
            </button>
            <Link
              to="/unit-barang"
              className="px-4 py-2.5 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 font-medium rounded-lg transition-colors"
            >
              Batal
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
