import { requireAuth, getAssignedLabIds, canWriteToLab } from "@/lib/auth";
import { db } from "@/lib/db";
import AuthLayout from "@/components/AuthLayout";
import MejaForm from "../../MejaForm";
import { notFound, redirect } from "next/navigation";
import { Metadata } from "next";

export const metadata: Metadata = {
  title : "Edit Meja",
  description : ""
}

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

  // Check if petugas has access to this meja's lab
  const canWrite = await canWriteToLab(Number(session.userId), Number(meja.ruangLabId));
  if (!canWrite) {
    redirect("/meja");
  }

  const ruangLabs = await db.ruangLab.findMany({ orderBy: { namaRuang: "asc" } });

  // Get assigned lab IDs for petugas
  const assignedLabIds = session.role === "petugas"
    ? await getAssignedLabIds(Number(session.userId))
    : [];

  return (
    <AuthLayout userId={Number(session.userId)}>
      <MejaForm
        initialData={{
          id: Number(meja.id),
          meja: meja.meja,
          ruangLabId: Number(meja.ruangLabId),
        }}
        ruangLabs={ruangLabs.map((rl) => ({ id: Number(rl.id), namaRuang: rl.namaRuang }))}
        assignedLabIds={assignedLabIds}
        userRole={session.role}
      />
    </AuthLayout>
  );
}
