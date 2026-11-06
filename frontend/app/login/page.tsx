"use client";

import { useRouter } from "next/navigation";
import { AuthPage } from "@/components/auth/AuthPage";
import { AuthRedirectGuard } from "@/components/auth/AuthRedirectGuard";

export default function LoginPage() {
  const router = useRouter();
  return (
    <AuthRedirectGuard>
      <AuthPage
        mode="login"
        onSuccess={() => {
          router.push("/dashboard");
          router.refresh();
        }}
      />
    </AuthRedirectGuard>
  );
}
