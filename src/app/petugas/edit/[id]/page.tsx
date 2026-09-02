import { requireAdmin } from "@/lib/auth";
import { db } from "@/lib/db";
import AuthLayout from "@/components/AuthLayout";
import PetugasForm from "../../PetugasForm";
import { notFound } from "next/navigation";

export default async function EditPetugasPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await requireAdmin();
  const { id } = await params;

  const user = await db.user.findUnique({
    where: { id: BigInt(id) },
  });

  if (!user || user.role !== "petugas") {
    notFound();
  }

  return (
    <AuthLayout userId={Number(session.userId)}>
      <PetugasForm
        initialData={{
          id: Number(user.id),
          name: user.name,
          email: user.email,
        }}
        isEdit
      />
    </AuthLayout>
  );
}
