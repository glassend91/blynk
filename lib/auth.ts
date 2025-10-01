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
    if (typeof window !== "undefined") {
        try { localStorage.setItem(USER_KEY, JSON.stringify(user)); } catch { }
    }
}

export function getAuthUser<T = unknown>(): T | null {
    if (typeof window === "undefined") return null;
    const raw = localStorage.getItem(USER_KEY);
    if (!raw) return null;
    try { return JSON.parse(raw) as T; } catch { return null; }
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


