"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { BookOpen, Eye, EyeOff, LockKeyhole, Mail } from "lucide-react";
import { api } from "@/lib/api";

type AuthMode = "login" | "signup";

function Brand() {
  return (
    <div className="flex items-center gap-2.5 text-[1.35rem] font-extrabold tracking-[-0.04em] text-[#111827]">
      <BookOpen className="size-8 stroke-[2.2] text-[#2563EB]" />
      <span>Recall AI</span>
    </div>
  );
}

function BooksIllustration() {
  return (
    <div aria-hidden="true" className="relative mx-auto mt-auto h-40 w-full max-w-[290px]">
      <span className="absolute bottom-1 left-1/2 h-5 w-[88%] -translate-x-1/2 rounded-[50%] bg-[#cfe0ff]" />
      <span className="absolute bottom-7 left-[13%] h-9 w-[72%] rotate-1 rounded-[10px] border-[4px] border-[#2563EB] bg-white shadow-[0_5px_0_#a8c7ff]" />
      <span className="absolute bottom-[3.7rem] left-[18%] h-8 w-[68%] -rotate-1 rounded-[9px] border-[4px] border-[#1d73ed] bg-[#dbe9ff] shadow-[0_5px_0_#0f5fd5]" />
      <span className="absolute bottom-[5.8rem] left-[22%] h-8 w-[59%] rotate-1 rounded-[9px] border-[4px] border-[#2563EB] bg-white shadow-[0_5px_0_#9fc1ff]" />
      <span className="absolute bottom-[7.75rem] left-[29%] h-7 w-[48%] -rotate-1 rounded-[9px] border-[4px] border-[#2c7cf0] bg-white" />
      <span className="absolute bottom-[7.75rem] right-[18%] h-7 w-8 rounded-full bg-[#d2e2ff]" />
      <span className="absolute bottom-[8.6rem] left-[18%] h-6 w-1 rotate-[-28deg] rounded-full bg-[#2563EB]" />
      <span className="absolute bottom-[9.25rem] left-[25%] h-5 w-1 rotate-[-48deg] rounded-full bg-[#2563EB]" />
    </div>
  );
}

function Field({
  id,
  label,
  type,
  value,
  placeholder,
  onChange,
  showPassword,
  onTogglePassword,
}: {
  id: string;
  label: string;
  type: "email" | "password";
  value: string;
  placeholder: string;
  onChange: (value: string) => void;
  showPassword?: boolean;
  onTogglePassword?: () => void;
}) {
  const password = type === "password";
  return (
    <div className="space-y-2.5">
      <label htmlFor={id} className="text-sm font-bold text-[#111827]">
        {label}
      </label>
      <div className="relative">
        {password ? (
          <LockKeyhole className="pointer-events-none absolute left-4 top-1/2 size-[18px] -translate-y-1/2 text-[#61779f]" />
        ) : (
          <Mail className="pointer-events-none absolute left-4 top-1/2 size-[18px] -translate-y-1/2 text-[#61779f]" />
        )}
        <input
          id={id}
          type={password && showPassword ? "text" : type}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder}
          required
          className="h-12 w-full rounded-[10px] border border-[#DCE4F0] bg-white pl-12 pr-12 text-sm text-[#111827] outline-none transition placeholder:text-[#6d7f9f] focus:border-[#2563EB] focus:ring-3 focus:ring-[#2563EB]/10"
        />
        {password && onTogglePassword && (
          <button
            type="button"
            aria-label={showPassword ? "Hide password" : "Show password"}
            onClick={onTogglePassword}
            className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-1 text-[#61779f] hover:text-[#2563EB]"
          >
            {showPassword ? <EyeOff className="size-[18px]" /> : <Eye className="size-[18px]" />}
          </button>
        )}
      </div>
    </div>
  );
}

