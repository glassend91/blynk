"use client";

import { useEffect, useState } from "react";
import { getAuthUser } from "@/lib/auth";

type AuthUser = {
  firstName?: string;
  lastName?: string;
  email?: string;
};

export default function AuthAvatar() {
  const [user, setUser] = useState<AuthUser | null>(null);

  useEffect(() => {
    const u = getAuthUser<AuthUser>();
    setUser(u);
  }, []);

  const fullName = user?.firstName || user?.lastName
    ? [user?.firstName, user?.lastName].filter(Boolean).join(" ")
    : undefined;
  const email = user?.email;
  const initials = (() => {
    if (user?.firstName || user?.lastName) {
      const parts = [user?.firstName, user?.lastName].filter(Boolean) as string[];
      return parts.map(p => p.trim()[0]?.toUpperCase() || "").join("").slice(0, 2) || "U";
    }
    if (email) return email[0]?.toUpperCase() || "U";
    return "U";
  })();

  return (
    <div className="flex items-center gap-3">
      <div className="grid h-9 w-9 place-items-center rounded-full bg-[#3F205F] text-white text-sm font-semibold">
        {initials}
      </div>
      <div className="leading-tight">
        <div className="text-[14px] font-semibold text-[#0A0A0A]">{fullName || email || "User"}</div>
        {email ? <div className="text-[12px] text-[#6F6C90]">{email}</div> : null}
      </div>
    </div>
  );
}
