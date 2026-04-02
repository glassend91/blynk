"use client";

import { useEffect, useState } from "react";
import apiClient from "@/lib/apiClient";

export default function WholesalerPlansPage() {
    const [plans, setPlans] = useState([]);
    const [loading, setLoading] = useState(true);
    const [syncing, setSyncing] = useState(false);
    const [error, setError] = useState("");
    const [editPlan, setEditPlan] = useState<any>(null);
    const [updateLoading, setUpdateLoading] = useState(false);
    const [filterType, setFilterType] = useState("All");

    const filteredPlans = filterType === "All"
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
            const payload = {
                custom_name: e.target.custom_name.value,
                price: e.target.price.value ? Number(e.target.price.value) : null
            };
            const { data } = await apiClient.put(`/wholesaler-plans/${editPlan._id}`, payload);
            if (data?.success) {
                setPlans((prev: any) => prev.map((p: any) => p._id === data.data._id ? data.data : p));
                setEditPlan(null);
            }
        } catch (err) {
            alert("Failed to update plan");
        } finally {
            setUpdateLoading(false);
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
                <button
                    onClick={handleSync}
                    disabled={syncing}
                    className="h-[40px] rounded-[8px] bg-[#401B60] px-4 text-[14px] font-semibold text-white hover:opacity-95 disabled:opacity-60"
                >
                    {syncing ? "Syncing..." : "Sync Plans"}
                </button>
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
                        <option value="Voice">Voice</option>
                        <option value="Broadband">Broadband</option>
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
                                    <th className="whitespace-nowrap px-4 py-3 font-semibold">ID</th>
                                    <th className="whitespace-nowrap px-4 py-3 font-semibold">Original Name</th>
                                    <th className="whitespace-nowrap px-4 py-3 font-semibold">Custom Name</th>
                                    <th className="whitespace-nowrap px-4 py-3 font-semibold">Type</th>
                                    <th className="whitespace-nowrap px-4 py-3 font-semibold">Price</th>
                                    <th className="whitespace-nowrap px-4 py-3 font-semibold text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[#DFDBE3]">
                                {filteredPlans.map((plan: any) => (
                                    <tr key={plan._id} className="hover:bg-[#F9FAFB]">
                                        <td className="px-4 py-4 text-[#0A0A0A]">{plan.value}</td>
                                        <td className="px-4 py-4 text-[#0A0A0A] font-medium">{plan.label}</td>
                                        <td className="px-4 py-4 text-[#6F6C90]">{plan.custom_name || "-"}</td>
                                        <td className="px-4 py-4 text-[#6F6C90]">{plan.connection_type_name}</td>
                                        <td className="px-4 py-4 text-[#0A0A0A] font-medium">
                                            {plan.price != null ? `$${plan.price}` : "-"}
                                        </td>
                                        <td className="px-4 py-4 text-right">
                                            <button
                                                onClick={() => setEditPlan(plan)}
                                                className="text-[#401B60] font-semibold hover:underline"
                                            >
                                                Edit
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                                {filteredPlans.length === 0 && (
                                    <tr>
                                        <td colSpan={6} className="px-4 py-8 text-center text-[#6F6C90]">
                                            No plans synced yet. Click "Sync Plans" to fetch them from wholesaler.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {editPlan && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 overflow-y-auto pt-10 pb-10">
                    <div className="w-full max-w-md rounded-[16px] bg-white p-6 shadow-xl relative m-auto">
                        <h2 className="text-[18px] font-semibold text-[#0A0A0A] mb-4">Edit Configuration</h2>
                        <form onSubmit={handleUpdate} className="space-y-4">
                            <div>
                                <label className="block text-[14px] font-semibold text-[#010C15] mb-2">Original Name</label>
                                <div className="w-full rounded-[10px] border border-[#DFDBE3] bg-[#F5F4F8] px-[18px] py-[13px] text-[14px] text-[#6F6C90]">
                                    {editPlan.label}
                                </div>
                            </div>
                            <div>
                                <label className="block text-[14px] font-semibold text-[#010C15] mb-2">Custom Front-End Name</label>
                                <input
                                    type="text"
                                    name="custom_name"
                                    defaultValue={editPlan.custom_name || ""}
                                    placeholder="Enter custom name"
                                    className="w-full rounded-[10px] border border-[#DFDBE3] px-[18px] py-[13px] text-[15px] outline-none focus:border-[#401B60]"
                                />
                                <p className="text-[12px] text-[#6F6C90] mt-1 text-right">Leave blank to use Original Name</p>
                            </div>
                            <div>
                                <label className="block text-[14px] font-semibold text-[#010C15] mb-2">Retail Price ($)</label>
                                <input
                                    type="number"
                                    name="price"
                                    step="0.01"
                                    defaultValue={editPlan.price || ""}
                                    placeholder="Enter retail price"
                                    className="w-full rounded-[10px] border border-[#DFDBE3] px-[18px] py-[13px] text-[15px] outline-none focus:border-[#401B60]"
                                />
                            </div>
                            <div className="mt-6 flex justify-end gap-3 pt-2 border-t border-[#DFDBE3]">
                                <button
                                    type="button"
                                    onClick={() => setEditPlan(null)}
                                    className="rounded-[10px] border border-[#DFDBE3] px-4 py-2 text-[14px] font-semibold text-[#6F6C90]"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={updateLoading}
                                    className="rounded-[10px] bg-[#401B60] px-6 py-2 text-[14px] font-semibold text-white disabled:opacity-60"
                                >
                                    {updateLoading ? "Saving..." : "Save Configuration"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </section>
    );
}
