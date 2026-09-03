import { requireAuth, getAssignedLabIds } from "@/lib/auth";
import { db } from "@/lib/db";
import AuthLayout from "@/components/AuthLayout";
import UnitBarangForm from "../UnitBarangForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title : "Tambah Unit Barang",
  description : ""
}

export default async function CreateUnitBarangPage() {
  const session = await requireAuth();

  const [barangs, ruangLabs, mejas] = await Promise.all([
    db.barang.findMany({ orderBy: { namaBarang: "asc" } }),
    db.ruangLab.findMany({ orderBy: { namaRuang: "asc" } }),
    db.meja.findMany({ orderBy: { meja: "asc" } }),
  ]);

  // Get assigned lab IDs for petugas
  const assignedLabIds = session.role === "petugas"
    ? await getAssignedLabIds(Number(session.userId))
    : [];

  return (
    <AuthLayout userId={Number(session.userId)}>
      <UnitBarangForm
        barangs={barangs.map((b) => ({ id: Number(b.id), namaBarang: b.namaBarang }))}
        ruangLabs={ruangLabs.map((rl) => ({ id: Number(rl.id), namaRuang: rl.namaRuang }))}
        mejas={mejas.map((m) => ({ id: Number(m.id), meja: m.meja, ruangLabId: Number(m.ruangLabId) }))}
        assignedLabIds={assignedLabIds}
        userRole={session.role}
      />
    </AuthLayout>
  );
}
