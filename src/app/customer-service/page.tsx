import { requireAuth } from "@/lib/auth";
import AuthLayout from "@/components/AuthLayout";
import CustomerServiceClient from "./CustomerServiceClient";
import { Metadata } from "next";

export const metadata: Metadata = {
  title : "Customer Service",
  description : ""
}

export default async function CustomerServicePage() {
  const session = await requireAuth();

  return (
    <AuthLayout userId={Number(session.userId)}>
      <CustomerServiceClient />
    </AuthLayout>
  );
}
