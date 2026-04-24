"use client";
import { useState, useEffect } from "react";
import ModalShell from "@/components/shared/ModalShell";
import SectionPanel from "@/components/shared/SectionPanel";
import BarActions from "@/components/shared/BarActions";
import MVHeaderBanner from "../MVHeaderBanner";
import MVStepper from "../MVStepper";

type Plan = {
  id?: string | number;
  name: string;
  price: number;
  perks: string[];
  badge?: string;
};

import apiClient from "@/lib/apiClient";

const fallbackPlans: Plan[] = [
  {
    name: "Mobile Basic",
    price: 25,
    perks: ["5GB Data", "Unlimited National", "Unlimited SMS"],
  },
  {
    name: "Mobile Standard",
    price: 35,
    perks: ["20GB Data", "Unlimited National", "Unlimited SMS"],
    badge: "Most Popular",
  },
  {
    name: "Mobile Premium",
    price: 55,
    perks: [
      "100GB Data",
      "Unlimited National & International",
      "Unlimited SMS",
    ],
  },
];

export default function MobileVoiceSignup1({
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
            const voicePlans = data.filter(
              (p: any) => p.connection_type_name === "Voice",
            );
            const mapped = voicePlans.map((s: any) => ({
              id: s.value?.toString() || s._id,
              name: s.custom_name || s.label || "Voice Plan",
              price: s.price,
              perks: s.label ? [s.label.split("UTB:")[0].trim()] : [],
            }));
            combinedPlans = [...mapped];
          }
        } catch (err: any) {
          console.error("Failed to load Wholesaler rate plans:", err);
        }

        // 2. Fetch CMS plans for Mobile / Voice
        try {
          // Both Mobile and Voice Only can be matched, but we'll fetch 'Mobile' as default or fetch all and filter
          const resp = await apiClient.get("/services", {
            params: { status: "Published", serviceType: "Mobile" },
          });
          const cmsData = resp.data?.data || resp.data;
          if (Array.isArray(cmsData)) {
            const cmsMapped = cmsData.map((s: any) => ({
              id: s._id,
              name: s.serviceName,
              price: s.price,
              perks: s.features ? s.features.map((f: any) => f.name) : [],
              badge: "Service Plan",
            }));
            combinedPlans = [...combinedPlans, ...cmsMapped];
          }
        } catch (cmsErr) {
          console.error("Failed to fetch CMS Mobile plans:", cmsErr);
        }

        if (!mounted) return;

        setPlans(combinedPlans);
        if (initialSelectedPlan) {
          const found = combinedPlans.find(
            (p: any) => p.name === initialSelectedPlan.name,
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
      onPlanSelect({ id: plan.id, name: plan.name, price: plan.price });
    }
  };

  return (
    <ModalShell onClose={onClose} size="wide">
      <MVHeaderBanner />
      <div className="mt-6">
        <MVStepper
          active={1}
          onStepClick={onStepClick}
          maxReached={maxReached}
        />
      </div>

      <SectionPanel>
        <div className="text-center">
          <div className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-[#2F2151] text-white">
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              aria-hidden
            >
              <rect
                x="6"
                y="2"
                width="12"
                height="20"
                rx="3"
                stroke="white"
                strokeWidth="1.5"
              />
              <circle cx="12" cy="18" r="1.5" fill="white" />
            </svg>
          </div>
          <h2 className="mt-4 text-[28px] font-extrabold leading-[34px] text-[#170F49]">
            Choose Your Mobile Plan
          </h2>
          <p className="mt-1 text-[14px] leading-[22px] text-[#6F6C90]">
            Select the plan that best fits your needs
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
              const isSelected = selectedPlan?.name === plan.name;
              const isDisabled = plan.price == null;
              return (
                <button
                  key={plan.id?.toString() || plan.name}
                  type="button"
                  disabled={isDisabled}
                  onClick={() => handlePlanSelect(plan)}
                  className={[
                    "text-left rounded-[16px] border p-6 transition-all",
                    isDisabled
                      ? "opacity-50 cursor-not-allowed bg-gray-50 border-gray-200"
                      : "bg-white shadow-[0_40px_60px_rgba(0,0,0,0.06)]",
                    isSelected && !isDisabled
                      ? "border-2 border-[#5C3B86] bg-[#FBF8FF]"
                      : !isDisabled
                        ? "border border-[#DFDBE3] hover:border-[#5C3B86]/50"
                        : "",
                  ].join(" ")}
                >
                  {isSelected && !isDisabled && (
                    <div className="mb-3 flex items-center justify-end">
                      <div className="grid h-6 w-6 place-items-center rounded-full bg-[#5C3B86] text-white">
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
                  <div
                    className={[
                      "text-[18px] font-semibold",
                      isSelected ? "text-[#5C3B86]" : "text-[#7C7396]",
                    ].join(" ")}
                  >
                    {plan.name}
                  </div>

                  <div className="mt-3 text-[32px] font-extrabold text-[#2F2151]">
                    {plan.price != null ? `$${plan.price}` : "N/A"}
                    {plan.price != null && (
                      <span className="ml-1 text-[16px] font-semibold">
                        /month
                      </span>
                    )}
                  </div>

                  <ul className="mt-4 space-y-2 text-[14px] text-[#5D5875]">
                    {plan.perks.map((p, idx) => (
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
                            stroke="#3EB164"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                        {p}
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
