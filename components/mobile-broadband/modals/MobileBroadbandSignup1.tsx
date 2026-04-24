"use client";
import { useState, useEffect } from "react";
import ModalShell from "@/components/shared/ModalShell";
import SectionPanel from "@/components/shared/SectionPanel";
import BarActions from "@/components/shared/BarActions";
import MbbHeaderBanner from "../MbbHeaderBanner";
import MbbStepper from "../MbbStepper";
import apiClient from "@/lib/apiClient";

type Plan = {
  id?: string;
  title: string;
  price: number;
  bullets: string[];
  badge?: string;
};

const fallbackPlans: Plan[] = [
  {
    title: "Data Light",
    price: 20,
    bullets: ["10GB Data", "4G/5G Network", "30 days validity"],
  },
  {
    title: "Data Standard",
    price: 35,
    badge: "Most Popular",
    bullets: ["50GB Data", "4G/5G Network", "30 days validity"],
  },
  {
    title: "Data Unlimited",
    price: 65,
    bullets: ["Unlimited Data", "4G/5G Network", "30 days validity"],
  },
];

export default function MobileBroadbandSignup1({
  onNext,
  onBack,
  onClose,
  selectedPlan: initialSelectedPlan,
  onPlanSelect,
  onStepClick,
  maxReached,
}: {
  onNext: () => void;
  onBack: () => void;
  onClose: () => void;
  selectedPlan?: { id?: string | number; name: string; price: number } | null;
  onPlanSelect?: (plan: {
    id?: string | number;
    name: string;
    price: number;
  }) => void;
  onStepClick?: (step: number) => void;
  maxReached?: number;
}) {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      setLoading(true);
      setLoadError(null);
      try {
        let combinedPlans: Plan[] = [];

        // 1. Fetch wholesaler plans
        try {
          const resp = await apiClient.get("/wholesaler-plans");
          const data = resp.data && resp.data.data ? resp.data.data : resp.data;
          if (Array.isArray(data) && data.length > 0) {
            const broadbandPlans = data.filter(
              (p: any) => p.connection_type_name === "Broadband",
            );
            const mapped = broadbandPlans.map((s: any) => ({
              id: s.value?.toString() || s._id,
              title: s.custom_name || s.label || "Data Plan",
              price: s.price,
              bullets: s.label ? [s.label.split("UTB:")[0].trim()] : [],
            }));
            combinedPlans = [...mapped];
          }
        } catch (err: any) {
          console.error("Failed to load Wholesaler rate plans:", err);
        }

        // 2. Fetch CMS plans for Data Only
        try {
          const resp = await apiClient.get("/services", {
            params: { status: "Published", serviceType: "Data Only" },
          });
          const cmsData = resp.data?.data || resp.data;
          if (Array.isArray(cmsData)) {
            const cmsMapped = cmsData.map((s: any) => ({
              id: s._id,
              title: s.serviceName,
              price: s.price,
              bullets: s.features ? s.features.map((f: any) => f.name) : [],
              badge: "Service Plan",
            }));
            combinedPlans = [...combinedPlans, ...cmsMapped];
          }
        } catch (cmsErr) {
          console.error("Failed to fetch CMS Data Only plans:", cmsErr);
        }

        if (!mounted) return;

        setPlans(combinedPlans);
        if (initialSelectedPlan) {
          const found = combinedPlans.find(
            (p: any) => p.title === initialSelectedPlan.name,
          );
          if (found) setSelectedPlan(found);
        }
      } catch (err: any) {
        if (mounted) setLoadError(err?.message || "Failed to load plans");
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [initialSelectedPlan]);

  const handlePlanSelect = (plan: Plan) => {
    setSelectedPlan(plan);
    if (onPlanSelect) {
      onPlanSelect({ id: plan.id, name: plan.title, price: plan.price });
    }
  };

  return (
    <ModalShell onClose={onClose} size="wide">
      <MbbHeaderBanner />
      <div className="mt-6">
        <MbbStepper
          active={1}
          onStepClick={onStepClick}
          maxReached={maxReached}
        />
      </div>

      <SectionPanel>
        <div className="text-center">
          <div className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-[#4F1C76] text-white">
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="currentColor"
              aria-hidden
            >
              <circle cx="12" cy="12" r="10" />
            </svg>
          </div>
          <h2 className="mt-4 text-[28px] font-extrabold leading-[34px] text-[#170F49]">
            Choose Your Data Plan
          </h2>
          <p className="mt-1 text-[14px] leading-[22px] text-[#6F6C90]">
            Select the data plan that suits your usage
          </p>
        </div>

        <div className="mt-8 grid gap-6 md:grid-cols-3">
          {loading ? (
            [1, 2, 3].map((i) => (
              <div
                key={i}
                className="p-6 rounded-[16px] border bg-white animate-pulse"
              >
                <div className="h-6 w-6 mb-3 rounded-full bg-gray-200" />
                <div className="h-6 w-1/2 bg-gray-200 mb-4 rounded" />
                <div className="h-10 w-1/4 bg-gray-200 mb-4 rounded" />
                <div className="space-y-2">
                  <div className="h-3 bg-gray-200 rounded" />
                  <div className="h-3 bg-gray-200 rounded w-5/6" />
                </div>
              </div>
            ))
          ) : loadError ? (
            <div className="col-span-3 text-center text-red-600">
              Failed to load plans. Please try again later.
            </div>
          ) : plans.length === 0 ? (
            <div className="col-span-3 text-center">No plans available</div>
          ) : (
            plans.map((plan) => {
              const isSelected = selectedPlan?.id === plan.id;
              const isDisabled = plan.price == null;
              return (
                <button
                  key={plan.id}
                  type="button"
                  disabled={isDisabled}
                  onClick={() => handlePlanSelect(plan)}
                  className={[
                    "text-left rounded-[16px] border p-6 transition-all",
                    isDisabled
                      ? "opacity-50 cursor-not-allowed bg-gray-50 border-gray-200"
                      : "bg-white shadow-[0_24px_60px_rgba(64,27,118,0.10)]",
                    isSelected && !isDisabled
                      ? "border-2 border-[#4F1C76] bg-[#FBF8FF]"
                      : !isDisabled
                        ? "border border-[#E7E4EC] hover:border-[#CFC6DC]"
                        : "",
                  ].join(" ")}
                >
                  {isSelected && !isDisabled && (
                    <div className="mb-3 flex items-center justify-end">
                      <div className="grid h-6 w-6 place-items-center rounded-full bg-[#4F1C76] text-white">
                        <svg
                          width="14"
                          height="14"
                          viewBox="0 0 24 24"
                          fill="none"
                        >
                          <path
                            d="M20 6L9 17l-5-5"
                            stroke="white"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </div>
                    </div>
                  )}
                  <div className="flex items-start justify-between">
                    <div>
                      <div
                        className={[
                          "text-[18px] font-semibold",
                          isSelected ? "text-[#4F1C76]" : "text-[#3B3551]",
                        ].join(" ")}
                      >
                        {plan.title}
                      </div>
                      <div className="mt-2 text-[32px] font-extrabold text-[#4F1C76]">
                        {plan.price != null ? `$${plan.price}` : "N/A"}
                        {plan.price != null && (
                          <span className="ml-1 text-[16px] font-semibold">
                            /month
                          </span>
                        )}
                      </div>
                    </div>
                    {!isSelected && (
                      <span className="mt-1 inline-flex h-5 w-5 items-center justify-center rounded-full border border-[#CFC6DC]">
                        <span className="h-2.5 w-2.5 rounded-full bg-transparent" />
                      </span>
                    )}
                  </div>

                  {plan.badge && (
                    <span className="mt-2 inline-block rounded-[8px] bg-[#EEE8F6] px-2 py-[2px] text-[11px] font-semibold text-[#3B3551]">
                      {plan.badge}
                    </span>
                  )}

                  <ul className="mt-4 space-y-2 text-[14px] text-[#5B5668]">
                    {plan.bullets.map((b, idx) => (
                      <li key={idx} className="flex items-center gap-2">
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          aria-hidden
                        >
                          <path
                            d="M20 6 9 17l-5-5"
                            stroke="#10B981"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                        {b}
                      </li>
                    ))}
                  </ul>
                </button>
              );
            })
          )}
        </div>
      </SectionPanel>

      <BarActions
        onBack={onBack}
        onNext={onNext}
        nextDisabled={!selectedPlan || loading || !!loadError}
      />
    </ModalShell>
  );
}
