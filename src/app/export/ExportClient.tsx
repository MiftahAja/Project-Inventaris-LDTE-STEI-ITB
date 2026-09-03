"use client";

import { useState } from "react";
import { Download, FileSpreadsheet, Building2 } from "lucide-react";

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
  unitBarangs: UnitBarang[];
}

interface RuangLab {
  id: number;
  namaRuang: string;
  deskripsi: string;
  mejas: Meja[];
}

interface ExportClientProps {
  ruangLabs: RuangLab[];
}

export default function ExportClient({ ruangLabs }: ExportClientProps) {
  const [selectedLab, setSelectedLab] = useState<number | "">("");
  const [loading, setLoading] = useState(false);

  const getExportData = (lab?: RuangLab) => {
    const labs = lab ? [lab] : ruangLabs;
    const rows: Record<string, string | number>[] = [];
    let no = 1;

    for (const l of labs) {
      for (const meja of l.mejas) {
        if (meja.unitBarangs.length === 0) {
          // Meja kosong - tetap tampilkan
          rows.push({
            No: no++,
            "Ruang Lab": l.namaRuang,
            Meja: meja.meja,
            "Kode Barang": "-",
            "Nama Barang": "-",
            Kondisi: "-",
            Status: "-",
          });
        } else {
          for (const ub of meja.unitBarangs) {
            rows.push({
              No: no++,
              "Ruang Lab": l.namaRuang,
              Meja: meja.meja,
              "Kode Barang": ub.kodeBarang,
              "Nama Barang": ub.namaBarang,
              Kondisi: ub.kondisiBarang,
              Status: ub.status,
            });
          }
        }
      }

      // Jika lab tidak ada meja sama sekali
      if (l.mejas.length === 0) {
        rows.push({
          No: no++,
          "Ruang Lab": l.namaRuang,
          Meja: "-",
          "Kode Barang": "-",
          "Nama Barang": "-",
          Kondisi: "-",
          Status: "-",
        });
      }
    }

    return rows;
  };

  const createWorkbook = async (XLSX: any, data: Record<string, string | number>[], sheetName: string) => {
    const ws = XLSX.utils.json_to_sheet(data);

    // Set column widths
    ws["!cols"] = [
      { wch: 5 },    // No
      { wch: 25 },   // Ruang Lab
      { wch: 12 },   // Meja
      { wch: 15 },   // Kode Barang
      { wch: 25 },   // Nama Barang
      { wch: 12 },   // Kondisi
      { wch: 12 },   // Status
    ];

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, sheetName);
    return wb;
  };

  const getDateStr = () => {
    return new Date()
      .toLocaleDateString("id-ID", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      })
      .replace(/\//g, "-");
  };

  const handleExportPerLab = async (lab: RuangLab) => {
    setLoading(true);
    try {
      const XLSX = await import("xlsx");
      const data = getExportData(lab);
      if (data.length === 0) {
        alert("Tidak ada data untuk diexport");
        return;
      }

      const wb = await createWorkbook(XLSX, data, lab.namaRuang);
      const filename = `Export_${lab.namaRuang.replace(/\s+/g, "_")}_${getDateStr()}.xlsx`;
      XLSX.writeFile(wb, filename);
    } finally {
      setLoading(false);
    }
  };

  const handleExportAll = async () => {
    setLoading(true);
    try {
      const XLSX = await import("xlsx");
      const data = getExportData();
      if (data.length === 0) {
        alert("Tidak ada data untuk diexport");
        return;
      }

      const wb = XLSX.utils.book_new();

      // Create a sheet per lab
      for (const lab of ruangLabs) {
        const labData = getExportData(lab);
        const sheetName = lab.namaRuang.substring(0, 31); // Excel max 31 chars
        const ws = XLSX.utils.json_to_sheet(labData);
        ws["!cols"] = [
          { wch: 5 },
          { wch: 25 },
          { wch: 12 },
          { wch: 15 },
          { wch: 25 },
          { wch: 12 },
          { wch: 12 },
        ];
        XLSX.utils.book_append_sheet(wb, ws, sheetName);
      }

      // Summary sheet
      const summaryData = ruangLabs.map((lab) => {
        const totalMeja = lab.mejas.length;
        const totalBarang = lab.mejas.reduce(
          (acc, m) => acc + m.unitBarangs.length,
          0
        );
        const baik = lab.mejas.reduce(
          (acc, m) =>
            acc + m.unitBarangs.filter((ub) => ub.kondisiBarang === "baik").length,
          0
        );
        const rusak = lab.mejas.reduce(
          (acc, m) =>
            acc + m.unitBarangs.filter((ub) => ub.kondisiBarang === "rusak").length,
          0
        );
        const hilang = lab.mejas.reduce(
          (acc, m) =>
            acc + m.unitBarangs.filter((ub) => ub.kondisiBarang === "hilang").length,
          0
        );

        return {
          "Ruang Lab": lab.namaRuang,
          "Total Meja": totalMeja,
          "Total Barang": totalBarang,
          Baik: baik,
          Rusak: rusak,
          Hilang: hilang,
        };
      });

      const summaryWs = XLSX.utils.json_to_sheet(summaryData);
      summaryWs["!cols"] = [
        { wch: 25 },
        { wch: 12 },
        { wch: 14 },
        { wch: 10 },
        { wch: 10 },
        { wch: 10 },
      ];
      XLSX.utils.book_append_sheet(wb, summaryWs, "Ringkasan");

      const filename = `Export_Semua_Lab_${getDateStr()}.xlsx`;
      XLSX.writeFile(wb, filename);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Export Data
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Export data inventaris per lab atau semua lab sekaligus
        </p>
      </div>

      {/* Export Semua Lab */}
      <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2.5 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
            <FileSpreadsheet className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Export Semua Lab
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Export seluruh data inventaris ke dalam satu file Excel dengan sheet per lab
            </p>
          </div>
        </div>

        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 mb-4">
          <p className="text-sm text-gray-600 dark:text-gray-300">
            File Excel akan berisi:
          </p>
          <ul className="mt-2 space-y-1 text-sm text-gray-500 dark:text-gray-400">
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-blue-500 rounded-full" />
              Sheet per ruang lab dengan detail meja dan barang
            </li>
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-green-500 rounded-full" />
              Sheet "Ringkasan" berisi statistik per lab
            </li>
          </ul>
        </div>

        <button
          onClick={handleExportAll}
          disabled={loading || ruangLabs.length === 0}
          className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium rounded-lg btn-press transition-all shadow-lg shadow-blue-500/25"
        >
          <Download className="w-4 h-4" />
          {loading ? "Membuat file..." : "Export Semua Lab"}
        </button>
      </div>

      {/* Export Per Lab */}
      <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2.5 bg-green-100 dark:bg-green-900/30 rounded-lg">
            <Building2 className="w-5 h-5 text-green-600 dark:text-green-400" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Export Per Lab
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Export data inventaris untuk ruang lab tertentu
            </p>
          </div>
        </div>

        {/* Lab Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {ruangLabs.map((lab) => {
            const totalMeja = lab.mejas.length;
            const totalBarang = lab.mejas.reduce(
              (acc, m) => acc + m.unitBarangs.length,
              0
            );

            return (
              <div
                key={lab.id}
                className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-700 transition-all card-hover"
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white text-sm">
                      {lab.namaRuang}
                    </h3>
                    {lab.deskripsi && (
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 line-clamp-1">
                        {lab.deskripsi}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-4 mb-3 text-xs text-gray-500 dark:text-gray-400">
                  <span className="flex items-center gap-1">
                    <span className="w-1.5 h-1.5 bg-blue-500 rounded-full" />
                    {totalMeja} meja
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="w-1.5 h-1.5 bg-green-500 rounded-full" />
                    {totalBarang} barang
                  </span>
                </div>

                <button
                  onClick={() => handleExportPerLab(lab)}
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-white dark:bg-gray-700 hover:bg-green-50 dark:hover:bg-green-900/20 border border-gray-200 dark:border-gray-600 hover:border-green-300 dark:hover:border-green-700 text-gray-700 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400 text-sm font-medium rounded-lg btn-press transition-all"
                >
                  <Download className="w-3.5 h-3.5" />
                  Export
                </button>
              </div>
            );
          })}
        </div>

        {ruangLabs.length === 0 && (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            Belum ada data ruang lab
          </div>
        )}
      </div>
    </div>
  );
}
