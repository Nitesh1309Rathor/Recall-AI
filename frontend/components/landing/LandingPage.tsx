"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { FeaturesSection } from "@/components/landing/FeaturesSection";
import { FinalCTA } from "@/components/landing/FinalCTA";
import { HeroSection } from "@/components/landing/HeroSection";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { LandingFooter } from "@/components/landing/LandingFooter";
import { LandingNavbar } from "@/components/landing/LandingNavbar";
import { ProgressSection } from "@/components/landing/ProgressSection";
import { WhyRecall } from "@/components/landing/WhyRecall";

export function LandingPage({ authenticated = false }: { authenticated?: boolean }) {
  const [user, setUser] = useState<{ id: string; email: string } | null>(null);
  useEffect(() => { if (authenticated) api.me().then(({ user: currentUser }) => setUser(currentUser)).catch(() => setUser(null)); }, [authenticated]);
  return <main className="min-h-dvh overflow-hidden bg-background text-foreground"><LandingNavbar authenticated={authenticated} user={user} /><HeroSection /><FeaturesSection /><HowItWorks /><WhyRecall /><ProgressSection /><FinalCTA /><LandingFooter /></main>;
}
