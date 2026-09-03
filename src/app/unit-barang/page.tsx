import { requireAuth, getAssignedLabIds } from "@/lib/auth";
import { db } from "@/lib/db";
import AuthLayout from "@/components/AuthLayout";
import UnitBarangClient from "./UnitBarangClient";
import { Metadata } from "next";

export const metadata: Metadata = {
  title : "Unit Barang | Inventaris LDTE",
  description : ""
}

export default async function UnitBarangPage() {
  const session = await requireAuth();

  let where: Record<string, unknown> = {};

  // Petugas only see their assigned labs
  if (session.role === "petugas") {
    const labIds = await getAssignedLabIds(Number(session.userId));
    where = { ruangLabId: { in: labIds } };
  }

  const unitBarangs = await db.unitBarang.findMany({
    where,
    include: {
      barang: true,
      ruangLab: true,
      meja: true,
    },
    orderBy: { createdAt: "desc" },
  });

  const ruangLabs = await db.ruangLab.findMany();
  const mejas = await db.meja.findMany({
    include: { ruangLab: true },
  });

  // Get assigned lab IDs for petugas
  const assignedLabIds = session.role === "petugas"
    ? await getAssignedLabIds(Number(session.userId))
    : [];

  return (
    <AuthLayout userId={Number(session.userId)}>
      <UnitBarangClient
        unitBarangs={unitBarangs.map((ub) => ({
          id: Number(ub.id),
          kodeBarang: ub.kodeBarang,
          namaBarang: ub.barang.namaBarang,
          ruangLab: ub.ruangLab?.namaRuang || "-",
          meja: ub.meja?.meja || "-",
          kondisiBarang: ub.kondisiBarang,
          status: ub.status,
          ruangLabId: Number(ub.ruangLabId) || 0,
          mejaId: Number(ub.mejaId) || 0,
          barangId: Number(ub.barangId),
        }))}
        ruangLabs={ruangLabs.map((rl) => ({
          id: Number(rl.id),
          namaRuang: rl.namaRuang,
        }))}
        mejas={mejas.map((m) => ({
          id: Number(m.id),
          meja: m.meja,
          ruangLabId: Number(m.ruangLabId),
          namaRuang: m.ruangLab?.namaRuang || "-",
        }))}
        userRole={session.role}
        assignedLabIds={assignedLabIds}
      />
    </AuthLayout>
  );
}
