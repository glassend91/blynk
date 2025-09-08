import type { ReactNode } from "react";
import Sidebar from "@/components/admin/layout/Sidebar";
import Topbar from "@/components/admin/layout/Topbar";

const SIDEBAR_W = 234;
const TOPBAR_H = 80;

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-[#F8F8F8]">
      <Sidebar width={SIDEBAR_W} />
      <Topbar leftOffset={SIDEBAR_W} height={TOPBAR_H} />
      <main
        className="mx-auto  max-w-[1686px] p-[30px]"
        style={{ paddingTop: TOPBAR_H + 30, marginLeft: SIDEBAR_W }}
      >
        {children}
      </main>
    </div>
  );
}
