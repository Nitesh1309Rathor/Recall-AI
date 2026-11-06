"use client";

import { useRouter } from "next/navigation";
import { AuthPage } from "@/components/auth/AuthPage";
import { AuthRedirectGuard } from "@/components/auth/AuthRedirectGuard";

export default function SignupPage() {
  const router = useRouter();
  return (
    <AuthRedirectGuard>
      <AuthPage mode="signup" onSuccess={() => router.push("/dashboard")} />
    </AuthRedirectGuard>
  );
}
