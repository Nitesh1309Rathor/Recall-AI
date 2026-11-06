"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { LandingPage } from "@/components/landing/LandingPage";

export default function PublicLandingPage() {
  const router = useRouter();
  const [checking, setChecking] = useState(true);
  useEffect(() => { api.me().then(() => router.replace("/dashboard")).catch(() => setChecking(false)); }, [router]);
  if (checking) return <main className="flex min-h-dvh items-center justify-center bg-background text-sm text-muted-foreground">Loading Recall AI...</main>;
  return <LandingPage />;
}
