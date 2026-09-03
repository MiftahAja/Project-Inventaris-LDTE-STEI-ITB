import { Suspense } from "react";
import RegisterClient from "./RegisterClient";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Register | Inventaris LDTE",
  description: "",
};

export default function LoginPage() {
  return (
    <Suspense>
      <RegisterClient />
    </Suspense>
  );
}
