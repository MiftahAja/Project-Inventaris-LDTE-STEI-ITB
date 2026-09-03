import { requireAuth, getAssignedLabIds } from "@/lib/auth";
import { db } from "@/lib/db";
import AuthLayout from "@/components/AuthLayout";
import MejaForm from "../MejaForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title : "Tambah Meja",
  description : ""
}

export default async function CreateMejaPage() {
  const session = await requireAuth();

  const ruangLabs = await db.ruangLab.findMany({ orderBy: { namaRuang: "asc" } });

  // Get assigned lab IDs for petugas
  const assignedLabIds = session.role === "petugas"
    ? await getAssignedLabIds(Number(session.userId))
    : [];

  return (
    <AuthLayout userId={Number(session.userId)}>
      <MejaForm
        ruangLabs={ruangLabs.map((rl) => ({ id: Number(rl.id), namaRuang: rl.namaRuang }))}
        assignedLabIds={assignedLabIds}
        userRole={session.role}
      />
    </AuthLayout>
  );
}
