"use client";

import { useState, useEffect, useCallback } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import DataTable from "@/components/DataTable";
import ConfirmDeleteModal from "@/components/ConfirmDeleteModal";
import SuccessNotification from "@/components/SuccessNotification";

interface RuangLab {
  id: number;
  namaRuang: string;
  deskripsi: string;
  unitCount: number;
}

interface RuangLabClientProps {
  initialRuangLabs: RuangLab[];
  initialTotal: number;
  userRole: string;
}

export default function RuangLabClient({ initialRuangLabs, initialTotal, userRole }: RuangLabClientProps) {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const isAdmin = userRole === "admin";

  const [ruangLabs, setRuangLabs] = useState<RuangLab[]>(initialRuangLabs);
  const [total, setTotal] = useState(initialTotal);
  const [loading, setLoading] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<RuangLab | null>(null);
  const successMessage = searchParams.get("success");

  const page = parseInt(searchParams.get("page") || "1");
  const pageSize = 10;

  const fetchData = useCallback(async (page: number) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/ruang-lab?page=${page}&pageSize=${pageSize}`);
      const result = await response.json();
      setRuangLabs(result.data);
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
    navigate(`/ruang-lab?page=${newPage}`);
  };

  const handleEdit = (item: RuangLab) => {
    navigate(`/ruang-lab/edit/${item.id}`);
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await fetch(`/api/ruang-lab/${deleteTarget.id}`, { method: "DELETE" });
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
            navigate(`/ruang-lab?${params.toString()}`, { replace: true });
          }}
        />
      )}
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
        onDelete={isAdmin ? (item) => setDeleteTarget(item) : undefined}
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
        requiredText={deleteTarget?.namaRuang || ""}
        title="Hapus Ruang Lab"
        description={`Ketik nama ruang "${deleteTarget?.namaRuang || ""}" untuk menghapusnya.`}
      />
    </>
  );
}
