import { requireAuth, getAssignedLabIds } from "@/lib/auth";
import { db } from "@/lib/db";
import AuthLayout from "@/components/AuthLayout";
import MejaClient from "./MejaClient";
import { Metadata } from "next";

export const metadata: Metadata = {
  title : "Meja | Inventaris LDTE",
  description : ""
}

export default async function MejaPage() {
  const session = await requireAuth();

  let where: Record<string, unknown> = {};

  if (session.role === "petugas") {
    const labIds = await getAssignedLabIds(Number(session.userId));
    where = { ruangLabId: { in: labIds } };
  }

  const [mejas, total] = await Promise.all([
    db.meja.findMany({
      where,
      select: {
        id: true,
        meja: true,
        ruangLabId: true,
        ruangLab: { select: { namaRuang: true } },
      },
      orderBy: { createdAt: "desc" },
      take: 10,
    }),
    db.meja.count({ where }),
  ]);

  const ruangLabs = await db.ruangLab.findMany({
    select: { id: true, namaRuang: true }
  });

  // Fetch unit barang for each meja
  const mejaIds = mejas.map((m) => m.id);
  const unitBarangs = await db.unitBarang.findMany({
    where: { mejaId: { in: mejaIds } },
    select: {
      id: true,
      kodeBarang: true,
      kondisiBarang: true,
      status: true,
      mejaId: true,
      barang: { select: { namaBarang: true } }
    }
  });

  // Group unit barang by mejaId
  const unitBarangByMeja: Record<number, { id: number; kodeBarang: string; namaBarang: string; kondisiBarang: string; status: string }[]> = {};
  for (const ub of unitBarangs) {
    const mejaId = Number(ub.mejaId);
    if (!unitBarangByMeja[mejaId]) {
      unitBarangByMeja[mejaId] = [];
    }
    unitBarangByMeja[mejaId].push({
      id: Number(ub.id),
      kodeBarang: ub.kodeBarang,
      namaBarang: ub.barang.namaBarang,
      kondisiBarang: ub.kondisiBarang,
      status: ub.status,
    });
  }

  // Get assigned lab IDs for petugas
  const assignedLabIds = session.role === "petugas"
    ? await getAssignedLabIds(Number(session.userId))
    : [];

  return (
    <AuthLayout userId={Number(session.userId)}>
      <MejaClient
        initialMejas={mejas.map((m) => ({
          id: Number(m.id),
          meja: m.meja,
          ruangLab: m.ruangLab.namaRuang,
          ruangLabId: Number(m.ruangLabId),
          barangCount: (unitBarangByMeja[Number(m.id)] || []).length,
        }))}
        initialTotal={total}
        unitBarangByMeja={unitBarangByMeja}
        userRole={session.role}
        assignedLabIds={assignedLabIds}
      />
    </AuthLayout>
  );
}
