import { requireAdmin } from "@/lib/auth";
import { db } from "@/lib/db";
import AuthLayout from "@/components/AuthLayout";
import PetugasClient from "./PetugasClient";
import { Metadata } from "next";

export const metadata: Metadata = {
  title : "Petugas | Inventaris LDTE",
  description : ""
}

export default async function PetugasPage() {
  const session = await requireAdmin();

  const [users, total] = await Promise.all([
    db.user.findMany({
      where: { role: "petugas" },
      select: {
        id: true,
        name: true,
        email: true,
        tambahPetugas: {
          select: {
            noTelp: true,
            alamat: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
      take: 10,
    }),
    db.user.count({ where: { role: "petugas" } }),
  ]);

  return (
    <AuthLayout userId={Number(session.userId)}>
      <PetugasClient
        initialUsers={users.map((u) => ({
          id: Number(u.id),
          name: u.name,
          email: u.email,
          noTelp: u.tambahPetugas?.noTelp || "-",
          alamat: u.tambahPetugas?.alamat || "-",
        }))}
        initialTotal={total}
      />
    </AuthLayout>
  );
}
