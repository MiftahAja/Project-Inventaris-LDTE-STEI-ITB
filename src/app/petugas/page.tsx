import { requireAdmin } from "@/lib/auth";
import { db } from "@/lib/db";
import AuthLayout from "@/components/AuthLayout";
import PetugasClient from "./PetugasClient";

export default async function PetugasPage() {
  const session = await requireAdmin();

  const users = await db.user.findMany({
    where: { role: "petugas" },
    include: { tambahPetugas: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <AuthLayout userId={Number(session.userId)}>
      <PetugasClient
        users={users.map((u) => ({
          id: Number(u.id),
          name: u.name,
          email: u.email,
          noTelp: u.tambahPetugas?.noTelp || "-",
          alamat: u.tambahPetugas?.alamat || "-",
        }))}
      />
    </AuthLayout>
  );
}
