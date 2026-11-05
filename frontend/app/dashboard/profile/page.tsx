"use client";

import { useEffect, useState } from "react";
import { UserRound } from "lucide-react";

import { api } from "@/lib/api";

type AuthUser = {
  id: string;
  email: string;
};

export default function ProfilePage() {
  const [user, setUser] = useState<AuthUser | null>(null);

  useEffect(() => {
    api
      .me()
      .then(({ user }) => setUser(user))
      .catch(() => setUser(null));
  }, []);

  return (
    <>
      <div className="mb-6">
        <h1 className="text-3xl font-extrabold tracking-tight md:text-4xl">Profile</h1>
        <p className="mt-3 text-base text-muted-foreground">Basic account information for your Recall AI workspace.</p>
      </div>

      <section className="max-w-2xl rounded-lg border border-border bg-card p-6 shadow-sm md:p-7">
        <div className="flex items-center gap-4">
          <div className="flex size-14 items-center justify-center rounded-full bg-primary/15 text-lg font-black text-primary">
            {user?.email.charAt(0).toUpperCase() || <UserRound className="size-6" />}
          </div>
          <div>
            <h2 className="text-xl font-extrabold">{user?.email || "Loading profile"}</h2>
            <p className="mt-1 text-sm text-muted-foreground">Recall AI student account</p>
          </div>
        </div>

        <dl className="mt-7 divide-y divide-border rounded-lg border border-border">
          <div className="grid gap-1 p-4 sm:grid-cols-[9rem_1fr]">
            <dt className="text-sm font-bold text-muted-foreground">Email</dt>
            <dd className="break-all text-sm font-medium">{user?.email || "Loading..."}</dd>
          </div>
          <div className="grid gap-1 p-4 sm:grid-cols-[9rem_1fr]">
            <dt className="text-sm font-bold text-muted-foreground">User ID</dt>
            <dd className="break-all font-mono text-xs text-muted-foreground">{user?.id || "Loading..."}</dd>
          </div>
        </dl>
      </section>
    </>
  );
}
