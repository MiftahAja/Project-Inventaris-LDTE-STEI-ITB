import { Suspense } from "react";
import LoginClient from "./LoginClient";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Login | Inventaris LDTE",
  description: "",
};

export default function LoginPage() {
  return (
    <Suspense>
      <LoginClient />
    </Suspense>
  );
}
