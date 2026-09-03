import { requireAdmin } from "@/lib/auth";
import AuthLayout from "@/components/AuthLayout";
import BarangForm from "../BarangForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title : "Tambah Barang",
  description : ""
}

export default async function CreateBarangPage() {
  const session = await requireAdmin();

  return (
    <AuthLayout userId={Number(session.userId)}>
      <BarangForm />
    </AuthLayout>
  );
}
