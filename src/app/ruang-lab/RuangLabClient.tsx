"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import DataTable from "@/components/DataTable";

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
  const router = useRouter();
  const searchParams = useSearchParams();
  const isAdmin = userRole === "admin";

  const [ruangLabs, setRuangLabs] = useState<RuangLab[]>(initialRuangLabs);
  const [total, setTotal] = useState(initialTotal);
  const [loading, setLoading] = useState(false);

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
    router.push(`/ruang-lab?page=${newPage}`);
  };

  const handleEdit = (item: RuangLab) => {
    router.push(`/ruang-lab/edit/${item.id}`);
  };

  const handleDelete = async (item: RuangLab) => {
    try {
      await fetch(`/api/ruang-lab/${item.id}`, { method: "DELETE" });
      fetchData(page);
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
      // Pagination props
      totalItems={total}
      currentPage={page}
      onPageChange={handlePageChange}
      itemsPerPage={pageSize}
    />
  );
}
