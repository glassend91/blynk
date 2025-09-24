// components/auth/AuthCard.tsx
import { ReactNode } from "react";

export default function AuthCard({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-[900px] w-full bg-[#F8F8F8] flex items-center justify-center">
      <div className="w-[661px] rounded-[30px] bg-white shadow-[0_36px_137.5px_rgba(0,0,0,0.15)] p-[50px_30px]">
        {children}
      </div>
    </div>
  );
}
