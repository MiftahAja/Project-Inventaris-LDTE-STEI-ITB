import { requireAuth } from "@/lib/auth";
import { db } from "@/lib/db";
import AuthLayout from "@/components/AuthLayout";
import ExportClient from "./ExportClient";
import { Metadata } from "next";

export const metadata: Metadata = {
  title : "Export Data | Inventaris LDTE",
  description : ""
}

export default async function ExportPage() {
  const session = await requireAuth();

  // Only admin can access this page
  if (session.role !== "admin") {
    return (
      <AuthLayout userId={Number(session.userId)}>
        <div className="flex items-center justify-center h-64">
          <p className="text-gray-500 dark:text-gray-400">
            Anda tidak memiliki akses ke halaman ini
          </p>
        </div>
      </AuthLayout>
    );
  }

  const ruangLabs = await db.ruangLab.findMany({
    include: {
      mejas: {
        include: {
          unitBarangs: {
            include: {
              barang: true,
            },
          },
        },
      },
    },
    orderBy: { namaRuang: "asc" },
  });

  return (
    <AuthLayout userId={Number(session.userId)}>
      <ExportClient
        ruangLabs={ruangLabs.map((lab) => ({
          id: Number(lab.id),
          namaRuang: lab.namaRuang,
          deskripsi: lab.deskripsi || "",
          mejas: lab.mejas.map((m) => ({
            id: Number(m.id),
            meja: m.meja,
            unitBarangs: m.unitBarangs.map((ub) => ({
              id: Number(ub.id),
              kodeBarang: ub.kodeBarang,
              namaBarang: ub.barang.namaBarang,
              kondisiBarang: ub.kondisiBarang,
              status: ub.status,
            })),
          })),
        }))}
      />
    </AuthLayout>
  );
}
