"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { api } from "@/lib/api";

type AuthGuardProps = {
  children: React.ReactNode;
};

export function AuthGuard({ children }: AuthGuardProps) {
  const router = useRouter();

  const [checking, setChecking] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    async function checkAuth() {
      try {
        await api.me();
        setAuthenticated(true);
      } catch {
        router.replace("/login");
      } finally {
        setChecking(false);
      }
    }

    checkAuth();
  }, [router]);

  if (checking) {
    return (
      <main className="flex min-h-dvh items-center justify-center bg-background">
        <p className="text-sm text-muted-foreground">Checking authentication...</p>
      </main>
    );
  }

  if (!authenticated) {
    return null;
  }

  return <>{children}</>;
}
