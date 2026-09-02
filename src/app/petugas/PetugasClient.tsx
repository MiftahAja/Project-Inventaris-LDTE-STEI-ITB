"use client";

import { useRouter } from "next/navigation";
import DataTable from "@/components/DataTable";

interface User {
  id: number;
  name: string;
  email: string;
  noTelp: string;
  alamat: string;
}

interface PetugasClientProps {
  users: User[];
}

export default function PetugasClient({ users }: PetugasClientProps) {
  const router = useRouter();

  const handleEdit = (item: User) => {
    router.push(`/petugas/edit/${item.id}`);
  };

  const handleDelete = async (item: User) => {
    try {
      await fetch(`/api/petugas/${item.id}`, { method: "DELETE" });
      router.refresh();
    } catch (error) {
      console.error("Delete error:", error);
    }
  };

  return (
    <DataTable
      data={users}
      columns={[
        { key: "name", label: "Nama" },
        { key: "email", label: "Email" },
      ]}
      title="Daftar Petugas"
      addHref="/petugas/create"
      addLabel="Tambah Petugas"
      searchPlaceholder="Cari nama petugas..."
      searchKey="name"
      onEdit={handleEdit}
      onDelete={handleDelete}
    />
  );
}
