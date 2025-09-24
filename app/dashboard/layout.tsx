import Sidebar from "../dashboard/Sidebar";
import AuthAvatar from "../dashboard/AuthAvatar";
import AuthGuard from "@/components/auth/AuthGuard";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen w-full bg-[#F7F7FA]">
      <div className="flex">
        <Sidebar />
        <main className="min-h-screen flex-1">
          {/* top bar */}
          <div className="flex items-center justify-between border-b border-[#EEEAF4] bg-white px-8 py-4">
            <div className="text-[22px] font-bold text-[#0A0A0A]">
              <h1 className="mb-6 text-[26px] font-bold text-[#0A0A0A]">Dashboard</h1>
              {/* Each page sets its own <h1>, so this spacer keeps height consistent */}
            </div>
            <AuthAvatar />
          </div>
          <div className="px-8 py-6">
            <AuthGuard>{children}</AuthGuard>
          </div>
        </main>
      </div>
    </div>
  );
}
