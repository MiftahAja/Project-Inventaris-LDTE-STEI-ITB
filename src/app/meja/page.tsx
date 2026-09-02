import { requireAuth, getAssignedLabIds } from "@/lib/auth";
import { db } from "@/lib/db";
import AuthLayout from "@/components/AuthLayout";
import MejaClient from "./MejaClient";

export default async function MejaPage() {
  const session = await requireAuth();

  let where: Record<string, unknown> = {};

  if (session.role === "petugas") {
    const labIds = await getAssignedLabIds(Number(session.userId));
    where = { ruangLabId: { in: labIds } };
  }

  const mejas = await db.meja.findMany({
    where,
    include: { ruangLab: true },
    orderBy: { createdAt: "desc" },
  });

  const ruangLabs = await db.ruangLab.findMany();

  // Fetch unit barang for each meja
  const mejaIds = mejas.map((m) => m.id);
  const unitBarangs = await db.unitBarang.findMany({
    where: { mejaId: { in: mejaIds } },
    include: { barang: true },
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

  return (
    <AuthLayout userId={Number(session.userId)}>
      <MejaClient
        mejas={mejas.map((m) => ({
          id: Number(m.id),
          meja: m.meja,
          ruangLab: m.ruangLab.namaRuang,
          ruangLabId: Number(m.ruangLabId),
          barangCount: (unitBarangByMeja[Number(m.id)] || []).length,
        }))}
        ruangLabs={ruangLabs.map((rl) => ({
          id: Number(rl.id),
          namaRuang: rl.namaRuang,
        }))}
        unitBarangByMeja={unitBarangByMeja}
        userRole={session.role}
      />
    </AuthLayout>
  );
}
