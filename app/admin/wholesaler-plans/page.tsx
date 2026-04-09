"use client";

import { useEffect, useState } from "react";
import apiClient from "@/lib/apiClient";

export default function WholesalerPlansPage() {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [error, setError] = useState("");
  const [editPlan, setEditPlan] = useState<any>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [updateLoading, setUpdateLoading] = useState(false);
  const [createLoading, setCreateLoading] = useState(false);
  const [filterType, setFilterType] = useState("All");
  const [publishRadio, setPublishRadio] = useState<boolean>(false);

  // Prevent background scroll when modal is open
  useEffect(() => {
    if (editPlan || isCreateModalOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [editPlan, isCreateModalOpen]);

  const filteredPlans =
    filterType === "All"
      ? plans
      : plans.filter((p: any) => p.connection_type_name === filterType);

  const fetchPlans = async () => {
    try {
      setLoading(true);
      const { data } = await apiClient.get("/wholesaler-plans");
      if (data?.success) {
        setPlans(data.data);
      }
    } catch (err) {
      setError("Failed to fetch wholesaler plans");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlans();
  }, []);

  const handleSync = async () => {
    try {
      setSyncing(true);
      const { data } = await apiClient.post("/wholesaler-plans/sync");
      if (data?.success) {
        setPlans(data.data);
      }
    } catch (err) {
      alert("Failed to sync plans. Please try again.");
    } finally {
      setSyncing(false);
    }
  };

  const handleUpdate = async (e: any) => {
    e.preventDefault();
    if (!editPlan) return;
    try {
      setUpdateLoading(true);
      const features = e.target.features.value
        .split(/[\n,]/)
        .map((f: string) => f.trim())
        .filter(Boolean);
      const payload = {
        custom_name: e.target.custom_name.value,
        price: e.target.price.value ? Number(e.target.price.value) : null,
        speed: e.target.speed?.value || undefined,
        features,
        publish: publishRadio,
        visibilityStatus: publishRadio ? "public" : "internal",
      };
      const { data } = await apiClient.put(
        `/wholesaler-plans/${editPlan._id}`,
        payload,
      );
      if (data?.success) {
        setPlans((prev: any) =>
          prev.map((p: any) => (p._id === data.data._id ? data.data : p)),
        );
        setEditPlan(null);
      }
    } catch (err) {
      alert("Failed to update plan");
    } finally {
      setUpdateLoading(false);
    }
  };

  const handleCreate = async (e: any) => {
    e.preventDefault();
    try {
      setCreateLoading(true);
      const features = e.target.features.value
        .split(/[\n,]/)
        .map((f: string) => f.trim())
        .filter(Boolean);
      const payload = {
        label: e.target.label.value,
        bandwidth_id: e.target.bandwidth_id.value,
        speed: e.target.speed.value,
        type: "nbn",
        custom_name: e.target.custom_name.value || undefined,
        price: e.target.price.value ? Number(e.target.price.value) : null,
        features,
        publish: publishRadio,
        visibilityStatus: publishRadio ? "public" : "internal",
      };
      const { data } = await apiClient.post("/wholesaler-plans", payload);
      if (data?.success) {
        // If it created a retail plan too, we might want to refresh rows in the other page,
        // but for now just refresh lib list
        setPlans((prev: any) => [data.data, ...prev]);
        setIsCreateModalOpen(false);
      }
    } catch (err) {
      alert("Failed to create NBN plan");
    } finally {
      setCreateLoading(false);
    }
  };

  return (
    <section className="space-y-6">
      <header className="flex justify-between items-center">
        <div>
          <h1 className="text-[26px] font-bold leading-[28px] text-[#0A0A0A]">
            Wholesaler Plans
          </h1>
          <p className="text-[16px] leading-[21px] text-[#6F6C90] mt-1">
            Manage synced wholesaler plans
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => {
              setIsCreateModalOpen(true);
              setPublishRadio(false);
            }}
            className="h-[40px] rounded-[8px] border border-[#401B60] px-4 text-[14px] font-semibold text-[#401B60] hover:bg-[#401B60]/5"
          >
            Add Manual NBN Plan
          </button>
          <button
            onClick={handleSync}
            disabled={syncing}
            className="h-[40px] rounded-[8px] bg-[#401B60] px-4 text-[14px] font-semibold text-white hover:opacity-95 disabled:opacity-60"
          >
            {syncing ? "Syncing..." : "Sync Mobile Plans"}
          </button>
        </div>
      </header>

      <div className="rounded-[14px] border border-[#DFDBE3] bg-white p-5">
        <div className="mb-4 flex items-center justify-between">
          <div className="text-[16px] font-semibold text-[#0A0A0A]">
            Synced Plans
          </div>
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="rounded-[8px] border border-[#DFDBE3] px-3 py-2 text-[14px] outline-none focus:border-[#401B60] text-[#0A0A0A] bg-white"
          >
            <option value="All">All Connections</option>
            <option value="NBN">NBN (Manual)</option>
            <option value="Voice">Mobile Voice</option>
            <option value="Broadband">Mobile Broadband</option>
          </select>
        </div>

        {loading ? (
          <div className="p-6 text-center text-[#6F6C90]">Loading plans...</div>
        ) : error ? (
          <div className="p-6 text-center text-[#C53030]">{error}</div>
        ) : (
          <div className="overflow-x-auto rounded-[8px] border border-[#DFDBE3]">
            <table className="w-full text-left text-[14px]">
              <thead className="border-b border-[#DFDBE3] bg-[#F9FAFB] text-[#6F6C90]">
                <tr>
                  <th className="whitespace-nowrap px-4 py-3 font-semibold">
                    Wholesale ID
                  </th>
                  <th className="whitespace-nowrap px-4 py-3 font-semibold">
                    Base Plan Name
                  </th>
                  <th className="whitespace-nowrap px-4 py-3 font-semibold">
                    Speed
                  </th>
                  <th className="whitespace-nowrap px-4 py-3 font-semibold">
                    Custom Name
                  </th>
                  <th className="whitespace-nowrap px-4 py-3 font-semibold">
                    Status
                  </th>
                  <th className="whitespace-nowrap px-4 py-3 font-semibold">
                    Default Benefits
                  </th>
                  <th className="whitespace-nowrap px-4 py-3 font-semibold">
                    Retail Price
                  </th>
                  <th className="whitespace-nowrap px-4 py-3 font-semibold text-right">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#DFDBE3]">
                {filteredPlans.map((plan: any) => (
                  <tr key={plan._id} className="hover:bg-[#F9FAFB]">
                    <td className="px-4 py-4 text-[#0A0A0A] font-mono text-[12px]">
                      {plan.type === "nbn" ? plan.bandwidth_id : plan.value}
                    </td>
                    <td className="px-4 py-4">
                      <div className="text-[#0A0A0A] font-medium">
                        {plan.label}
                      </div>
                      <div className="text-[12px] text-[#6F6C90]">
                        {plan.connection_type_name}
                      </div>
                    </td>
                    <td className="px-4 py-4 text-[#6F6C90]">
                      {plan.speed || "-"}
                    </td>
                    <td className="px-4 py-4 text-[#6F6C90] font-medium">
                      {plan.custom_name || "-"}
                    </td>
                    <td className="px-4 py-4">
                      {plan.type === "nbn" ? (
                        plan.isPublish ? (
                          <span className="inline-flex items-center rounded-full bg-green-50 px-2 py-0.5 text-[11px] font-medium text-green-700 border border-green-200">
                            Published
                          </span>
                        ) : (
                          <span className="inline-flex items-center rounded-full bg-gray-50 px-2 py-0.5 text-[11px] font-medium text-gray-600 border border-gray-200">
                            CMS only
                          </span>
                        )
                      ) : (
                        <span className="text-[#6F6C90]">-</span>
                      )}
                    </td>
                    <td className="px-4 py-4 text-[#6F6C90] text-[12px]">
                      {plan.features
                        ? Array.isArray(plan.features)
                          ? plan.features.join(", ")
                          : plan.features
                        : "-"}
                    </td>
                    <td className="px-4 py-4 text-[#0A0A0A] font-bold">
                      {plan.price != null ? `$${plan.price}` : "-"}
                    </td>
                    <td className="px-4 py-4 text-right">
                      <button
                        onClick={() => {
                          setEditPlan(plan);
                          setPublishRadio(plan.isPublish || false);
                        }}
                        className="text-[#401B60] font-semibold hover:underline"
                      >
                        Edit
                      </button>
                    </td>
                  </tr>
                ))}
                {filteredPlans.length === 0 && (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-4 py-8 text-center text-[#6F6C90]"
                    >
                      No plans synced yet. Click "Sync Plans" to fetch them from
                      wholesaler.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {editPlan && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-[2px]"
            onClick={() => setEditPlan(null)}
          />
          <div className="relative w-full max-w-[550px] max-h-[90vh] flex flex-col bg-white rounded-[20px] shadow-xl overflow-hidden animate-in fade-in zoom-in duration-200">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-8 py-6 border-b border-[#DFDBE3] bg-white sticky top-0 z-10">
              <h3 className="text-[20px] font-bold text-[#010C15]">
                Edit Configuration
              </h3>
              <button
                onClick={() => setEditPlan(null)}
                className="text-[#6F6C90] hover:text-[#401B60] transition-colors"
              >
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>

            {/* Modal Body */}
            <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
              <form onSubmit={handleUpdate} className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-[14px] font-semibold text-[#010C15] mb-2">
                      Base Plan Name (Internal)
                    </label>
                    <input
                      type="text"
                      defaultValue={editPlan.label}
                      disabled
                      className="w-full rounded-[10px] border border-[#DFDBE3] bg-[#F8F9FA] px-[18px] py-[13px] text-[15px] text-[#6F6C90]"
                    />
                  </div>
                  <div
                    className={`grid gap-4 ${editPlan.type === "nbn" ? "grid-cols-2" : "grid-cols-1"}`}
                  >
                    <div>
                      <label className="block text-[14px] font-semibold text-[#010C15] mb-2">
                        {editPlan.type === "nbn"
                          ? "Bandwidth ID"
                          : "Wholesale ID"}
                      </label>
                      <input
                        type="text"
                        defaultValue={
                          editPlan.bandwidth_id || editPlan.value || "-"
                        }
                        disabled
                        className="w-full rounded-[10px] border border-[#DFDBE3] bg-[#F8F9FA] px-[18px] py-[13px] text-[15px] text-[#6F6C90]"
                      />
                    </div>
                    {editPlan.type === "nbn" && (
                      <div>
                        <label className="block text-[14px] font-semibold text-[#010C15] mb-2">
                          Speed Profile
                        </label>
                        <input
                          type="text"
                          name="speed"
                          defaultValue={editPlan.speed || ""}
                          className="w-full rounded-[10px] border border-[#DFDBE3] px-[18px] py-[13px] text-[15px] outline-none focus:border-[#401B60]"
                        />
                      </div>
                    )}
                  </div>

                  <div className="border-t pt-2" />

                  <div>
                    <label className="block text-[14px] font-semibold text-[#010C15] mb-2">
                      {editPlan.type === "nbn"
                        ? "Default Website Name"
                        : "Custom Front-End Name"}
                    </label>
                    <input
                      type="text"
                      name="custom_name"
                      defaultValue={editPlan.custom_name || ""}
                      placeholder={
                        editPlan.type === "nbn"
                          ? "e.g. Home Fast 100"
                          : "Enter custom name"
                      }
                      className="w-full rounded-[10px] border border-[#DFDBE3] px-[18px] py-[13px] text-[15px] outline-none focus:border-[#401B60]"
                    />
                    {editPlan.type !== "nbn" && (
                      <p className="text-[12px] text-[#6F6C90] mt-1 text-right">
                        Leave blank to use Original Name
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-[14px] font-semibold text-[#010C15] mb-2">
                      {editPlan.type === "nbn"
                        ? "Default Retail Price ($)"
                        : "Retail Price ($)"}
                    </label>
                    <input
                      type="number"
                      name="price"
                      step="0.01"
                      defaultValue={editPlan.price || ""}
                      placeholder="e.g. 79.00"
                      className="w-full rounded-[10px] border border-[#DFDBE3] px-[18px] py-[13px] text-[15px] outline-none focus:border-[#401B60]"
                    />
                  </div>
                  {editPlan.type === "nbn" && (
                    <div>
                      <label className="block text-[14px] font-semibold text-[#010C15] mb-2">
                        Key Benefits (Optional Default)
                      </label>
                      <textarea
                        name="features"
                        defaultValue={
                          Array.isArray(editPlan.features)
                            ? editPlan.features.join("\n")
                            : ""
                        }
                        placeholder="e.g. Unlimited Data, No Lock-in"
                        className="w-full rounded-[10px] border border-[#DFDBE3] px-[18px] py-[13px] text-[15px] outline-none focus:border-[#401B60]"
                        rows={2}
                      />
                    </div>
                  )}

                  {editPlan.type === "nbn" && (
                    <div className="space-y-3 pt-2">
                      <label className="block text-[14px] font-semibold text-[#010C15]">
                        Publishing Status
                      </label>
                      <div className="flex gap-6">
                        <label className="flex items-center gap-2 cursor-pointer group">
                          <input
                            type="radio"
                            name="publishStatus"
                            checked={!publishRadio}
                            onChange={() => setPublishRadio(false)}
                            className="w-4 h-4 accent-[#401B60]"
                          />
                          <span className="text-[14px] text-[#0A0A0A] group-hover:text-[#401B60]">
                            CMS Only
                          </span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer group">
                          <input
                            type="radio"
                            name="publishStatus"
                            checked={publishRadio}
                            onChange={() => setPublishRadio(true)}
                            className="w-4 h-4 accent-[#401B60]"
                          />
                          <span className="text-[14px] text-[#0A0A0A] group-hover:text-[#401B60]">
                            Publish to Website
                          </span>
                        </label>
                      </div>
                    </div>
                  )}
                </div>

                <div className="mt-8 flex justify-end gap-3 pt-6 border-t border-[#DFDBE3] sticky bottom-0 bg-white">
                  <button
                    type="button"
                    onClick={() => setEditPlan(null)}
                    className="rounded-[10px] border border-[#DFDBE3] px-6 py-[12px] text-[14px] font-semibold text-[#6F6C90] hover:bg-[#F8F9FA]"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={updateLoading}
                    className="rounded-[10px] bg-[#401B60] px-8 py-[12px] text-[14px] font-semibold text-white hover:opacity-90 disabled:opacity-60 shadow-md shadow-[#401B60]/20"
                  >
                    {updateLoading ? "Updating..." : "Update Configuration"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {isCreateModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-[2px]"
            onClick={() => setIsCreateModalOpen(false)}
          />
          <div className="relative w-full max-w-[550px] max-h-[90vh] flex flex-col bg-white rounded-[20px] shadow-xl overflow-hidden animate-in fade-in zoom-in duration-200">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-8 py-6 border-b border-[#DFDBE3] bg-white sticky top-0 z-10">
              <h3 className="text-[20px] font-bold text-[#010C15]">
                Add Manual NBN Plan
              </h3>
              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="text-[#6F6C90] hover:text-[#401B60] transition-colors"
              >
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>

            {/* Modal Body */}
            <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
              <form onSubmit={handleCreate} className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-[14px] font-semibold text-[#010C15] mb-2">
                      Base Plan Name (Internal)
                    </label>
                    <input
                      type="text"
                      name="label"
                      required
                      placeholder="e.g. NBN Home Fast 100"
                      className="w-full rounded-[10px] border border-[#DFDBE3] px-[18px] py-[13px] text-[15px] outline-none focus:border-[#401B60]"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[14px] font-semibold text-[#010C15] mb-2">
                        Bandwidth ID
                      </label>
                      <input
                        type="text"
                        name="bandwidth_id"
                        required
                        placeholder="e.g. id_3"
                        className="w-full rounded-[10px] border border-[#DFDBE3] px-[18px] py-[13px] text-[15px] outline-none focus:border-[#401B60]"
                      />
                    </div>
                    <div>
                      <label className="block text-[14px] font-semibold text-[#010C15] mb-2">
                        Speed Profile
                      </label>
                      <input
                        type="text"
                        name="speed"
                        required
                        placeholder="e.g. 100/20"
                        className="w-full rounded-[10px] border border-[#DFDBE3] px-[18px] py-[13px] text-[15px] outline-none focus:border-[#401B60]"
                      />
                    </div>
                  </div>

                  <div className="border-t pt-2" />

                  <div>
                    <label className="block text-[14px] font-semibold text-[#010C15] mb-2">
                      Default Website Name
                    </label>
                    <input
                      type="text"
                      name="custom_name"
                      placeholder="e.g. Home Fast 100"
                      className="w-full rounded-[10px] border border-[#DFDBE3] px-[18px] py-[13px] text-[15px] outline-none focus:border-[#401B60]"
                    />
                  </div>
                  <div>
                    <label className="block text-[14px] font-semibold text-[#010C15] mb-2">
                      Default Retail Price ($)
                    </label>
                    <input
                      type="number"
                      name="price"
                      step="0.01"
                      placeholder="e.g. 79.00"
                      className="w-full rounded-[10px] border border-[#DFDBE3] px-[18px] py-[13px] text-[15px] outline-none focus:border-[#401B60]"
                    />
                  </div>
                  <div>
                    <label className="block text-[14px] font-semibold text-[#010C15] mb-2">
                      Default Key Benefits
                    </label>
                    <textarea
                      name="features"
                      placeholder="e.g. Unlimited Data, No Lock-in"
                      className="w-full rounded-[10px] border border-[#DFDBE3] px-[18px] py-[13px] text-[15px] outline-none focus:border-[#401B60]"
                      rows={2}
                    />
                  </div>

                  <div className="space-y-3 pt-2">
                    <label className="block text-[14px] font-semibold text-[#010C15]">
                      Publishing Status
                    </label>
                    <div className="flex gap-6">
                      <label className="flex items-center gap-2 cursor-pointer group">
                        <input
                          type="radio"
                          name="publishStatus"
                          checked={!publishRadio}
                          onChange={() => setPublishRadio(false)}
                          className="w-4 h-4 accent-[#401B60]"
                        />
                        <span className="text-[14px] text-[#0A0A0A] group-hover:text-[#401B60]">
                          CMS Only
                        </span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer group">
                        <input
                          type="radio"
                          name="publishStatus"
                          checked={publishRadio}
                          onChange={() => setPublishRadio(true)}
                          className="w-4 h-4 accent-[#401B60]"
                        />
                        <span className="text-[14px] text-[#0A0A0A] group-hover:text-[#401B60]">
                          Publish to Website
                        </span>
                      </label>
                    </div>
                  </div>
                </div>

                <div className="mt-8 flex justify-end gap-3 pt-6 border-t border-[#DFDBE3] sticky bottom-0 bg-white">
                  <button
                    type="button"
                    onClick={() => setIsCreateModalOpen(false)}
                    className="rounded-[10px] border border-[#DFDBE3] px-6 py-[12px] text-[14px] font-semibold text-[#6F6C90] hover:bg-[#F8F9FA]"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={createLoading}
                    className="rounded-[10px] bg-[#401B60] px-8 py-[12px] text-[14px] font-semibold text-white hover:opacity-90 disabled:opacity-60 shadow-md shadow-[#401B60]/20"
                  >
                    {createLoading ? "Creating..." : "Create Plan"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
