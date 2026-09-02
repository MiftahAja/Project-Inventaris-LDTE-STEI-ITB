import { requireAuth } from "@/lib/auth";
import { db } from "@/lib/db";
import AuthLayout from "@/components/AuthLayout";
import MejaForm from "../MejaForm";

export default async function CreateMejaPage() {
  const session = await requireAuth();

  const ruangLabs = await db.ruangLab.findMany({ orderBy: { namaRuang: "asc" } });

  return (
    <AuthLayout userId={Number(session.userId)}>
      <MejaForm ruangLabs={ruangLabs.map((rl) => ({ id: Number(rl.id), namaRuang: rl.namaRuang }))} />
    </AuthLayout>
  );
}
