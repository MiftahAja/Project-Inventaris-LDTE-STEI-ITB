import { requireAdmin } from "@/lib/auth";
import AuthLayout from "@/components/AuthLayout";
import PetugasForm from "../PetugasForm";

export default async function CreatePetugasPage() {
  const session = await requireAdmin();

  return (
    <AuthLayout userId={Number(session.userId)}>
      <PetugasForm />
    </AuthLayout>
  );
}
