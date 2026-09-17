import { FeaturesSection } from "@/components/landing/FeaturesSection";
import { FinalCTA } from "@/components/landing/FinalCTA";
import { HeroSection } from "@/components/landing/HeroSection";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { LandingFooter } from "@/components/landing/LandingFooter";
import { LandingNavbar } from "@/components/landing/LandingNavbar";
import { ProductPreview } from "@/components/landing/ProductPreview";
import { ProgressSection } from "@/components/landing/ProgressSection";
import { WhyRecall } from "@/components/landing/WhyRecall";

export default function LandingPage() {
  return (
    <main className="min-h-dvh overflow-hidden bg-background text-foreground">
      <LandingNavbar />
      <HeroSection />
      <ProductPreview />
      <FeaturesSection />
      <HowItWorks />
      <WhyRecall />
      <ProgressSection />
      <FinalCTA />
      <LandingFooter />
    </main>
  );
}
