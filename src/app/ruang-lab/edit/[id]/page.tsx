import { requireAdmin } from "@/lib/auth";
import { db } from "@/lib/db";
import AuthLayout from "@/components/AuthLayout";
import RuangLabForm from "../../RuangLabForm";
import { notFound } from "next/navigation";
import { Metadata } from "next";

export const metadata: Metadata = {
  title : "Edit Ruang Lab",
  description : ""
}

export default async function EditRuangLabPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await requireAdmin();
  const { id } = await params;

  const ruangLab = await db.ruangLab.findUnique({
    where: { id: BigInt(id) },
  });

  if (!ruangLab) {
    notFound();
  }

  return (
    <AuthLayout userId={Number(session.userId)}>
      <RuangLabForm
        initialData={{
          id: Number(ruangLab.id),
          namaRuang: ruangLab.namaRuang,
          deskripsi: ruangLab.deskripsi || "",
        }}
      />
    </AuthLayout>
  );
}
