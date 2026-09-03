import { requireAdmin } from "@/lib/auth";
import AuthLayout from "@/components/AuthLayout";
import RuangLabForm from "../RuangLabForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title : "Tambah Ruang Lab",
  description : ""
}

export default async function CreateRuangLabPage() {
  const session = await requireAdmin();

  return (
    <AuthLayout userId={Number(session.userId)}>
      <RuangLabForm />
    </AuthLayout>
  );
}
