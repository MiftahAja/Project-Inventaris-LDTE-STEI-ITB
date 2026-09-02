import { requireAuth } from "@/lib/auth";
import { db } from "@/lib/db";
import AuthLayout from "@/components/AuthLayout";
import UnitBarangForm from "../UnitBarangForm";

export default async function CreateUnitBarangPage() {
  const session = await requireAuth();

  const [barangs, ruangLabs, mejas] = await Promise.all([
    db.barang.findMany({ orderBy: { namaBarang: "asc" } }),
    db.ruangLab.findMany({ orderBy: { namaRuang: "asc" } }),
    db.meja.findMany({ orderBy: { meja: "asc" } }),
  ]);

  return (
    <AuthLayout userId={Number(session.userId)}>
      <UnitBarangForm
        barangs={barangs.map((b) => ({ id: Number(b.id), namaBarang: b.namaBarang }))}
        ruangLabs={ruangLabs.map((rl) => ({ id: Number(rl.id), namaRuang: rl.namaRuang }))}
        mejas={mejas.map((m) => ({ id: Number(m.id), meja: m.meja, ruangLabId: Number(m.ruangLabId) }))}
      />
    </AuthLayout>
  );
}
