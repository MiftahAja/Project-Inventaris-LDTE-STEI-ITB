import { requireAuth } from "@/lib/auth";
import { db } from "@/lib/db";
import AuthLayout from "@/components/AuthLayout";
import BarangClient from "./BarangClient";

export default async function BarangPage() {
  const session = await requireAuth();

  const barangs = await db.barang.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <AuthLayout userId={Number(session.userId)}>
      <BarangClient
        barangs={barangs.map((b) => ({
          id: Number(b.id),
          namaBarang: b.namaBarang,
          createdAt: b.createdAt?.toISOString() || "",
        }))}
        userRole={session.role}
      />
    </AuthLayout>
  );
}
