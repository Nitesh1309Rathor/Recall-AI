import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function FinalCTA() {
  return (
    <section className="border-y border-border/60 bg-muted/30">
      <div className="mx-auto max-w-4xl px-4 py-16 text-center sm:px-6 md:py-24">
        <h2 className="text-3xl font-black tracking-tight md:text-5xl">Ready to test what you actually remember?</h2>
        <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-muted-foreground">
          Turn what you read into what you can recall, starting with your next PDF.
        </p>
        <Link href="/dashboard" className={cn(buttonVariants({ size: "lg" }), "mt-8 h-12 px-6 text-base")}>
          Start Studying
          <ArrowRight className="size-4" />
        </Link>
      </div>
    </section>
  );
}
