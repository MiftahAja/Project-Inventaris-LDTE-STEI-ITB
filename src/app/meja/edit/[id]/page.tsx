import { requireAuth } from "@/lib/auth";
import { db } from "@/lib/db";
import AuthLayout from "@/components/AuthLayout";
import MejaForm from "../../MejaForm";
import { notFound } from "next/navigation";

export default async function EditMejaPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await requireAuth();
  const { id } = await params;

  const meja = await db.meja.findUnique({
    where: { id: BigInt(id) },
  });

  if (!meja) {
    notFound();
  }

  const ruangLabs = await db.ruangLab.findMany({ orderBy: { namaRuang: "asc" } });

  return (
    <AuthLayout userId={Number(session.userId)}>
      <MejaForm
        initialData={{
          id: Number(meja.id),
          meja: meja.meja,
          ruangLabId: Number(meja.ruangLabId),
        }}
        ruangLabs={ruangLabs.map((rl) => ({ id: Number(rl.id), namaRuang: rl.namaRuang }))}
      />
    </AuthLayout>
  );
}
