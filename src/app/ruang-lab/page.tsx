import { requireAuth } from "@/lib/auth";
import { db } from "@/lib/db";
import AuthLayout from "@/components/AuthLayout";
import RuangLabClient from "./RuangLabClient";

export default async function RuangLabPage() {
  const session = await requireAuth();

  const ruangLabs = await db.ruangLab.findMany({
    include: { _count: { select: { unitBarangs: true } } },
    orderBy: { createdAt: "desc" },
  });

  return (
    <AuthLayout userId={Number(session.userId)}>
      <RuangLabClient
        ruangLabs={ruangLabs.map((rl) => ({
          id: Number(rl.id),
          namaRuang: rl.namaRuang,
          deskripsi: rl.deskripsi || "",
          unitCount: rl._count.unitBarangs,
        }))}
        userRole={session.role}
      />
    </AuthLayout>
  );
}
