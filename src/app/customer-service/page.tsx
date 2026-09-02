import { requireAuth } from "@/lib/auth";
import AuthLayout from "@/components/AuthLayout";
import CustomerServiceClient from "./CustomerServiceClient";

export default async function CustomerServicePage() {
  const session = await requireAuth();

  return (
    <AuthLayout userId={Number(session.userId)}>
      <CustomerServiceClient />
    </AuthLayout>
  );
}
