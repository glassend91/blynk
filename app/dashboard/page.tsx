"use client";

import React, { useEffect, useState } from "react";
import Panel from "../dashboard/Panel";
import Progress from "../dashboard/Progress";
import { Pill } from "../dashboard/Pill";
import { parseAndFormatDate, convertMonthNameToAU } from "@/lib/dateUtils";
import { getDashboardOverview } from "@/lib/services/dashboard";
import { useRouter } from "next/navigation";

export default function DashboardHome() {
  const [loading, setLoading] = useState(true);
  const [overview, setOverview] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setLoading(true);
        const resp = await getDashboardOverview();
        if (mounted) setOverview(resp?.data ?? null);
      } catch (err) {
        console.error("Failed to load dashboard overview", err);
        if (mounted) setOverview(null);
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Loading dashboard...</div>
      </div>
    );
  }

  const activeServices = overview?.activeServices || [];
  const mobileUsage = overview?.mobileUsage || [];
  const upcomingBills = overview?.upcomingBills || [];
  const recentTickets = overview?.recentTickets || [];
  const recentInvoices = overview?.recentInvoices || [];
  const quickActions = overview?.quickActions || [];

  return (
    <>
      <h1 className="mb-6 text-[26px] font-bold text-[#0A0A0A]">
        Overview of your services and account
      </h1>

      <div className="grid grid-cols-3 gap-6">
        {/* Active Services */}
        <Panel className="col-span-1 p-6">
          <div className="text-[18px] font-semibold text-[#0A0A0A]">
            Active Services
          </div>
          <div className="mt-4 space-y-4">
            {activeServices.length === 0 ? (
              <div className="text-gray-500">No active services found.</div>
            ) : (
              activeServices.map((s: any) => (
                <div
                  key={s.id}
                  className="rounded-[12px] border border-[#EEEAF4] bg-[#FAFAFD] px-4 py-3"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="grid h-8 w-8 place-items-center rounded-full bg-[#3F205F] text-white">
                        {s.serviceType && s.serviceType.includes("NBN") ? (
                          <svg
                            width="18"
                            height="18"
                            viewBox="0 0 24 24"
                            fill="none"
                          >
                            <path
                              d="M2 8.5C6.5 4.5 17.5 4.5 22 8.5M5 12c4-3 10-3 14 0M8.5 15.5c2-1.5 5-1.5 7 0"
                              stroke="white"
                              strokeWidth="1.6"
                              strokeLinecap="round"
                            />
                          </svg>
                        ) : (
                          <svg
                            width="16"
                            height="20"
                            viewBox="0 0 16 20"
                            fill="none"
                          >
                            <rect
                              x="3"
                              y="1.5"
                              width="10"
                              height="17"
                              rx="3"
                              stroke="white"
                              strokeWidth="1.8"
                            />
                            <circle cx="8" cy="15" r="1.4" fill="white" />
                          </svg>
                        )}
                      </span>
                      <div>
                        <div className="text-[15px] font-semibold text-[#0A0A0A]">
                          {s.serviceName}
                        </div>
                        <div className="text-[12px] text-[#6F6C90]">
                          {s.serviceType}
                        </div>
                      </div>
                    </div>
                    <Pill tone={s.status === "active" ? "green" : "grey"}>
                      {s.status}
                    </Pill>
                  </div>
                </div>
              ))
            )}
          </div>
        </Panel>

        {/* Mobile Data Usage */}
        <Panel className="col-span-1 p-6">
          <div className="text-[18px] font-semibold text-[#0A0A0A]">
            Mobile Data Usage
          </div>
          <div className="mt-6">
            {mobileUsage.length === 0 ? (
              <div className="text-gray-500">
                No mobile subscriptions found.
              </div>
            ) : (
              (() => {
                const m = mobileUsage[0];
                const used = m.totalUsed || 0;
                // try to parse allowance like '60GB' -> 60
                const allowanceStr = m.allowance || null;
                let allowance = 0;
                if (allowanceStr) {
                  const match = String(allowanceStr).match(/(\d+(?:\.\d+)?)/);
                  if (match) allowance = Number(match[1]);
                }
                return (
                  <>
                    <div className="mb-2 text-[14px] text-[#0A0A0A]">
                      {used}
                      {allowance ? `GB used` : ""}
                    </div>
                    <Progress
                      value={Math.min(used, allowance || used)}
                      max={allowance || Math.max(used, 1)}
                    />
                    {allowance ? (
                      <div className="mt-3 text-right text-[12px] text-[#6F6C90]">
                        {allowance}GB total
                      </div>
                    ) : null}
                    {m.lastUsageUpdate ? (
                      <div className="mt-3 text-[13px] text-[#6F6C90]">
                        Last update: {parseAndFormatDate(m.lastUsageUpdate)}
                      </div>
                    ) : null}
                  </>
                );
              })()
            )}
          </div>
        </Panel>

        {/* Upcoming Bills */}
        <Panel className="col-span-1 p-6">
          <div className="flex items-center justify-between">
            <div className="text-[18px] font-semibold text-[#0A0A0A]">
              Upcoming Bills
            </div>
            <button
              onClick={() => router.push("/dashboard/billing")}
              className="rounded-[10px] bg-[#3F205F] px-3 py-1.5 text-[12px] font-semibold text-white"
            >
              View All Bills
            </button>
          </div>
          <div className="mt-4 divide-y divide-[#EEEAF4]">
            {upcomingBills.length === 0 ? (
              <div className="py-4 text-gray-500">No upcoming bills</div>
            ) : (
              upcomingBills.map((b: any) => (
                <div
                  key={b._id || b.invoiceNumber}
                  className="flex items-center justify-between py-3"
                >
                  <div className="flex items-center gap-3">
                    <span className="grid h-8 w-8 place-items-center rounded-full bg-[#3F205F] text-white">
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                      >
                        <path
                          d="M7 2h10a2 2 0 0 1 2 2v18l-7-3-7 3V4a2 2 0 0 1 2-2Z"
                          stroke="white"
                          strokeWidth="1.6"
                        />
                      </svg>
                    </span>
                    <div>
                      <div className="text-[14px] font-semibold text-[#0A0A0A]">
                        {b.invoiceNumber || "Invoice"}
                      </div>
                      <div className="text-[12px] text-[#6F6C90]">
                        Due: {parseAndFormatDate(b.dueDate || b.due)}
                      </div>
                    </div>
                  </div>
                  <div className="text-[14px] font-semibold text-[#0A0A0A]">
                    {b.total ? `$${Number(b.total).toFixed(2)}` : "-"}
                  </div>
                </div>
              ))
            )}
          </div>
        </Panel>

        {/* Recent Support Tickets */}
        <Panel className="col-span-1 p-6">
          <div className="flex items-center justify-between">
            <div className="text-[18px] font-semibold text-[#0A0A0A]">
              Recent Support Tickets
            </div>
            <button
              onClick={() => router.push("/dashboard/tickets")}
              className="rounded-[10px] border border-[#D9D4E5] px-3 py-1.5 text-[12px] font-semibold text-[#3F205F]"
            >
              View All Tickets
            </button>
          </div>
          <div className="mt-4 space-y-3">
            {recentTickets.length === 0 ? (
              <div className="text-gray-500">No recent tickets</div>
            ) : (
              recentTickets.map((t: any) => (
                <TicketRow
                  key={t._id}
                  title={t.subject}
                  id={`#T-${t._id.slice(-4)} • ${parseAndFormatDate(t.createdAt)}`}
                  state={t.status === "Resolved" ? "Resolved" : "Open"}
                />
              ))
            )}
          </div>
        </Panel>

        {/* Recent Invoices */}
        <Panel className="col-span-1 p-6">
          <div className="flex items-center justify-between">
            <div className="text-[18px] font-semibold text-[#0A0A0A]">
              Recent Invoices
            </div>
            <button
              onClick={() => router.push("/dashboard/billing")}
              className="rounded-[10px] border border-[#D9D4E5] px-3 py-1.5 text-[12px] font-semibold text-[#3F205F]"
            >
              View All
            </button>
          </div>
          <div className="mt-4 space-y-3">
            {recentInvoices.length === 0 ? (
              <div className="text-gray-500">No invoices found</div>
            ) : (
              recentInvoices.map((inv: any) => (
                <InvoiceRow
                  key={inv._id}
                  date={parseAndFormatDate(inv.createdAt)}
                  label={inv.invoiceNumber || "Invoice"}
                  amount={`$${Number(inv.total || 0).toFixed(2)}`}
                />
              ))
            )}
          </div>
        </Panel>

        {/* Quick Actions */}
        <Panel className="col-span-1 p-6">
          <div className="text-[18px] font-semibold text-[#0A0A0A]">
            Quick Actions
          </div>
          <div className="mt-4 space-y-3">
            {quickActions.map((a: any) => (
              <button
                key={a.label}
                onClick={() => router.push(a.path)}
                className="flex w-full items-center gap-3 rounded-[12px] bg-[#F7F7FA] px-4 py-3 text-left text-[14px] font-semibold text-[#0A0A0A] hover:bg-[#EFEAF7]"
              >
                {a.label}
              </button>
            ))}
          </div>
        </Panel>
      </div>
    </>
  );
}

function TicketRow({
  title,
  id,
  state,
}: {
  title: string;
  id: string;
  state: "Open" | "Resolved";
}) {
  return (
    <div className="flex items-center justify-between rounded-[12px] border border-[#EEEAF4] bg-[#FAFAFD] px-4 py-3">
      <div>
        <div className="text-[14px] font-semibold text-[#0A0A0A]">{title}</div>
        <div className="text-[12px] text-[#6F6C90]">{id}</div>
      </div>
      <Pill tone={state === "Resolved" ? "green" : "purple"}>{state}</Pill>
    </div>
  );
}

function InvoiceRow({
  date,
  label,
  amount,
}: {
  date: string;
  label: string;
  amount: string;
}) {
  return (
    <div className="flex items-center justify-between rounded-[12px] border border-[#EEEAF4] bg-[#FAFAFD] px-4 py-3">
      <div>
        <div className="text-[14px] font-semibold text-[#0A0A0A]">{date}</div>
        <div className="text-[12px] text-[#6F6C90]">{label}</div>
      </div>
      <div className="flex items-center gap-3">
        <div className="text-[14px] font-semibold text-[#0A0A0A]">{amount}</div>
        <Pill tone="green">Paid</Pill>
      </div>
    </div>
  );
}
