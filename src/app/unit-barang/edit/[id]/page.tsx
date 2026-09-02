import { requireAuth } from "@/lib/auth";
import { db } from "@/lib/db";
import AuthLayout from "@/components/AuthLayout";
import UnitBarangForm from "../../UnitBarangForm";
import { notFound } from "next/navigation";

export default async function EditUnitBarangPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await requireAuth();
  const { id } = await params;

  const unitBarang = await db.unitBarang.findUnique({
    where: { id: BigInt(id) },
  });

  if (!unitBarang) {
    notFound();
  }

  const [barangs, ruangLabs, mejas] = await Promise.all([
    db.barang.findMany({ orderBy: { namaBarang: "asc" } }),
    db.ruangLab.findMany({ orderBy: { namaRuang: "asc" } }),
    db.meja.findMany({ orderBy: { meja: "asc" } }),
  ]);

  return (
    <AuthLayout userId={Number(session.userId)}>
      <UnitBarangForm
        initialData={{
          id: Number(unitBarang.id),
          barangId: Number(unitBarang.barangId),
          kodeBarang: unitBarang.kodeBarang,
          kondisiBarang: unitBarang.kondisiBarang,
          status: unitBarang.status,
          ruangLabId: Number(unitBarang.ruangLabId) || 0,
          mejaId: Number(unitBarang.mejaId) || 0,
        }}
        barangs={barangs.map((b) => ({ id: Number(b.id), namaBarang: b.namaBarang }))}
        ruangLabs={ruangLabs.map((rl) => ({ id: Number(rl.id), namaRuang: rl.namaRuang }))}
        mejas={mejas.map((m) => ({ id: Number(m.id), meja: m.meja, ruangLabId: Number(m.ruangLabId) }))}
      />
    </AuthLayout>
  );
}
