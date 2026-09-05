"use client";

import { useState, useEffect, useCallback } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import DataTable from "@/components/DataTable";
import ConfirmDeleteModal from "@/components/ConfirmDeleteModal";
import SuccessNotification from "@/components/SuccessNotification";

interface Barang {
  id: number;
  namaBarang: string;
  createdAt: string;
}

interface BarangClientProps {
  initialBarangs: Barang[];
  initialTotal: number;
  userRole: string;
}

export default function BarangClient({ initialBarangs, initialTotal, userRole }: BarangClientProps) {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const isAdmin = userRole === "admin";
  const [deleteTarget, setDeleteTarget] = useState<Barang | null>(null);
  const successMessage = searchParams.get("success");
  
  const [barangs, setBarangs] = useState<Barang[]>(initialBarangs);
  const [total, setTotal] = useState(initialTotal);
  const [loading, setLoading] = useState(false);

  const page = parseInt(searchParams.get("page") || "1");
  const pageSize = 10;

  const fetchData = useCallback(async (page: number) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/barang?page=${page}&pageSize=${pageSize}`);
      const result = await response.json();
      setBarangs(result.data);
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
    navigate(`/barang?page=${newPage}`);
  };

  const handleEdit = (item: Barang) => {
    navigate(`/barang/edit/${item.id}`);
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await fetch(`/api/barang/${deleteTarget.id}`, { method: "DELETE" });
      setDeleteTarget(null);
      fetchData(page);
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
        // Pagination props
        totalItems={total}
        currentPage={page}
        onPageChange={handlePageChange}
        itemsPerPage={pageSize}
      />
      {successMessage && (
        <SuccessNotification
          message={successMessage}
          onDismiss={() => {
            const params = new URLSearchParams(searchParams.toString());
            params.delete("success");
            navigate(`/barang?${params.toString()}`, { replace: true });
          }}
        />
      )}
      <ConfirmDeleteModal
        isOpen={deleteTarget !== null}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        requiredText={deleteTarget?.namaBarang || ""}
        title="Hapus Barang"
        description={`Ketik nama barang "${deleteTarget?.namaBarang || ""}" untuk menghapusnya.`}
      />
    </>
  );
}
