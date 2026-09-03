import { requireAuth } from "@/lib/auth";
import { db } from "@/lib/db";
import AuthLayout from "@/components/AuthLayout";
import RuangLabClient from "./RuangLabClient";
import { Metadata } from "next";

export const metadata: Metadata = {
  title : "Ruang Lab | Inventaris LDTE",
  description : ""
}

export default async function RuangLabPage() {
  const session = await requireAuth();

  const [ruangLabs, total] = await Promise.all([
    db.ruangLab.findMany({
      select: {
        id: true,
        namaRuang: true,
        deskripsi: true,
        _count: { select: { unitBarangs: true } },
      },
      orderBy: { createdAt: "desc" },
      take: 10,
    }),
    db.ruangLab.count(),
  ]);

  return (
    <AuthLayout userId={Number(session.userId)}>
      <RuangLabClient
        initialRuangLabs={ruangLabs.map((rl) => ({
          id: Number(rl.id),
          namaRuang: rl.namaRuang,
          deskripsi: rl.deskripsi || "",
          unitCount: rl._count.unitBarangs,
        }))}
        initialTotal={total}
        userRole={session.role}
      />
    </AuthLayout>
  );
}
