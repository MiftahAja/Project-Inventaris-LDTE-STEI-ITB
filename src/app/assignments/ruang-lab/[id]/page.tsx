import { requireAdmin } from "@/lib/auth";
import { db } from "@/lib/db";
import AuthLayout from "@/components/AuthLayout";
import AssignmentDetailClient from "./AssignmentDetailClient";
import { notFound } from "next/navigation";

export default async function AssignmentDetailPage({
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

  const assignments = await db.assignment.findMany({
    where: { ruangLabId: BigInt(id) },
    include: { user: true },
    orderBy: { createdAt: "desc" },
  });

  const petugas = await db.user.findMany({
    where: { role: "petugas" },
    orderBy: { name: "asc" },
  });

  return (
    <AuthLayout userId={Number(session.userId)}>
      <AssignmentDetailClient
        ruangLab={{
          id: Number(ruangLab.id),
          namaRuang: ruangLab.namaRuang,
        }}
        assignments={assignments.map((a) => ({
          id: Number(a.id),
          userName: a.user.name,
          isActive: a.isActive,
          createdAt: a.createdAt?.toISOString() || "",
        }))}
        petugas={petugas.map((p) => ({
          id: Number(p.id),
          name: p.name,
        }))}
      />
    </AuthLayout>
  );
}
