import { KPI, ACTIVITY, TASKS, ACTIONS } from "./data";
import KpiCard from "@/components/admin/KpiCard";
import RecentActivity from "@/components/admin/DashboardRecentActivity";
import PendingTasks from "@/components/admin/DashboardPendingTasks";
import QuickActions from "@/components/admin/DashboardQuickActions";

export const dynamic = "force-dynamic";

export default function DashboardPage() {
  return (
    <section>
      <div className="mx-auto  space-y-[30px]">
        <header className="space-y-[6px]">
          <h1 className="text-[26px] leading-[28px] font-bold text-[#0A0A0A]">Dashboard</h1>
          <p className="text-[16px] leading-[21px] text-[#6F6C90]">
            Welcome back! Here’s what’s happening with your telecommunications business.
          </p>
        </header>

        <div className="grid grid-cols-1 gap-[30px] md:grid-cols-2 xl:grid-cols-4">
          {KPI.map((k) => (
            <KpiCard key={k.title} {...k} />
          ))}
        </div>

        <div className="grid gap-[30px] xl:grid-cols-2">
          <div className="xl:col-span-1">
            <RecentActivity items={ACTIVITY} />
          </div>
          <PendingTasks items={TASKS} />
        </div>

        <QuickActions actions={ACTIONS} />
      </div>
    </section>
  );
}
