"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import DataTable from "@/components/DataTable";

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
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [total, setTotal] = useState(initialTotal);
  const [loading, setLoading] = useState(false);

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
    router.push(`/petugas?page=${newPage}`);
  };

  const handleEdit = (item: User) => {
    router.push(`/petugas/edit/${item.id}`);
  };

  const handleDelete = async (item: User) => {
    try {
      await fetch(`/api/petugas/${item.id}`, { method: "DELETE" });
      fetchData(page);
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
      // Pagination props
      totalItems={total}
      currentPage={page}
      onPageChange={handlePageChange}
      itemsPerPage={pageSize}
    />
  );
}
