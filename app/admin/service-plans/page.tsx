"use client";

import { useEffect, useMemo, useState } from "react";
import TableHeader from "./_local/components/TableHeader";
import PlansTable from "./_local/components/PlansTable";
import OverviewStats from "./_local/components/OverviewStats";
import CreatePlanModal from "./_local/components/CreatePlanModal";
import EditPlanModal from "./_local/components/EditPlanModal";
import type { PlanRow, PlanType } from "./_local/types";
import apiClient from "@/lib/apiClient";
import { usePermission } from "@/lib/permissions";

export default function ServicePlansPage() {
  const [query, setQuery] = useState("");
  const [type, setType] = useState<PlanType | "All Type">("All Type");
  const [rows, setRows] = useState<PlanRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [openCreate, setOpenCreate] = useState(false);
  const [editPlan, setEditPlan] = useState<PlanRow | null>(null);
  const [deletePlan, setDeletePlan] = useState<PlanRow | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [toggleLoading, setToggleLoading] = useState<string | null>(null);
  const canCreate = usePermission("plans.create");
  const canEdit = usePermission("plans.create");
  const canDelete = usePermission("plans.delete");

  useEffect(() => {
    let ignore = false;
    async function load() {
      try {
        setError(null);
        setLoading(true);
        const { data } = await apiClient.get<{
          success: boolean;
          services: PlanRow[];
        }>("/services/admin/list");
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

  // Lock body scroll when delete modal is open
  useEffect(() => {
    if (deletePlan) {
      const scrollY = window.scrollY;
      document.body.style.position = "fixed";
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = "100%";
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.position = "";
        document.body.style.top = "";
        document.body.style.width = "";
        document.body.style.overflow = "";
        window.scrollTo(0, scrollY);
      };
    }
  }, [deletePlan]);

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
    const nbn = rows.filter(
      (r) => r.type === "NBN" || r.type === "Business NBN",
    ).length;
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
          {canCreate && (
            <button
              onClick={() => setOpenCreate(true)}
              className="h-[40px] rounded-[8px] bg-[#401B60] px-4 text-[14px] font-semibold text-white hover:opacity-95"
            >
              Create Plan
            </button>
          )}
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
          <PlansTable
            rows={filtered}
            onEdit={canEdit ? (plan) => setEditPlan(plan) : undefined}
            onToggleActive={
              canEdit
                ? async (plan) => {
                    if (!plan.serviceId) return;
                    try {
                      setToggleLoading(plan.serviceId);
                      const newStatus =
                        plan.status === "Published" ? "Draft" : "Published";
                      const { data } = await apiClient.patch(
                        `/services/admin/${plan.serviceId}/active`,
                        {
                          isActive: newStatus === "Published",
                        },
                      );
                      // Update the row directly if response includes updated service
                      if (data?.success && data.service) {
                        setRows((prev) =>
                          prev.map((r) =>
                            r.serviceId === plan.serviceId
                              ? { ...data.service, id: r.id }
                              : r,
                          ),
                        );
                      } else {
                        // Fallback: reload all data
                        const listResponse = await apiClient.get<{
                          success: boolean;
                          services: PlanRow[];
                        }>("/services/admin/list");
                        if (
                          listResponse.data?.success &&
                          Array.isArray(listResponse.data.services)
                        ) {
                          setRows(listResponse.data.services);
                        }
                      }
                    } catch (err) {
                      console.error("Failed to toggle plan status", err);
                      setError(
                        "Failed to update plan status. Please try again.",
                      );
                    } finally {
                      setToggleLoading(null);
                    }
                  }
                : undefined
            }
            onDelete={canDelete ? (plan) => setDeletePlan(plan) : undefined}
          />
        )}
      </div>

      <OverviewStats {...stats} />

      {canCreate && (
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
      )}

      {canEdit && (
        <EditPlanModal
          open={!!editPlan}
          plan={editPlan}
          onClose={() => setEditPlan(null)}
          onUpdate={(updatedPlan) => {
            setRows((prev) =>
              prev.map((r) =>
                r.serviceId &&
                updatedPlan.serviceId &&
                r.serviceId === updatedPlan.serviceId
                  ? { ...updatedPlan, id: r.id }
                  : r,
              ),
            );
            setEditPlan(null);
          }}
        />
      )}

      {/* Delete confirmation modal */}
      {deletePlan && canDelete && (
        <div
          className="fixed z-40 flex items-center justify-center"
          style={{
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            margin: 0,
            padding: 0,
            width: "100vw",
            height: "100vh",
          }}
        >
          <div
            className="fixed bg-black/70"
            style={{
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              width: "100vw",
              height: "100vh",
              zIndex: 40,
            }}
            onClick={() => setDeletePlan(null)}
          />
          <div
            className="fixed w-full max-w-md rounded-[16px] bg-white p-6 shadow-xl"
            style={{
              left: "50%",
              top: "50%",
              transform: "translate(-50%, -50%)",
              zIndex: 41,
            }}
            onClick={(e) => e.stopPropagation()}
            onMouseDown={(e) => e.stopPropagation()}
          >
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-[18px] font-semibold text-[#0A0A0A]">
                Delete Service Plan
              </h2>
              <button
                type="button"
                onClick={() => setDeletePlan(null)}
                className="h-7 w-7 rounded-full border border-[#DFDBE3] text-[#6F6C90]"
              >
                ×
              </button>
            </div>
            <p className="text-[14px] text-[#6F6C90]">
              Are you sure you want to delete{" "}
              <span className="font-semibold text-[#0A0A0A]">
                {deletePlan.name}
              </span>
              ?
              {deletePlan.customers > 0 && (
                <span className="block mt-2 text-[13px] text-[#E0342F]">
                  Warning: This plan has {deletePlan.customers} active{" "}
                  {deletePlan.customers === 1 ? "customer" : "customers"}.
                  Deletion may affect active subscriptions.
                </span>
              )}
              This action cannot be undone.
            </p>
            <div className="mt-6 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setDeletePlan(null)}
                className="rounded-[10px] border border-[#DFDBE3] px-4 py-2 text-[14px] font-semibold text-[#6F6C90]"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={deleteLoading}
                onClick={async () => {
                  if (!deletePlan?.serviceId) {
                    setDeletePlan(null);
                    return;
                  }
                  try {
                    setDeleteLoading(true);
                    await apiClient.delete(
                      `/services/admin/${deletePlan.serviceId}`,
                    );
                    setRows((prev) =>
                      prev.filter((r) => r.serviceId !== deletePlan.serviceId),
                    );
                    setDeletePlan(null);
                  } catch (err: any) {
                    console.error("Failed to delete plan", err);
                    setError(
                      err?.response?.data?.message ||
                        "Failed to delete plan. Please try again.",
                    );
                    setDeletePlan(null);
                  } finally {
                    setDeleteLoading(false);
                  }
                }}
                className="rounded-[10px] bg-[#E0342F] px-4 py-2 text-[14px] font-semibold text-white disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {deleteLoading ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
