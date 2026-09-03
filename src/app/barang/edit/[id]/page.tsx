import { requireAdmin } from "@/lib/auth";
import { db } from "@/lib/db";
import AuthLayout from "@/components/AuthLayout";
import BarangForm from "../../BarangForm";
import { notFound } from "next/navigation";
import { Metadata } from "next";

export const metadata: Metadata = {
  title : "Edit Barang",
  description : ""
}

export default async function EditBarangPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await requireAdmin();
  const { id } = await params;

  const barang = await db.barang.findUnique({
    where: { id: BigInt(id) },
  });

  if (!barang) {
    notFound();
  }

  return (
    <AuthLayout userId={Number(session.userId)}>
      <BarangForm
        initialData={{
          id: Number(barang.id),
          namaBarang: barang.namaBarang,
        }}
      />
    </AuthLayout>
  );
}
