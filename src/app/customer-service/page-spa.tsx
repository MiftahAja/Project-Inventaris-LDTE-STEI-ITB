"use client";

import AuthLayout from "@/components/AuthLayout";
import CustomerServiceClient from "./CustomerServiceClient";

export default function CustomerServicePage() {
  return (
    <AuthLayout>
      <CustomerServiceClient />
    </AuthLayout>
  );
}
