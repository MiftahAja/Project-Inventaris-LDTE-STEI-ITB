import { requireAdmin } from "@/lib/auth";
import { db } from "@/lib/db";
import AuthLayout from "@/components/AuthLayout";
import MutasiStokForm from "../MutasiStokForm";

export default async function CreateMutasiStokPage() {
  const session = await requireAdmin();

  const unitBarangs = await db.unitBarang.findMany({
    include: { barang: true },
    orderBy: { kodeBarang: "asc" },
  });

  return (
    <AuthLayout userId={Number(session.userId)}>
      <MutasiStokForm
        unitBarangs={unitBarangs.map((ub) => ({
          id: Number(ub.id),
          kodeBarang: ub.kodeBarang,
          namaBarang: ub.barang.namaBarang,
        }))}
      />
    </AuthLayout>
  );
}
