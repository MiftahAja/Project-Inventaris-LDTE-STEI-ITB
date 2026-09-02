import { requireAdmin } from "@/lib/auth";
import AuthLayout from "@/components/AuthLayout";
import RuangLabForm from "../RuangLabForm";

export default async function CreateRuangLabPage() {
  const session = await requireAdmin();

  return (
    <AuthLayout userId={Number(session.userId)}>
      <RuangLabForm />
    </AuthLayout>
  );
}
