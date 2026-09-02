"use client";

import DataTable from "@/components/DataTable";
import { formatDate } from "@/lib/utils";

interface MutasiStok {
  id: number;
  namaBarang: string;
  kodeBarang: string;
  tanggal: string;
  tipe: string;
  keterangan: string;
}

interface MutasiStokClientProps {
  mutasiStoks: MutasiStok[];
}

export default function MutasiStokClient({ mutasiStoks }: MutasiStokClientProps) {
  return (
    <DataTable
      data={mutasiStoks}
      columns={[
        { key: "namaBarang", label: "Nama Barang" },
        { key: "kodeBarang", label: "Kode Barang" },
        {
          key: "tanggal",
          label: "Tanggal",
          render: (item) => formatDate(item.tanggal),
        },
        {
          key: "tipe",
          label: "Tipe",
          render: (item) => (
            <span
              className={`px-2 py-1 text-xs font-medium rounded-full ${
                item.tipe === "MASUK"
                  ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                  : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
              }`}
            >
              {item.tipe}
            </span>
          ),
        },
        { key: "keterangan", label: "Keterangan" },
      ]}
      title="Mutasi Stok"
      showActions={false}
    />
  );
}
