"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { clearAuthAll } from "@/lib/auth";

const TIMEOUT_MS = 30 * 60 * 1000; // 30 minutes

export default function InactivityTimeout() {
  const router = useRouter();
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const resetTimer = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    timerRef.current = setTimeout(logout, TIMEOUT_MS);
  };

  const logout = () => {
    console.log("Inactivity timeout reached. Logging out...");
    clearAuthAll();
    router.replace("/login?reason=timeout");
  };

  useEffect(() => {
    // Events to track for activity
    const events = [
      "mousedown",
      "mousemove",
      "keypress",
      "scroll",
      "touchstart",
    ];

    // Initialize timer
    resetTimer();

    // Add event listeners
    events.forEach((event) => {
      window.addEventListener(event, resetTimer);
    });

    // Cleanup
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
      events.forEach((event) => {
        window.removeEventListener(event, resetTimer);
      });
    };
  }, []);

  return null;
}
