"use client";

import { useState, useEffect } from "react";
import apiClient from "@/lib/apiClient";

type AuthorisedRep = {
  _id: string;
  firstName: string;
  lastName: string;
  email?: string;
  phone: string;
  relationship: string;
  authorisationLevel: "full" | "billing" | "technical" | "read_only";
  createdAt?: string;
};

type Props = {
  customerId: string;
  initialData?: AuthorisedRep;
  onClose: () => void;
  onSuccess: (updatedReps: AuthorisedRep[]) => void;
};

export default function AuthorisedRepModal({
  customerId,
  initialData,
  onClose,
  onSuccess,
}: Props) {
  const [formData, setFormData] = useState({
    firstName: initialData?.firstName || "",
    lastName: initialData?.lastName || "",
    email: initialData?.email || "",
    phone: initialData?.phone || "",
    relationship: initialData?.relationship || "",
    authorisationLevel: initialData?.authorisationLevel || "full",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Lock body scroll
  useEffect(() => {
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
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.firstName || !formData.lastName || !formData.phone || !formData.relationship) {
      setError("Please fill in all required fields.");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      let response;
      if (initialData) {
        // Update
        response = await apiClient.put(
          `/customer-verification/authorised-reps/${customerId}/${initialData._id}`,
          formData
        );
      } else {
        // Add
        response = await apiClient.post(
          `/customer-verification/authorised-reps/${customerId}`,
          formData
        );
      }

      if (response.data.success) {
        onSuccess(response.data.data);
      }
    } catch (err: any) {
      console.error("Failed to save authorised representative:", err);
      setError(err.response?.data?.message || "An error occurred.");
    } finally {
      setLoading(false);
    }
  };

  const authorisationLevels = [
    { value: "full", label: "Full Authority" },
    { value: "billing", label: "Billing Only" },
    { value: "technical", label: "Technical Only" },
    { value: "read_only", label: "Read Only / Inquiry" },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      <div
        className="fixed inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />
      
      <div className="relative w-full max-w-lg rounded-[16px] bg-white p-6 shadow-2xl animate-in fade-in zoom-in duration-200">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-[24px] font-extrabold text-[#0A0A0A]">
            {initialData ? "Edit Representative" : "Add Authorised Rep"}
          </h2>
          <button
            onClick={onClose}
            className="grid h-8 w-8 place-items-center rounded-full bg-[#F5F5F7] text-[#6F6C90] hover:bg-[#EBEBEB] transition-colors"
          >
            ×
          </button>
        </div>

        {error && (
          <div className="mb-6 rounded-[10px] border border-red-200 bg-red-50 px-4 py-3 text-[14px] text-red-700">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[13px] font-medium text-[#0A0A0A] mb-1.5">
                First Name *
              </label>
              <input
                type="text"
                required
                value={formData.firstName}
                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                className="w-full rounded-[10px] border border-[#DFDBE3] px-4 py-3 text-[14px] outline-none focus:border-[#401B60] transition-colors"
                placeholder="Ex: John"
              />
            </div>
            <div>
              <label className="block text-[13px] font-medium text-[#0A0A0A] mb-1.5">
                Last Name *
              </label>
              <input
                type="text"
                required
                value={formData.lastName}
                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                className="w-full rounded-[10px] border border-[#DFDBE3] px-4 py-3 text-[14px] outline-none focus:border-[#401B60] transition-colors"
                placeholder="Ex: Doe"
              />
            </div>
          </div>

          <div>
            <label className="block text-[13px] font-medium text-[#0A0A0A] mb-1.5">
              Relationship to Customer *
            </label>
            <input
              type="text"
              required
              value={formData.relationship}
              onChange={(e) => setFormData({ ...formData, relationship: e.target.value })}
              className="w-full rounded-[10px] border border-[#DFDBE3] px-4 py-3 text-[14px] outline-none focus:border-[#401B60] transition-colors"
              placeholder="Ex: Family Member, Guardian, Power of Attorney"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[13px] font-medium text-[#0A0A0A] mb-1.5">
                Phone Number *
              </label>
              <input
                type="tel"
                required
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full rounded-[10px] border border-[#DFDBE3] px-4 py-3 text-[14px] outline-none focus:border-[#401B60] transition-colors"
                placeholder="0400 000 000"
              />
            </div>
            <div>
              <label className="block text-[13px] font-medium text-[#0A0A0A] mb-1.5">
                Email Address
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full rounded-[10px] border border-[#DFDBE3] px-4 py-3 text-[14px] outline-none focus:border-[#401B60] transition-colors"
                placeholder="john.doe@example.com"
              />
            </div>
          </div>

          <div>
            <label className="block text-[13px] font-medium text-[#0A0A0A] mb-1.5">
              Authorisation Level *
            </label>
            <select
              required
              value={formData.authorisationLevel}
              onChange={(e) => setFormData({ ...formData, authorisationLevel: e.target.value as any })}
              className="w-full appearance-none rounded-[10px] border border-[#DFDBE3] bg-white px-4 py-3 text-[14px] outline-none focus:border-[#401B60] transition-colors"
            >
              {authorisationLevels.map((level) => (
                <option key={level.value} value={level.value}>
                  {level.label}
                </option>
              ))}
            </select>
          </div>

          <div className="mt-8 flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-[10px] border border-[#DFDBE3] px-6 py-3 text-[14px] font-bold text-[#6F6C90] hover:bg-[#F8F8F8] transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="min-w-[120px] rounded-[10px] bg-[#401B60] px-6 py-3 text-[14px] font-bold text-white hover:opacity-95 disabled:opacity-50 transition-all shadow-lg shadow-[#401B60]/20"
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                  Saving...
                </div>
              ) : (
                initialData ? "Save Changes" : "Add Representative"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
