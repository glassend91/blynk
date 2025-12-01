'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import KpiCard from '@/components/admin/KpiCard';
import RecentActivity from '@/components/admin/DashboardRecentActivity';
import PendingTasks from '@/components/admin/DashboardPendingTasks';
import QuickActions from '@/components/admin/DashboardQuickActions';
import apiClient from '@/lib/apiClient';
import { usePermission, canAccessRoute } from '@/lib/permissions';

type Trend = 'up' | 'down';

type KpiItem = {
  title: string;
  value: number;
  delta: string;
  trend: Trend;
  icon: 'user' | 'box' | 'card' | 'headset';
};

type ActivityItem = {
  title: string;
  by: string;
  time: string;
};

type DashboardResponse = {
  kpi: KpiItem[];
  activity: ActivityItem[];
  tasks: string[];
  actions: { label: string; icon: 'user' | 'box' | 'profile' | 'sim' }[];
};

export default function DashboardPage() {
  const router = useRouter();
  const [data, setData] = useState<DashboardResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const canViewAnalytics = usePermission('analytics.view');
  const [ready, setReady] = useState(false);

  // Check permission and redirect if needed
  useEffect(() => {
    const checkAccess = () => {
      const hasAccess = canAccessRoute('/admin/dashboard');
      if (!hasAccess) {
        // Try to find an accessible page, otherwise stay and show error
        const accessibleRoutes = [
          '/admin/user-management',
          '/admin/service-plans',
          '/admin/website-content',
        ];
        const accessibleRoute = accessibleRoutes.find(route => canAccessRoute(route));
        if (accessibleRoute) {
          router.replace(accessibleRoute);
          return;
        }
        // If no accessible route found, show access denied message
        setReady(true);
        return;
      }
      setReady(true);
    };
    checkAccess();
  }, [router]);

  useEffect(() => {
    if (!ready || !canViewAnalytics) return;
    const fetchDashboard = async () => {
      try {
        setLoading(true);
        setError(null);
        const { data } = await apiClient.get<{ success: boolean; data: DashboardResponse }>('/dashboard');
        if (data?.success && data.data) {
          setData(data.data);
        } else {
          setError('Failed to load dashboard data');
        }
      } catch (err: any) {
        setError(err?.message || 'Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, [ready, canViewAnalytics]);

  const kpis = data?.kpi ?? [];
  const activity = data?.activity ?? [];
  const tasks = data?.tasks ?? [];
  const actions = data?.actions ?? [];

  // Show loading while checking permissions
  if (!ready) {
    return (
      <section>
        <div className="flex h-[400px] items-center justify-center">
          <div className="text-center">
            <div className="mb-4 inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-[#401B60] border-r-transparent"></div>
            <p className="text-[14px] text-[#6F6C90]">Checking permissions...</p>
          </div>
        </div>
      </section>
    );
  }

  // Show access denied if no permission
  if (!canViewAnalytics) {
    return (
      <section>
        <div className="mx-auto space-y-[30px]">
          <header className="space-y-[6px]">
            <h1 className="text-[26px] leading-[28px] font-bold text-[#0A0A0A]">Dashboard</h1>
            <p className="text-[16px] leading-[21px] text-[#6F6C90]">
              Welcome back! Here's what's happening with your telecommunications business.
            </p>
          </header>
          <div className="rounded-[10px] border border-[#FCD1D2] bg-[#FFF5F5] px-4 py-3 text-[13px] text-[#C53030]">
            You do not have permission to view the dashboard. Please contact your administrator.
          </div>
        </div>
      </section>
    );
  }

  return (
    <section>
      <div className="mx-auto space-y-[30px]">
        <header className="space-y-[6px]">
          <h1 className="text-[26px] leading-[28px] font-bold text-[#0A0A0A]">Dashboard</h1>
          <p className="text-[16px] leading-[21px] text-[#6F6C90]">
            Welcome back! Here's what's happening with your telecommunications business.
          </p>
        </header>

        {error && (
          <div className="rounded-[10px] border border-[#FCD1D2] bg-[#FFF5F5] px-4 py-3 text-[13px] text-[#C53030]">
            {error}
          </div>
        )}

        {loading && !data ? (
          <div className="rounded-[12.75px] border border-[#DFDBE3] bg-white p-6 text-[14px] text-[#6F6C90]">
            Loading dashboard...
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 gap-[30px] md:grid-cols-2 xl:grid-cols-4">
              {kpis.map((k) => (
                <KpiCard key={k.title} {...k} />
              ))}
            </div>

            <div className="grid gap-[30px] xl:grid-cols-2">
              <div className="xl:col-span-1">
                <RecentActivity items={activity} />
              </div>
              <PendingTasks items={tasks} />
            </div>

            <QuickActions actions={actions} />
          </>
        )}
      </div>
    </section>
  );
}
