"use client";

import { useState, useEffect } from "react";
import AuthLayout from "@/components/AuthLayout";
import { useAuth } from "@/lib/auth-context";
import UnitBarangClient from "./UnitBarangClient";

export default function UnitBarangPage() {
  const { user } = useAuth();
  const [unitBarangs, setUnitBarangs] = useState<{ id: number; kodeBarang: string; namaBarang: string; ruangLab: string; meja: string; kondisiBarang: string; status: string; ruangLabId: number; mejaId: number; barangId: number }[]>([]);
  const [ruangLabs, setRuangLabs] = useState<{ id: number; namaRuang: string }[]>([]);
  const [mejas, setMejas] = useState<{ id: number; meja: string; ruangLabId: number; namaRuang: string }[]>([]);
  const [assignedLabIds, setAssignedLabIds] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [pageSize, setPageSize] = useState(20);

  const fetchData = async (page: number) => {
    setLoading(true);
    try {
      const [ubRes, rlRes, mejaRes, assignedLabsRes] = await Promise.all([
        fetch(`/api/unit-barang?page=${page}&pageSize=${pageSize}`),
        fetch("/api/ruang-lab?page=1&pageSize=100"),
        fetch("/api/meja?page=1&pageSize=100"),
        fetch("/api/auth/assigned-labs"),
      ]);
      const ubData = await ubRes.json();
      const rlData = await rlRes.json();
      const mejaData = await mejaRes.json();

      setUnitBarangs(ubData.data.map((ub: Record<string, unknown>) => ({
        id: Number(ub.id),
        kodeBarang: ub.kodeBarang as string,
        namaBarang: ub.namaBarang as string,
        ruangLab: ub.ruangLab as string,
        meja: ub.meja as string,
        kondisiBarang: ub.kondisiBarang as string,
        status: ub.status as string,
        ruangLabId: Number(ub.ruangLabId),
        mejaId: Number(ub.mejaId),
        barangId: Number(ub.barangId),
      })));

      setRuangLabs(rlData.data.map((rl: { id: number; namaRuang: string }) => ({
        id: Number(rl.id),
        namaRuang: rl.namaRuang,
      })));

      setMejas(mejaData.data.map((m: { id: number; meja: string; ruangLabId: number; namaRuang: string }) => ({
        id: Number(m.id),
        meja: m.meja,
        ruangLabId: Number(m.ruangLabId),
        namaRuang: m.namaRuang,
      })));

      const assignedLabsData = await assignedLabsRes.json();
      setAssignedLabIds(assignedLabsData.labIds || []);

      setTotalItems(ubData.total ?? 0);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(currentPage);
  }, [currentPage, pageSize]);

  if (loading) {
    return (
      <AuthLayout>
        <div className="flex items-center justify-center h-64">
          <div className="w-8 h-8 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin" />
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout>
      <UnitBarangClient
        unitBarangs={unitBarangs}
        ruangLabs={ruangLabs}
        mejas={mejas}
        userRole={user?.role || ""}
        assignedLabIds={assignedLabIds}
        totalItems={totalItems}
        currentPage={currentPage}
        onPageChange={setCurrentPage}
        itemsPerPage={pageSize}
        pageSizeOptions={[10, 20, 50, 100]}
        onPageSizeChange={setPageSize}
      />
    </AuthLayout>
  );
}
