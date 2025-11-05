"use client";

import { useEffect, useState } from "react";
import Panel from "../Panel";
import Progress from "../Progress";
import apiClient from "@/lib/apiClient";

interface PackageData {
  _id: string;
  packageId: {
    _id: string;
    planTitle: string;
    planType: string;
    associatedNumber: string;
    totalData: number;
    resetDate: string;
    price: number;
    currency: string;
    description: string;
    features: string[];
  };
  usedData: number;
  status: string;
  validFrom: string;
  validUntil: string;
}

interface UserData {
  user: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    selectedPackages: PackageData[];
  };
  selectedPackages: PackageData[];
}

interface AvailablePlan {
  _id: string;
  planTitle: string;
  planType: string;
  associatedNumber: string;
  totalData: number;
  price: number;
  currency: string;
  description: string;
  features: string[];
  validityDays: number;
  isAvailable: boolean;
}

export default function DataUsage() {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [availablePlans, setAvailablePlans] = useState<AvailablePlan[]>([]);
  const [loadingPlans, setLoadingPlans] = useState(false);
  const [selectedPlanId, setSelectedPlanId] = useState<string | null>(null);

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get("/auth/me");
      setUserData(response.data);
      setError(null);
    } catch (err: any) {
      setError(err.message || "Failed to fetch user data");
      console.error("Error fetching user data:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchAvailablePlans = async () => {
    try {
      setLoadingPlans(true);
      const response = await apiClient.get("/packages/available");
      setAvailablePlans(response.data.data || []);
    } catch (err: any) {
      console.error("Error fetching available plans:", err);
      alert("Failed to load available plans. Please try again.");
    } finally {
      setLoadingPlans(false);
    }
  };

  const handleBuyPlanClick = () => {
    setShowModal(true);
    fetchAvailablePlans();
  };

  const handleSelectPlan = async (planId: string) => {
    if (selectedPlanId === planId) return;

    try {
      setSelectedPlanId(planId);

      // Call the select API with required fields
      await apiClient.post(`/packages/${planId}/select`, {
        customerNumber: userData?.user.phone || "",
        paymentMethod: "credit_card"
      });

      alert("Plan selected successfully!");

      // Refresh user data to show the new package
      await fetchUserData();

      // Close the modal
      setShowModal(false);
    } catch (err: any) {
      console.error("Error selecting plan:", err);
      alert(err.message || "Failed to select plan. Please try again.");
    } finally {
      setSelectedPlanId(null);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-AU", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  };

  const getUsageStatus = (percentageUsed: number) => {
    if (percentageUsed >= 90) return { label: "High Usage", color: "bg-red-100 text-red-700" };
    if (percentageUsed >= 70) return { label: "Moderate Usage", color: "bg-yellow-100 text-yellow-700" };
    return { label: "Normal Usage", color: "bg-[#EFE9F7] text-[#3F205F]" };
  };

  // Calculate combined usage
  const calculateCombinedUsage = () => {
    if (!userData?.selectedPackages) return { used: 0, total: 0, remaining: 0, percentage: 0 };

    const used = userData.selectedPackages.reduce((sum, pkg) => sum + (pkg.usedData || 0), 0);
    const total = userData.selectedPackages.reduce((sum, pkg) => sum + pkg.packageId.totalData, 0);
    const remaining = total - used;
    const percentage = total > 0 ? (used / total) * 100 : 0;

    return { used, total, remaining, percentage };
  };

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="text-[16px] text-[#6F6C90]">Loading your data usage...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-64 flex-col items-center justify-center">
        <div className="text-[16px] text-red-600">Error: {error}</div>
        <button
          onClick={fetchUserData}
          className="mt-4 rounded-[10px] bg-[#3F205F] px-4 py-2 text-[14px] font-semibold text-white"
        >
          Retry
        </button>
      </div>
    );
  }

  const packages = userData?.selectedPackages || [];
  const combinedUsage = calculateCombinedUsage();
  const combinedStatus = getUsageStatus(combinedUsage.percentage);

  return (
    <>
      <h1 className="mb-6 text-[26px] font-bold text-[#0A0A0A]">Data Usage</h1>

      <div className="mb-5 flex justify-end">
        <button
          onClick={handleBuyPlanClick}
          className="rounded-[10px] bg-[#3F205F] px-4 py-2 text-[14px] font-semibold text-white hover:bg-[#2F1547] transition-colors"
        >
          Buy Plan
        </button>
      </div>

      {packages.length === 0 ? (
        <Panel className="p-8 text-center">
          <div className="text-[16px] font-semibold text-[#0A0A0A]">No Active Packages</div>
          <div className="mt-2 text-[14px] text-[#6F6C90]">
            You don't have any active packages yet. Add a plan to get started.
          </div>
        </Panel>
      ) : (
        <div className="grid grid-cols-3 gap-6">
          {/* Left column */}
          <div className="col-span-2 space-y-6">
            <Panel className="p-6">
              <div className="flex items-center justify-between">
                <div className="text-[16px] font-semibold text-[#0A0A0A]">Combined Data Usage</div>
                <span className={`rounded-[8px] px-2.5 py-1 text-[12px] font-semibold ${combinedStatus.color}`}>
                  {combinedStatus.label}
                </span>
              </div>
              <div className="mt-4 space-y-3">
                <div className="text-[13px] text-[#0A0A0A]">{combinedUsage.used.toFixed(1)}GB used</div>
                <Progress value={combinedUsage.used} max={combinedUsage.total} />
                <div className="flex items-center justify-between text-[12px] text-[#6F6C90]">
                  <span>{combinedUsage.remaining.toFixed(1)}GB remaining</span>
                  <span>{combinedUsage.total.toFixed(0)}GB total</span>
                </div>
                <div className="text-right text-[12px] text-[#6F6C90]">
                  {combinedUsage.percentage.toFixed(1)}% used
                </div>
              </div>
            </Panel>

            {packages.map((pkg) => {
              const used = pkg.usedData || 0;
              const total = pkg.packageId.totalData;
              const percentage = total > 0 ? (used / total) * 100 : 0;
              const remaining = total - used;

              return (
                <Panel key={pkg._id} className="p-6">
                  <div className="flex items-center gap-3">
                    <span className="grid h-9 w-9 place-items-center rounded-full bg-[#3F205F] text-white">
                      <svg width="16" height="20" viewBox="0 0 16 20" fill="none">
                        <rect x="3" y="1.5" width="10" height="17" rx="3" stroke="white" strokeWidth="1.8" />
                        <circle cx="8" cy="15" r="1.4" fill="white" />
                      </svg>
                    </span>
                    <div>
                      <div className="text-[14px] font-semibold text-[#0A0A0A]">
                        {pkg.packageId.planTitle}
                      </div>
                      <div className="text-[12px] text-[#6F6C90]">
                        {pkg.packageId.associatedNumber}
                      </div>
                    </div>
                    <div className="ml-auto">
                      <span
                        className={`rounded-[6px] px-2 py-0.5 text-[11px] font-semibold ${pkg.status === "active"
                          ? "bg-green-100 text-green-700"
                          : "bg-gray-100 text-gray-700"
                          }`}
                      >
                        {pkg.status}
                      </span>
                    </div>
                  </div>

                  <div className="mt-4">
                    <div className="mb-2 text-[13px] text-[#0A0A0A]">{used.toFixed(1)}GB used</div>
                    <Progress value={used} max={total} />
                    <div className="mt-2 flex items-center justify-between text-[12px] text-[#6F6C90]">
                      <span>{remaining.toFixed(1)}GB remaining</span>
                      <span>{total}GB total</span>
                    </div>
                    <div className="mt-2 flex items-center justify-between text-[12px] text-[#6F6C90]">
                      <span>Resets on {formatDate(pkg.packageId.resetDate)}</span>
                      <span>{percentage.toFixed(1)}% used</span>
                    </div>
                  </div>
                </Panel>
              );
            })}
          </div>

          {/* Right column */}
          <div className="col-span-1 space-y-6">
            <Panel className="p-6">
              <div className="text-[16px] font-semibold text-[#0A0A0A]">Daily Usage (Last 7 Days)</div>
              <div className="mt-4 space-y-3 text-[13px]">
                {["29 Jan", "30 Jan", "31 Jan", "1 Feb", "2 Feb", "3 Feb", "4 Feb"].map((d, i) => (
                  <div key={d} className="flex items-center gap-3">
                    <div className="w-16 text-[#6F6C90]">{d}</div>
                    <div className="flex-1">
                      <div className="h-2.5 w-full rounded-full bg-[#E9E6F0]">
                        <div className="h-2.5 rounded-full bg-[#3F205F]" style={{ width: `${60 + i * 5}%` }} />
                      </div>
                    </div>
                    <div className="w-10 text-right text-[#6F6C90]">2.1GB</div>
                  </div>
                ))}
              </div>
            </Panel>

            <Panel className="p-6">
              <div className="text-[16px] font-semibold text-[#0A0A0A]">Usage Tips</div>
              <div className="mt-4 grid grid-cols-2 gap-3 text-[13px]">
                {[
                  ["WiFi Connection", "Connect to WiFi when available to save mobile data"],
                  ["Data Saver Mode", "Enable data saver in your device settings"],
                  ["App Management", "Monitor which apps use the most data"],
                  ["Data Alerts", "Set up usage alerts to avoid overages"],
                ].map(([t, d]) => (
                  <div key={t} className="rounded-[12px] bg-[#F7F7FA] p-3">
                    <div className="text-[14px] font-semibold text-[#0A0A0A]">{t}</div>
                    <div className="text-[#6F6C90]">{d}</div>
                  </div>
                ))}
              </div>
            </Panel>
          </div>
        </div>
      )}

      {/* Buy Plan Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="relative max-h-[90vh] w-full max-w-4xl overflow-hidden rounded-[16px] bg-white">
            {/* Modal Header */}
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-gray-200 bg-white px-6 py-4">
              <h2 className="text-[22px] font-bold text-[#0A0A0A]">Available Plans</h2>
              <button
                onClick={() => setShowModal(false)}
                className="grid h-8 w-8 place-items-center rounded-full text-[#6F6C90] transition-colors hover:bg-gray-100"
              >
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path
                    d="M15 5L5 15M5 5L15 15"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
              </button>
            </div>

            {/* Modal Content */}
            <div className="overflow-y-auto p-6" style={{ maxHeight: "calc(90vh - 80px)" }}>
              {loadingPlans ? (
                <div className="flex h-64 items-center justify-center">
                  <div className="text-[16px] text-[#6F6C90]">Loading plans...</div>
                </div>
              ) : availablePlans.length === 0 ? (
                <div className="flex h-64 items-center justify-center">
                  <div className="text-center">
                    <div className="text-[16px] font-semibold text-[#0A0A0A]">No Plans Available</div>
                    <div className="mt-2 text-[14px] text-[#6F6C90]">
                      There are no plans available at the moment.
                    </div>
                  </div>
                </div>
              ) : (
                <div className="grid gap-6 md:grid-cols-2">
                  {availablePlans.map((plan) => (
                    <div
                      key={plan._id}
                      className="rounded-[12px] border-2 border-gray-200 p-6 transition-all hover:border-[#3F205F] hover:shadow-lg"
                    >
                      {/* Plan Header */}
                      <div className="mb-4 flex items-start justify-between">
                        <div>
                          <h3 className="text-[18px] font-bold text-[#0A0A0A]">{plan.planTitle}</h3>
                          <p className="mt-1 text-[13px] text-[#6F6C90]">{plan.planType}</p>
                        </div>
                        <div className="text-right">
                          <div className="text-[24px] font-bold text-[#3F205F]">
                            ${plan.price}
                          </div>
                          <div className="text-[12px] text-[#6F6C90]">{plan.currency}</div>
                        </div>
                      </div>

                      {/* Plan Details */}
                      <div className="mb-4 space-y-2">
                        <div className="flex items-center gap-2 text-[14px]">
                          <svg
                            width="20"
                            height="20"
                            viewBox="0 0 20 20"
                            fill="none"
                            className="text-[#3F205F]"
                          >
                            <path
                              d="M10 2C5.58 2 2 5.58 2 10s3.58 8 8 8 8-3.58 8-8-3.58-8-8-8zm0 14c-3.31 0-6-2.69-6-6s2.69-6 6-6 6 2.69 6 6-2.69 6-6 6z"
                              fill="currentColor"
                            />
                            <circle cx="10" cy="10" r="3" fill="currentColor" />
                          </svg>
                          <span className="font-semibold text-[#0A0A0A]">{plan.totalData}GB</span>
                          <span className="text-[#6F6C90]">Total Data</span>
                        </div>
                        {/* <div className="flex items-center gap-2 text-[14px]">
                          <svg
                            width="20"
                            height="20"
                            viewBox="0 0 20 20"
                            fill="none"
                            className="text-[#3F205F]"
                          >
                            <rect x="6" y="2" width="8" height="16" rx="2" stroke="currentColor" strokeWidth="1.5" />
                            <circle cx="10" cy="15" r="1" fill="currentColor" />
                          </svg>
                          <span className="text-[#6F6C90]">{plan.associatedNumber}</span>
                        </div> */}
                        <div className="flex items-center gap-2 text-[14px]">
                          <svg
                            width="20"
                            height="20"
                            viewBox="0 0 20 20"
                            fill="none"
                            className="text-[#3F205F]"
                          >
                            <path
                              d="M10 2C5.58 2 2 5.58 2 10s3.58 8 8 8 8-3.58 8-8-3.58-8-8-8zm0 14c-3.31 0-6-2.69-6-6s2.69-6 6-6 6 2.69 6 6-2.69 6-6 6z"
                              stroke="currentColor"
                              strokeWidth="1.5"
                              fill="none"
                            />
                            <path d="M10 6v4l3 2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                          </svg>
                          <span className="text-[#6F6C90]">{plan.validityDays} days validity</span>
                        </div>
                      </div>

                      {/* Description */}
                      <p className="mb-4 text-[13px] text-[#6F6C90]">{plan.description}</p>

                      {/* Features */}
                      {plan.features && plan.features.length > 0 && (
                        <div className="mb-4">
                          <div className="mb-2 text-[13px] font-semibold text-[#0A0A0A]">Features:</div>
                          <div className="flex flex-wrap gap-2">
                            {plan.features.map((feature, idx) => (
                              <span
                                key={idx}
                                className="rounded-[6px] bg-[#EFE9F7] px-2.5 py-1 text-[12px] font-medium text-[#3F205F]"
                              >
                                {feature}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Select Button */}
                      <button
                        onClick={() => handleSelectPlan(plan._id)}
                        disabled={selectedPlanId === plan._id}
                        className="mt-4 w-full rounded-[10px] bg-[#3F205F] px-4 py-2.5 text-[14px] font-semibold text-white transition-colors hover:bg-[#2F1547] disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        {selectedPlanId === plan._id ? "Processing..." : "Select Plan"}
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
