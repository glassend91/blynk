"use client";

import { useEffect, useState } from "react";
import { getAuthUser } from "@/lib/auth";

type AuthUser = {
  firstName?: string;
  lastName?: string;
  email?: string;
  role?: string;
  subrole?: string;
};

export default function Topbar({
  leftOffset,
  height = 89,
}: { leftOffset: number; height?: number }) {
  const [user, setUser] = useState<AuthUser | null>(null);

  useEffect(() => {
    const loadUser = () => {
      const u = getAuthUser<AuthUser>();
      setUser(u);
    };

    // Load user on mount
    loadUser();

    // Refresh permissions from server on mount
    const { refreshAuthUser } = require("@/lib/auth");
    refreshAuthUser().catch(() => { });

    // Listen for storage changes and custom refresh events
    const handleStorageChange = (e: StorageEvent | CustomEvent) => {
      if (e instanceof StorageEvent && e.key === 'auth_user') {
        loadUser();
      } else if (e instanceof CustomEvent && e.type === 'authUserRefreshed') {
        loadUser();
      }
    };

    window.addEventListener('storage', handleStorageChange as EventListener);
    window.addEventListener('authUserRefreshed', handleStorageChange as EventListener);

    // Also check periodically in case storage event doesn't fire (same tab)
    const interval = setInterval(() => {
      loadUser();
      refreshAuthUser().catch(() => { });
    }, 30000); // Refresh every 30 seconds

    return () => {
      window.removeEventListener('storage', handleStorageChange as EventListener);
      window.removeEventListener('authUserRefreshed', handleStorageChange as EventListener);
      clearInterval(interval);
    };
  }, []);

  const displayName =
    (user?.firstName || user?.lastName)
      ? [user.firstName, user.lastName].filter(Boolean).join(" ")
      : user?.email || "Admin User";

  const displayRole = user?.subrole || user?.role || "";

  const initials =
    (displayName || "")
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase())
      .join("") || "A";

  return (
    <header
      className="fixed top-0 z-40 w-full border-b border-[#DFDBE3] bg-white"
      style={{ left: leftOffset, height }}
    >
      <div className="flex h-full w-full max-w-[1111px] items-center justify-between px-[20px]">
        {/* Search */}
        <div className="flex w-[555px] items-center gap-[10px] rounded-[10px] border border-[#DFDBE3] bg-[#F8F8F8] p-4">
          <svg width="20" height="21" viewBox="0 0 20 21" fill="none" aria-hidden>
            <path d="M9.585 18c4.372 0 7.917-3.544 7.917-7.917S13.957 2.167 9.585 2.167 1.668 5.711 1.668 10.083 5.212 18 9.585 18Z" stroke="#292D32" strokeWidth="1.5" />
            <path d="m18.335 18.833-1.667-1.667" stroke="#292D32" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
          <input
            placeholder="Search customers, tickets, orders..."
            className="w-full bg-transparent text-[16px] leading-[28px] text-[#0A0A0A] placeholder-[#0A0A0A] outline-none"
          />
        </div>
        {/* Right controls: current user info */}
        <div className="flex items-center gap-[10px]">
          {/* <button className="grid h-[56px] w-[56px] place-items-center rounded-[10px] border border-[#DFDBE3] bg-[#F8F8F8]">
            <svg width="24" height="25" viewBox="0 0 24 25" fill="none" aria-hidden>
              <path d="M12.019 3.41c-3.31 0-6 2.69-6 6v2.89c0 .61-.26 1.54-.57 2.06l-1.15 1.91c-.71 1.18-.22 2.49 1.08 2.93 4.31 1.44 8.96 1.44 13.27 0 .74-.24 1.23-1.55.52-2.73l-1.15-1.91c-.3-.52-.56-1.45-.56-2.06V9.41c0-3.3-2.7-6-6-6Z" stroke="#292D32" strokeWidth="1.5" />
              <path d="M15.02 19.56c0 1.65-1.35 3-3 3s-3-1.35-3-3" stroke="#292D32" strokeWidth="1.5" />
            </svg>
          </button> */}
          {user ? (
            <div className="flex items-center gap-3 rounded-[10px] border border-[#DFDBE3] bg-[#F8F8F8] px-3 py-2">
              <div className="flex flex-col text-right">
                <span className="text-[14px] font-semibold text-[#0A0A0A]">
                  {displayName}
                </span>
                {displayRole && (
                  <span className="text-[12px] text-[#6F6C90]">
                    {displayRole}
                  </span>
                )}
              </div>
              <div className="grid h-[36px] w-[36px] place-items-center rounded-full bg-[#401B60] text-white text-[14px] font-semibold flex-shrink-0">
                {initials}
              </div>
            </div>
          ) : (
            <button className="w-[97px] rounded-[6px] bg-[#401B60] py-4 text-center text-[16px] font-semibold text-white">
              Login
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
