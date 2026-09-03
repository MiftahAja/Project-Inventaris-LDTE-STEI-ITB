import { requireAuth } from "@/lib/auth";
import { db } from "@/lib/db";
import AuthLayout from "@/components/AuthLayout";
import BarangClient from "./BarangClient";
import { Metadata } from "next";

export const metadata: Metadata = {
  title : "Barang | Inventaris LDTE",
  description : ""
}

export default async function BarangPage() {
  const session = await requireAuth();

  const [barangs, total] = await Promise.all([
    db.barang.findMany({
      orderBy: { createdAt: "desc" },
      take: 10,
    }),
    db.barang.count(),
  ]);

  return (
    <AuthLayout userId={Number(session.userId)}>
      <BarangClient
        initialBarangs={barangs.map((b) => ({
          id: Number(b.id),
          namaBarang: b.namaBarang,
          createdAt: b.createdAt?.toISOString() || "",
        }))}
        initialTotal={total}
        userRole={session.role}
      />
    </AuthLayout>
  );
}
