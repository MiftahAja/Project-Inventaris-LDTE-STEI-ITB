import { requireAdmin } from "@/lib/auth";
import { db } from "@/lib/db";
import AuthLayout from "@/components/AuthLayout";
import MutasiStokClient from "./MutasiStokClient";
import { Metadata } from "next";

export const metadata: Metadata = {
  title : "Mutasi Barang | Inventaris LDTE",
  description : ""
}

export default async function MutasiStokPage() {
  const session = await requireAdmin();

  const mutasiStoks = await db.mutasiStok.findMany({
    include: {
      unitBarang: {
        include: { barang: true },
      },
    },
    orderBy: { tanggal: "desc" },
  });

  return (
    <AuthLayout userId={Number(session.userId)}>
      <MutasiStokClient
        mutasiStoks={mutasiStoks.map((ms) => ({
          id: Number(ms.id),
          namaBarang: ms.unitBarang.barang.namaBarang,
          kodeBarang: ms.unitBarang.kodeBarang,
          tanggal: ms.tanggal.toISOString(),
          tipe: ms.tipe,
          keterangan: ms.keterangan || "-",
        }))}
      />
    </AuthLayout>
  );
}
