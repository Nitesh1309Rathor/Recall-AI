"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";

export function AuthRedirectGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [checking, setChecking] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);
  useEffect(() => {
    api
      .me()
      .then(() => {
        setAuthenticated(true);
        router.replace("/dashboard");
      })
      .catch(() => setChecking(false));
  }, [router]);
  if (checking || authenticated)
    return <main className="flex min-h-dvh items-center justify-center bg-[#f5f8fe] text-sm text-muted-foreground">Checking authentication...</main>;
  return <>{children}</>;
}
