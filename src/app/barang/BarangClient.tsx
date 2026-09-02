"use client";

import { useRouter } from "next/navigation";
import DataTable from "@/components/DataTable";
import { barangSchema } from "@/lib/validators";

interface Barang {
  id: number;
  namaBarang: string;
  createdAt: string;
}

interface BarangClientProps {
  barangs: Barang[];
  userRole: string;
}

export default function BarangClient({ barangs, userRole }: BarangClientProps) {
  const router = useRouter();
  const isAdmin = userRole === "admin";

  const handleEdit = (item: Barang) => {
    router.push(`/barang/edit/${item.id}`);
  };

  const handleDelete = async (item: Barang) => {
    try {
      await fetch(`/api/barang/${item.id}`, { method: "DELETE" });
      router.refresh();
    } catch (error) {
      console.error("Delete error:", error);
    }
  };

  return (
    <DataTable
      data={barangs}
      columns={[
        { key: "namaBarang", label: "Nama Barang" },
      ]}
      title="Daftar Barang"
      addHref={isAdmin ? "/barang/create" : undefined}
      addLabel="Tambah Barang"
      searchPlaceholder="Cari nama barang..."
      searchKey="namaBarang"
      onEdit={isAdmin ? handleEdit : undefined}
      onDelete={isAdmin ? handleDelete : undefined}
    />
  );
}
