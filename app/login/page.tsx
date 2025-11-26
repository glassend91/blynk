"use client";

import { useRouter } from "next/navigation";
import AuthShell from "@/components/auth/AuthShell";
import { useState, useRef, useEffect } from "react";
import { login } from "@/lib/services/auth";
import { setAuthToken, setAuthUser } from "@/lib/auth";
import MbbSignupController from "@/components/mobile-broadband/MbbSignupController";
import NbnSignupController from "@/components/nbn/NbnSignupController";
import MobileVoiceSignupController from "@/components/mobile-voice/MobileVoiceSignupController";

export default function LoginPage() {
  const router = useRouter();
  const [remember, setRemember] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [signupDropdownOpen, setSignupDropdownOpen] = useState(false);
  const signupDropdownRef = useRef<HTMLDivElement>(null);

  // Signup modal states
  const [openMbbFlow, setOpenMbbFlow] = useState(false);
  const [openNbnFlow, setOpenNbnFlow] = useState(false);
  const [openMobileFlow, setOpenMobileFlow] = useState(false);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (signupDropdownRef.current && !signupDropdownRef.current.contains(event.target as Node)) {
        setSignupDropdownOpen(false);
      }
    }

    if (signupDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [signupDropdownOpen]);

  const handleSignupFlow = (flow: string) => {
    setSignupDropdownOpen(false);
    if (flow === "sme") {
      // SME internet links to /business page
      router.push("/business");
    } else if (flow === "mbb") {
      setOpenMbbFlow(true);
    } else if (flow === "nbn") {
      setOpenNbnFlow(true);
    } else if (flow === "mobile-voice") {
      setOpenMobileFlow(true);
    }
  };

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

        // Role-based redirect: admins go to /admin, customers to /dashboard
        const role = (res.user as any)?.role || "customer";
        if (role === "admin") {
          router.push("/admin/dashboard");
        } else {
          router.push("/dashboard");
        }
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
            className="h-[52px] w-full rounded-[12px] border border-[#E5E2EA] bg-[#F8F8FB] px-4 text-[15px] outline-none transition-all duration-200 focus:border-[#3F205F] focus:bg-white focus:ring-2 focus:ring-[#3F205F]/20"
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
            className="h-[52px] w-full rounded-[12px] border border-[#E5E2EA] bg-[#F8F8FB] px-4 text-[15px] outline-none transition-all duration-200 focus:border-[#3F205F] focus:bg-white focus:ring-2 focus:ring-[#3F205F]/20"
            placeholder="Enter your password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <div className="flex items-center justify-between pt-1">
          <label className="inline-flex items-center gap-2 cursor-pointer group">
            <div className="relative">
              <input
                type="checkbox"
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
                className="h-[18px] w-[18px] rounded-[4px] border-2 border-[#D9D6E2] cursor-pointer transition-all duration-200 checked:bg-[#3F205F] checked:border-[#3F205F] focus:ring-2 focus:ring-[#3F205F]/20 focus:outline-none appearance-none"
              />
              {remember && (
                <svg
                  className="absolute top-0 left-0 h-[18px] w-[18px] pointer-events-none"
                  viewBox="0 0 18 18"
                  fill="none"
                >
                  <path d="M5 9L8 12L13 5" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              )}
            </div>
            <span className="text-[14px] text-[#0A0A0A] group-hover:text-[#3F205F] transition-colors">Remember me</span>
          </label>
          <button
            type="button"
            className="text-[14px] text-[#6F6C90] hover:text-[#3F205F] underline transition-colors"
          >
            Forgot password?
          </button>
        </div>

        {error && (
          <div className="rounded-[10px] bg-red-50 border border-red-200 px-4 py-3 flex items-start gap-3 animate-in fade-in slide-in-from-top-2 duration-200">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="flex-shrink-0 mt-0.5">
              <circle cx="12" cy="12" r="10" stroke="#DC2626" strokeWidth="1.5" />
              <path d="M12 8v4M12 16h.01" stroke="#DC2626" strokeWidth="2" strokeLinecap="round" />
            </svg>
            <p className="text-[14px] text-red-700 flex-1">{error}</p>
          </div>
        )}

        <button
          type="submit"
          disabled={loading || !email || !password}
          className="mt-2 h-[52px] w-full rounded-[12px] bg-[#3F205F] text-[16px] font-semibold text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#401B60] active:scale-[0.98] transition-all duration-200 shadow-md hover:shadow-lg disabled:shadow-none"
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Signing in...
            </span>
          ) : (
            "Sign In"
          )}
        </button>
      </form>

      {/* Signup Section */}
      <div className="mt-8 pt-6 border-t border-[#E5E2EA]">
        <div className="relative inline-block w-full" ref={signupDropdownRef}>
          <button
            type="button"
            onClick={() => setSignupDropdownOpen(!signupDropdownOpen)}
            className="w-full inline-flex items-center justify-center gap-2 text-[14px] font-medium text-[#6F6C90] hover:text-[#3F205F] transition-colors py-2"
          >
            <span>Don't have an account?</span>
            <span className="text-[#3F205F] font-semibold">Sign up</span>
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              className={`transition-transform duration-200 ${signupDropdownOpen ? "rotate-180" : ""}`}
            >
              <path d="M6 9L12 15L18 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>

          {signupDropdownOpen && (
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 bg-white rounded-[12px] shadow-xl border border-[#E5E2EA] py-2 z-50 animate-in fade-in slide-in-from-bottom-2 duration-200">
              <div className="px-2 py-1.5">
                <p className="text-[12px] font-medium text-[#6F6C90] px-2 mb-1">Choose a service:</p>
              </div>
              {/* MBB internet */}
              <button
                onClick={() => handleSignupFlow("mbb")}
                className="w-full text-left px-4 py-3 text-[14px] font-medium text-[#0A0A0A] hover:bg-[#F8F8FB] active:bg-[#F0EFF5] transition-colors flex items-center gap-3 group"
              >
                <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-[#3F205F]/10 flex items-center justify-center group-hover:bg-[#3F205F]/20 transition-colors">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
                    <rect x="5" y="2" width="14" height="20" rx="2" stroke="#3F205F" strokeWidth="1.5" />
                    <path d="M12 18v.01" stroke="#3F205F" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                </div>
                <div className="flex-1">
                  <div className="font-semibold text-[#0A0A0A] group-hover:text-[#3F205F] transition-colors">MBB internet</div>
                  <div className="text-[12px] text-[#6F6C90]">Mobile broadband</div>
                </div>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="opacity-0 group-hover:opacity-100 transition-opacity">
                  <path d="M9 18l6-6-6-6" stroke="#3F205F" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
              {/* SME internet */}
              <button
                onClick={() => handleSignupFlow("sme")}
                className="w-full text-left px-4 py-3 text-[14px] font-medium text-[#0A0A0A] hover:bg-[#F8F8FB] active:bg-[#F0EFF5] transition-colors flex items-center gap-3 group"
              >
                <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-[#3F205F]/10 flex items-center justify-center group-hover:bg-[#3F205F]/20 transition-colors">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
                    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" stroke="#3F205F" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M9 22V12h6v10" stroke="#3F205F" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <div className="flex-1">
                  <div className="font-semibold text-[#0A0A0A] group-hover:text-[#3F205F] transition-colors">SME internet</div>
                  <div className="text-[12px] text-[#6F6C90]">Business solutions</div>
                </div>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="opacity-0 group-hover:opacity-100 transition-opacity">
                  <path d="M9 18l6-6-6-6" stroke="#3F205F" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
              {/* NBN plan */}
              <button
                onClick={() => handleSignupFlow("nbn")}
                className="w-full text-left px-4 py-3 text-[14px] font-medium text-[#0A0A0A] hover:bg-[#F8F8FB] active:bg-[#F0EFF5] transition-colors flex items-center gap-3 group"
              >
                <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-[#3F205F]/10 flex items-center justify-center group-hover:bg-[#3F205F]/20 transition-colors">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
                    <path d="M8 2v4M16 2v4M3 10h18M5 4h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z" stroke="#3F205F" strokeWidth="1.5" strokeLinecap="round" />
                  </svg>
                </div>
                <div className="flex-1">
                  <div className="font-semibold text-[#0A0A0A] group-hover:text-[#3F205F] transition-colors">NBN plan</div>
                  <div className="text-[12px] text-[#6F6C90]">High-speed internet</div>
                </div>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="opacity-0 group-hover:opacity-100 transition-opacity">
                  <path d="M9 18l6-6-6-6" stroke="#3F205F" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
              {/* Mobile plan */}
              <button
                onClick={() => handleSignupFlow("mobile-voice")}
                className="w-full text-left px-4 py-3 text-[14px] font-medium text-[#0A0A0A] hover:bg-[#F8F8FB] active:bg-[#F0EFF5] transition-colors flex items-center gap-3 group"
              >
                <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-[#3F205F]/10 flex items-center justify-center group-hover:bg-[#3F205F]/20 transition-colors">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" stroke="#3F205F" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <div className="flex-1">
                  <div className="font-semibold text-[#0A0A0A] group-hover:text-[#3F205F] transition-colors">Mobile plan</div>
                  <div className="text-[12px] text-[#6F6C90]">Phone service</div>
                </div>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="opacity-0 group-hover:opacity-100 transition-opacity">
                  <path d="M9 18l6-6-6-6" stroke="#3F205F" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Signup Controllers */}
      <MbbSignupController open={openMbbFlow} onClose={() => setOpenMbbFlow(false)} />
      <NbnSignupController open={openNbnFlow} onClose={() => setOpenNbnFlow(false)} />
      <MobileVoiceSignupController open={openMobileFlow} onClose={() => setOpenMobileFlow(false)} />
    </AuthShell>
  );
}
