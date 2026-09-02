"use client";

import { useRouter } from "next/navigation";
import DataTable from "@/components/DataTable";

interface RuangLab {
  id: number;
  namaRuang: string;
  deskripsi: string;
  unitCount: number;
}

interface RuangLabClientProps {
  ruangLabs: RuangLab[];
  userRole: string;
}

export default function RuangLabClient({ ruangLabs, userRole }: RuangLabClientProps) {
  const router = useRouter();
  const isAdmin = userRole === "admin";

  const handleEdit = (item: RuangLab) => {
    router.push(`/ruang-lab/edit/${item.id}`);
  };

  const handleDelete = async (item: RuangLab) => {
    try {
      await fetch(`/api/ruang-lab/${item.id}`, { method: "DELETE" });
      router.refresh();
    } catch (error) {
      console.error("Delete error:", error);
    }
  };

  return (
    <DataTable
      data={ruangLabs}
      columns={[
        { key: "namaRuang", label: "Nama Ruang" },
        { key: "deskripsi", label: "Deskripsi" },
        {
          key: "unitCount",
          label: "Unit Barang",
          render: (item) => (
            <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 rounded-full">
              {item.unitCount} unit
            </span>
          ),
        },
      ]}
      title="Daftar Ruang Lab"
      addHref={isAdmin ? "/ruang-lab/create" : undefined}
      addLabel="Tambah Ruang Lab"
      searchPlaceholder="Cari nama ruang..."
      searchKey="namaRuang"
      onEdit={isAdmin ? handleEdit : undefined}
      onDelete={isAdmin ? handleDelete : undefined}
    />
  );
}
