"use client";

import { useRouter } from "next/navigation";
import AuthShell from "@/components/auth/AuthShell";
import { useState } from "react";
import { login } from "@/lib/services/auth";
import { setAuthToken, setAuthUser } from "@/lib/auth";

export default function LoginPage() {
  const router = useRouter();
  const [remember, setRemember] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    try {
      setLoading(true);
      setError(null);
      const res = await login({ email, password, remember });
      if (res?.requires2fa) {
        router.push("/login/otp");
        return;
      }
      console.log(res);
      if (res?.success) {
        if (res.token) setAuthToken(res.token);
        if (res.user) setAuthUser(res.user);
        router.push("/dashboard");
        return;
      }
      setError(res?.message || "Login failed");
    } catch (err: any) {
      setError(err?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthShell>
      {/* top badge */}
      <div className="mx-auto grid h-[88px] w-[88px] place-items-center rounded-full bg-[#3F205F]">
        <svg width="42" height="42" viewBox="0 0 49 49" fill="none" aria-hidden>
          <rect x="14" y="7" width="21" height="27" rx="6" stroke="white" strokeWidth="3" />
          <circle cx="24.5" cy="29.5" r="2.8" fill="white" />
        </svg>
      </div>

      <div className="mt-6 text-center">
        <h1 className="text-[32px] font-bold leading-[38px] text-[#0A0A0A]">Welcome Back</h1>
        <p className="mt-1 text-[16px] leading-[24px] text-[#6F6C90]">Sign in to your secure account</p>
      </div>

      <form onSubmit={submit} className="mt-8 space-y-5">
        <div>
          <label className="mb-2 flex items-center gap-2 text-[14px] font-medium text-[#0A0A0A]">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
              <path d="M2 7.5 12 13l10-5.5M2 7.5v9c0 2 1.5 3 3 3h14c1.5 0 3-1 3-3v-9" stroke="#6F6C90" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
            Email Address
          </label>
          <input
            className="h-[52px] w-full rounded-[12px] border border-[#E5E2EA] bg-[#F8F8FB] px-4 text-[15px] outline-none focus:border-[#3F205F]"
            placeholder="Enter your email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div>
          <label className="mb-2 flex items-center gap-2 text-[14px] font-medium text-[#0A0A0A]">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
              <rect x="4" y="10" width="16" height="10" rx="2" stroke="#6F6C90" strokeWidth="1.5" />
              <path d="M8 10V8a4 4 0 1 1 8 0v2" stroke="#6F6C90" strokeWidth="1.5" />
            </svg>
            Password
          </label>
          <input
            type="password"
            className="h-[52px] w-full rounded-[12px] border border-[#E5E2EA] bg-[#F8F8FB] px-4 text-[15px] outline-none focus:border-[#3F205F]"
            placeholder="Enter your password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <div className="mt-1 flex items-center justify-between">
          <label className="inline-flex items-center gap-2 text-[14px] text-[#0A0A0A]">
            <input
              type="checkbox"
              checked={remember}
              onChange={(e) => setRemember(e.target.checked)}
              className="h-[16px] w-[16px] rounded-[4px] border border-[#D9D6E2]"
            />
            Remember me
          </label>
          <button type="button" className="text-[14px] text-[#6F6C90] underline">
            Forgot password?
          </button>
        </div>

        {
          error ? (
            <div className="text-[14px] text-red-600">{error}</div>
          ) : null
        }

        <button
          type="submit"
          disabled={loading || !email || !password}
          className="mt-2 h-[52px] w-full rounded-[12px] bg-[#3F205F] text-[16px] font-semibold text-white disabled:opacity-60"
        >
          {loading ? "Signing in..." : "Sign In"}
        </button>
      </form>
    </AuthShell >
  );
}
