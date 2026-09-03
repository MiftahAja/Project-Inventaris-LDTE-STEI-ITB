"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import DataTable from "@/components/DataTable";
import ConfirmDeleteModal from "@/components/ConfirmDeleteModal";
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
  const [deleteTarget, setDeleteTarget] = useState<Barang | null>(null);

  const handleEdit = (item: Barang) => {
    router.push(`/barang/edit/${item.id}`);
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await fetch(`/api/barang/${deleteTarget.id}`, { method: "DELETE" });
      setDeleteTarget(null);
      router.refresh();
    } catch (error) {
      console.error("Delete error:", error);
    }
  };

  return (
    <>
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
        onDelete={isAdmin ? (item) => setDeleteTarget(item) : undefined}
      />
      <ConfirmDeleteModal
        isOpen={deleteTarget !== null}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        requiredText={deleteTarget?.namaBarang || ""}
        title="Hapus Barang"
        description={`Ketik nama barang \"${deleteTarget?.namaBarang || ""}\" untuk menghapusnya.`}
      />
    </>
  );
}
