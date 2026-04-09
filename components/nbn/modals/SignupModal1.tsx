"use client";

import ModalShell from "@/components/shared/ModalShell";
import Stepper from "@/components/shared/Stepper";
import SectionPanel from "@/components/shared/SectionPanel";
import BarActions from "@/components/shared/BarActions";
import { useEffect, useState } from "react";
import apiClient from "@/lib/apiClient";

export default function SignupModal1({
  onNext,
  onBack,
  onClose,
  address,
  onChangeAddress,
  onAvailablePlans,
  onLocId,
  onNtdId,
  onPort,
  onServiceRef,
  onStepClick,
  maxReached,
}: {
  onNext: () => void;
  onBack: () => void;
  onClose: () => void;
  address: string;
  onChangeAddress: (addr: string) => void;
  onAvailablePlans?: (plans: any[]) => void;
  onLocId?: (id: string) => void;
  onNtdId?: (id: string) => void;
  onPort?: (port: string) => void;
  onServiceRef?: (ref: string) => void;
  onStepClick?: (step: number) => void;
  maxReached?: number;
}) {
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);
  const [isLoadingAvailability, setIsLoadingAvailability] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [isSelection, setIsSelection] = useState(false);
  const [isDirty, setIsDirty] = useState(false);

  /* 
  useEffect(() => {
    if (!address || address.length < 3 || isSelection || !isDirty) {
      if (isSelection) setIsSelection(false);
      setSuggestions([]);
      setShowDropdown(false);
      return;
    }

    const handler = setTimeout(async () => {
      try {
        setIsLoadingSuggestions(true);
        const response = await apiClient.get(`/services/wholesaler/address-autocomplete`, {
          params: { query: address }
        });

        if (response.data?.addresses) {
          setSuggestions(response.data.addresses);
          setShowDropdown(response.data.addresses.length > 0);
        }
      } catch (err) {
        console.error("Failed to fetch address suggestions:", err);
      } finally {
        setIsLoadingSuggestions(false);
      }
    }, 500); // 500ms debounce

    return () => clearTimeout(handler);
  }, [address]);
  */

  // Add a simple effect to clear suggestions if address is empty
  useEffect(() => {
    if (!address) {
      setSuggestions([]);
      setShowDropdown(false);
    }
  }, [address]);

  const handleSelect = (label: string) => {
    setIsSelection(true);
    onChangeAddress(label);
    setShowDropdown(false);
  };

  const handleCheck = async () => {
    if (!address) return;

    try {
      setIsLoadingAvailability(true);
      const response = await apiClient.post(
        "/services/wholesaler/nbn-availability",
        { address },
      );

      if (response.data?.success) {
        if (onAvailablePlans) onAvailablePlans(response.data.bandwidths || []);
        if (onLocId) onLocId(response.data.locId || "");

        // Extract Line (NTD ID), Port, and Service Ref (AVC) from current services
        const services = response.data?.current?.services || [];
        let ntdId = "NEW";
        let port = "";
        let serviceRef = "";

        if (services.length > 0) {
          // Look for the first "Free" port
          let selectedService = services.find((s: any) => s.status === "Free");

          // If no free port, look for a "Used" port (Churn case)
          if (!selectedService) {
            selectedService = services.find((s: any) => s.status === "Used");
          }

          // Fallback to the first available service if nothing specific found
          if (!selectedService) {
            selectedService = services[0];
          }

          ntdId = selectedService.line || "NEW";
          port = selectedService.port || "";

          // Churn logic: If port is "Used", extract active AVC
          if (
            selectedService.status === "Used" &&
            selectedService.service_ref
          ) {
            serviceRef = selectedService.service_ref;
          }
        }

        if (onNtdId) onNtdId(ntdId);
        if (onPort) onPort(port);
        if (onServiceRef) onServiceRef(serviceRef);

        onNext();
      } else {
        // Fallback for manual plans even if backend SQ fails (e.g. address not found by wholesaler)
        // We still want to show manual plans fetching them again or using a fallback endpoint
        // But for now, since we want "any address", we can proceed with a warning or just go next
        // If the backend fails, we might not have the plans.
        // Let's modify the backend to be even more resilient.
        alert(
          response.data?.message ||
            "Address check failed. Proceeding with manual selection.",
        );
        // If it failed because of wholesaler, we can still fetch manual plans.
        // Actually, let's make the backend return manual plans even if SQ fails.
      }
    } catch (err: any) {
      console.error("Failed to check NBN availability:", err);
      // alert(err.message || "Failed to check NBN availability.");
      // Proceed anyway to show manual plans
      onNext();
    } finally {
      setIsLoadingAvailability(false);
    }
  };

  return (
    <ModalShell onClose={onClose} size="wide">
      <Stepper active={1} onStepClick={onStepClick} maxReached={maxReached} />

      <SectionPanel>
        <div className="mx-auto max-w-[760px] text-center">
          <div className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-[var(--cl-brand-ink)] text-white">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path
                d="M12 22s7-5.5 7-11a7 7 0 10-14 0c0 5.5 7 11 7 11Z"
                stroke="white"
                strokeWidth="1.5"
              />
            </svg>
          </div>
          <h2 className="modal-h1 mt-4">Check NBN Availability</h2>
          <p className="modal-sub mt-1">
            Enter your address to see available plans
          </p>

          <div className="mt-6 text-left relative">
            <label
              htmlFor="serviceAddress"
              className="text-sm font-semibold text-[#3B3551]"
            >
              Your Address
            </label>
            <div className="relative">
              <input
                id="serviceAddress"
                name="serviceAddress"
                autoComplete="off"
                className="input mt-2 w-full pr-10"
                placeholder="Enter your full address"
                value={address}
                onChange={(e) => {
                  setIsDirty(true);
                  onChangeAddress(e.target.value);
                }}
                onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
                onFocus={() =>
                  address.length >= 3 &&
                  suggestions.length > 0 &&
                  setShowDropdown(true)
                }
              />
              {(isLoadingSuggestions || isLoadingAvailability) && (
                <div className="absolute right-3 top-[18px]">
                  <div className="h-5 w-5 animate-spin rounded-full border-2 border-[var(--cl-brand-ink)] border-t-transparent"></div>
                </div>
              )}
            </div>

            {/* Suggestions Dropdown */}
            {showDropdown && suggestions.length > 0 && (
              <div className="absolute z-10 mt-1 w-full max-h-60 overflow-auto rounded-md border border-[#DFDBE3] bg-white shadow-lg">
                {suggestions.map((suggestion, idx) => (
                  <button
                    key={idx}
                    type="button"
                    className="w-full px-4 py-3 text-left hover:bg-[#FBF8FF] transition-colors border-b last:border-b-0 border-[#F0F0F0]"
                    onClick={() => handleSelect(suggestion.label)}
                  >
                    <div className="text-[14px] text-[#3B3551] font-medium">
                      {suggestion.label}
                    </div>
                  </button>
                ))}
              </div>
            )}

            <button
              type="button"
              onClick={handleCheck}
              disabled={
                !address || isLoadingAvailability || isLoadingSuggestions
              }
              className="btn-primary mt-5 w-full disabled:opacity-60 transition-all"
            >
              {isLoadingAvailability ? "Checking availability..." : "Check"}
            </button>
          </div>

          {/* FTTP Upgrade Message - Displayed after address check */}
          <div className="mt-6 rounded-lg border border-[#E9E3F2] bg-[#FBF8FF] p-4 text-left">
            <div className="flex items-start gap-3">
              <div className="grid h-6 w-6 flex-shrink-0 place-items-center rounded-full bg-[#401B60] text-white mt-0.5">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
                    fill="currentColor"
                  />
                </svg>
              </div>
              <div className="text-[14px] text-[#3B3551]">
                <p className="font-semibold text-[#401B60] mb-1">
                  Did you know?
                </p>
                <p className="text-[#6A6486]">
                  Some properties are eligible for a free Fibre to the Premises
                  (FTTP) upgrade. Contact our team on{" "}
                  <span className="font-semibold text-[#401B60]">
                    (Number will be provided soon)
                  </span>{" "}
                  to find out if your address qualifies.
                </p>
              </div>
            </div>
          </div>
        </div>
      </SectionPanel>

      <BarActions onBack={onBack} onNext={onNext} nextDisabled={!address} />
    </ModalShell>
  );
}
