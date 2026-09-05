"use client";

import { useState, useEffect, useCallback } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import DataTable from "@/components/DataTable";
import ConfirmDeleteModal from "@/components/ConfirmDeleteModal";
import SuccessNotification from "@/components/SuccessNotification";

interface User {
  id: number;
  name: string;
  email: string;
  noTelp: string;
  alamat: string;
}

interface PetugasClientProps {
  initialUsers: User[];
  initialTotal: number;
}

export default function PetugasClient({ initialUsers, initialTotal }: PetugasClientProps) {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [total, setTotal] = useState(initialTotal);
  const [loading, setLoading] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<User | null>(null);
  const successMessage = searchParams.get("success");

  const page = parseInt(searchParams.get("page") || "1");
  const pageSize = 10;

  const fetchData = useCallback(async (page: number) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/petugas?page=${page}&pageSize=${pageSize}`);
      const result = await response.json();
      setUsers(result.data);
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
    navigate(`/petugas?page=${newPage}`);
  };

  const handleEdit = (item: User) => {
    navigate(`/petugas/edit/${item.id}`);
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await fetch(`/api/petugas/${deleteTarget.id}`, { method: "DELETE" });
      setDeleteTarget(null);
      fetchData(page);
    } catch (error) {
      console.error("Delete error:", error);
    }
  };

  return (
    <>
      {successMessage && (
        <SuccessNotification
          message={successMessage}
          onDismiss={() => {
            const params = new URLSearchParams(searchParams.toString());
            params.delete("success");
            navigate(`/petugas?${params.toString()}`, { replace: true });
          }}
        />
      )}
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
        onDelete={(item) => setDeleteTarget(item)}
        // Pagination props
        totalItems={total}
        currentPage={page}
        onPageChange={handlePageChange}
        itemsPerPage={pageSize}
      />
      <ConfirmDeleteModal
        isOpen={deleteTarget !== null}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        requiredText={deleteTarget?.name || ""}
        title="Hapus Petugas"
        description={`Ketik nama petugas "${deleteTarget?.name || ""}" untuk menghapusnya.`}
      />
    </>
  );
}
