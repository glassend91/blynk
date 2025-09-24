"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";

export default function AuthGuard({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const pathname = usePathname();
    const [ready, setReady] = useState(false);

    useEffect(() => {
        const token = typeof window !== "undefined" ? localStorage.getItem("auth_token") : null;
        if (!token) {
            const to = `/login?redirect=${encodeURIComponent(pathname || "/")}`;
            router.replace(to);
            return;
        }
        setReady(true);
    }, [pathname, router]);

    if (!ready) return null;
    return <>{children}</>;
}