export function AuthPage({ mode, onSuccess }: { mode: AuthMode; onSuccess: () => void }) {
  const login = mode === "login";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [remember, setRemember] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    if (!login && password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    try {
      setLoading(true);
      if (login) await api.login(email, password);
      else await api.signup(email, password);
      onSuccess();
    } catch (submissionError) {
      setError(submissionError instanceof Error ? submissionError.message : login ? "Failed to sign in." : "Failed to create account.");
    } finally {
      setLoading(false);
    }
  }
  return (
    <main className="flex min-h-dvh items-center justify-center bg-[#f5f8fe] px-4 py-6 sm:px-6 lg:py-10">
      <section className="flex w-full max-w-[1160px] overflow-hidden rounded-2xl border border-[#dce6f5] bg-white shadow-[0_18px_45px_rgba(37,77,140,0.12)]">
        <aside className="hidden w-[46%] flex-col bg-[#edf4ff] p-9 lg:flex xl:p-11">
          <Brand />
          <div className="mt-24 max-w-[360px]">
            <h1 className="text-[2.1rem] font-extrabold leading-[1.1] tracking-[-0.04em] text-[#111827]">
              {login ? (
                <>
                  Welcome back to
                  <br />
                  <span className="text-[#2563EB]">Recall AI</span>
                </>
              ) : (
                <>
                  Start your
                  <br />
                  <span className="text-[#2563EB]">learning journey</span>
                </>
              )}
            </h1>
            <p className="mt-5 max-w-[300px] text-[1.05rem] leading-7 text-[#50658b]">
              {login ? "Continue your learning journey with AI-powered study tools." : "Create an account and explore powerful study tools."}
            </p>
          </div>
          <BooksIllustration />
        </aside>
        <div className="w-full px-6 py-9 sm:px-12 sm:py-12 lg:w-[54%] lg:px-14 xl:px-16">
          <div className="mb-8 lg:hidden">
            <Brand />
          </div>
          <div className="max-w-[390px]">
            <h2 className="text-[2rem] font-extrabold tracking-[-0.04em] text-[#111827]">{login ? "Login" : "Create Account"}</h2>
            <p className="mt-1.5 text-base text-[#50658b]">{login ? "Sign in to your account" : "Join Recall AI and start learning smarter."}</p>
            <form onSubmit={handleSubmit} className="mt-8 space-y-5">
              <Field id="email" label="Email" type="email" value={email} onChange={setEmail} placeholder="you@example.com" />
              <Field
                id="password"
                label="Password"
                type="password"
                value={password}
                onChange={setPassword}
                placeholder={login ? "Enter your password" : "Create a password"}
                showPassword={showPassword}
                onTogglePassword={() => setShowPassword((value) => !value)}
              />
              {!login && (
                <Field
                  id="confirm-password"
                  label="Confirm Password"
                  type="password"
                  value={confirmPassword}
                  onChange={setConfirmPassword}
                  placeholder="Confirm your password"
                  showPassword={showConfirmPassword}
                  onTogglePassword={() => setShowConfirmPassword((value) => !value)}
                />
              )}
              {login && (
                <label className="flex items-center gap-2 text-sm font-semibold text-[#26334a]">
                  <input type="checkbox" checked={remember} onChange={(event) => setRemember(event.target.checked)} className="size-4 accent-[#2563EB]" />
                  Remember me
                </label>
              )}
              {error && (
                <p role="alert" className="text-sm font-semibold text-red-600">
                  {error}
                </p>
              )}
              <button
                type="submit"
                disabled={loading}
                className="h-12 w-full rounded-[10px] bg-[#2563EB] text-sm font-bold text-white shadow-[0_8px_18px_rgba(37,99,235,0.22)] transition hover:bg-[#1d4ed8] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? (login ? "Signing in..." : "Creating account...") : login ? "Sign In" : "Create Account"}
              </button>
            </form>
            <p className="mt-8 text-center text-sm text-[#61779f]">
              {login ? "Don't have an account?" : "Already have an account?"}{" "}
              <Link href={login ? "/signup" : "/login"} className="font-bold text-[#2563EB] hover:underline">
                {login ? "Create account" : "Sign in"}
              </Link>
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
