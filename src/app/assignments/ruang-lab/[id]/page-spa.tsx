"use client";

import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import AuthLayout from "@/components/AuthLayout";
import AssignmentDetailClient from "./AssignmentDetailClient";

export default function AssignmentDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [ruangLab, setRuangLab] = useState<{ id: number; namaRuang: string } | null>(null);
  const [assignments, setAssignments] = useState<{ id: number; userName: string; isActive: boolean; createdAt: string }[]>([]);
  const [petugas, setPetugas] = useState<{ id: number; name: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [labRes, assignRes, petugasRes] = await Promise.all([
          fetch(`/api/ruang-lab?page=1&pageSize=100`),
          fetch(`/api/assignments/${id}`),
          fetch(`/api/petugas?page=1&pageSize=100`),
        ]);
        const labData = await labRes.json();
        const assignData = await assignRes.json();
        const petugasData = await petugasRes.json();

        const lab = labData.data?.find((l: { id: number }) => Number(l.id) === Number(id));
        if (lab) {
          setRuangLab({ id: Number(lab.id), namaRuang: lab.namaRuang });
        } else {
          setNotFound(true);
        }

        setAssignments((assignData.data || []).map((a: Record<string, unknown>) => ({
          id: Number(a.id),
          userName: a.userName as string,
          isActive: a.isActive as boolean,
          createdAt: a.createdAt as string,
        })));

        setPetugas(petugasData.data.map((p: { id: number; name: string }) => ({
          id: Number(p.id),
          name: p.name,
        })));
      } catch {
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  if (loading) {
    return (
      <AuthLayout>
        <div className="flex items-center justify-center h-64">
          <div className="w-8 h-8 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin" />
        </div>
      </AuthLayout>
    );
  }

  if (notFound || !ruangLab) {
    return (
      <AuthLayout>
        <div className="flex items-center justify-center h-64">
          <p className="text-gray-500">Ruang Lab tidak ditemukan</p>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout>
      <AssignmentDetailClient
        ruangLab={ruangLab}
        assignments={assignments}
        petugas={petugas}
      />
    </AuthLayout>
  );
}
