"use client";

// Client helpers for token & user storage via localStorage

const TOKEN_KEY = "auth_token";
const USER_KEY = "auth_user";

export function setAuthToken(token: string) {
  if (typeof window !== "undefined") {
    localStorage.setItem(TOKEN_KEY, token);
  }
}

export function getAuthToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(TOKEN_KEY);
}

export function setAuthUser(user: unknown) {
  console.log("setAuthUser", user);
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem(USER_KEY, JSON.stringify(user));
    } catch {}
  }
}

export function getAuthUser<T = unknown>(): T | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem(USER_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

export function clearAuthToken() {
  if (typeof window !== "undefined") {
    localStorage.removeItem(TOKEN_KEY);
  }
}

export function clearAuthUser() {
  if (typeof window !== "undefined") {
    localStorage.removeItem(USER_KEY);
  }
}

export function clearAuthAll() {
  clearAuthToken();
  clearAuthUser();
}

/**
 * Refresh user data from server (useful when permissions are updated)
 */
export async function refreshAuthUser(): Promise<void> {
  if (typeof window === "undefined") return;

  try {
    const { getCurrentUser } = await import("./services/auth");
    const response = await getCurrentUser();
    if (response?.user) {
      setAuthUser(response.user);
      // Dispatch custom event to notify components of permission update
      window.dispatchEvent(
        new CustomEvent("authUserRefreshed", { detail: response.user }),
      );
      // Also trigger storage event for cross-tab sync
      window.dispatchEvent(
        new StorageEvent("storage", {
          key: USER_KEY,
          newValue: JSON.stringify(response.user),
          storageArea: localStorage,
        }),
      );
    }
  } catch (error) {
    console.error("Failed to refresh user data:", error);
  }
}
