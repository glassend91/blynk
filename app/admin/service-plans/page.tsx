"use client";

import { useEffect, useMemo, useState } from "react";
import TableHeader from "./_local/components/TableHeader";
import PlansTable from "./_local/components/PlansTable";
import OverviewStats from "./_local/components/OverviewStats";
import CreatePlanModal from "./_local/components/CreatePlanModal";
import type { PlanRow, PlanType } from "./_local/types";
import apiClient from "@/lib/apiClient";

export default function ServicePlansPage() {
  const [query, setQuery] = useState("");
  const [type, setType] = useState<PlanType | "All Type">("All Type");
  const [rows, setRows] = useState<PlanRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [openCreate, setOpenCreate] = useState(false);

  useEffect(() => {
    let ignore = false;
    async function load() {
      try {
        setError(null);
        setLoading(true);
        const { data } = await apiClient.get<{ success: boolean; services: PlanRow[] }>("/services/admin/list");
        if (ignore) return;
        if (data?.success && Array.isArray(data.services)) {
          setRows(data.services);
        } else {
          setRows([]);
        }
      } catch (err) {
        if (!ignore) {
          setError("Failed to load service plans. Please try again.");
          setRows([]);
        }
      } finally {
        if (!ignore) setLoading(false);
      }
    }
    load();
    return () => {
      ignore = true;
    };
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return rows.filter((r) => {
      const byQ =
        !q ||
        r.name.toLowerCase().includes(q) ||
        r.details.toLowerCase().includes(q);
      const byType = type === "All Type" || r.type === type;
      return byQ && byType;
    });
  }, [rows, query, type]);

  const stats = useMemo(() => {
    const total = rows.length;
    const published = rows.filter((r) => r.status === "Published").length;
    const nbn = rows.filter((r) => r.type === "NBN").length;
    const mobile = rows.filter((r) => r.type === "Mobile").length;
    return { total, published, nbn, mobile };
  }, [rows]);

  return (
    <section className="space-y-6">
      <header className="space-y-1">
        <h1 className="text-[26px] font-bold leading-[28px] text-[#0A0A0A]">
          Service Plans
        </h1>
        <p className="text-[16px] leading-[21px] text-[#6F6C90]">
          Manage NBN and Mobile service plans
        </p>
      </header>

      <div className="rounded-[14px] border border-[#DFDBE3] bg-white p-5">
        <div className="mb-4 flex items-center justify-between">
          <div className="text-[16px] font-semibold text-[#0A0A0A]">
            Service Plans
          </div>
          <button
            onClick={() => setOpenCreate(true)}
            className="h-[40px] rounded-[8px] bg-[#401B60] px-4 text-[14px] font-semibold text-white"
          >
            Create Plan
          </button>
        </div>

        <TableHeader
          query={query}
          onQuery={setQuery}
          type={type}
          onType={setType}
        />

        {loading ? (
          <div className="rounded-[12px] border border-dashed border-[#E7E4EC] bg-[#FBFBFD] p-6 text-[14px] text-[#6F6C90]">
            Loading service plans...
          </div>
        ) : error ? (
          <div className="rounded-[12px] border border-[#FCD1D2] bg-[#FFF5F5] p-6 text-[14px] text-[#C53030]">
            {error}
          </div>
        ) : (
          <PlansTable rows={filtered} />
        )}
      </div>

      <OverviewStats {...stats} />

      <CreatePlanModal
        open={openCreate}
        onClose={() => setOpenCreate(false)}
        onCreate={(createdPlan) => {
          setRows((prev) => {
            const next = [createdPlan, ...prev];
            return next.map((row, index) => ({ ...row, id: index + 1 }));
          });
          setOpenCreate(false);
        }}
      />
    </section>
  );
}
