"use client";

import { useState, useEffect } from "react";
import apiClient from "@/lib/apiClient";
import AuthorisedRepModal from "./AuthorisedRepModal";

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
  customerId?: string;
};

export default function AuthorisedRepresentatives({ customerId }: Props) {
  const [reps, setReps] = useState<AuthorisedRep[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [editingRep, setEditingRep] = useState<AuthorisedRep | null>(null);

  useEffect(() => {
    if (customerId) {
      fetchReps();
    }
  }, [customerId]);

  const fetchReps = async () => {
    if (!customerId) return;
    try {
      setLoading(true);
      const { data } = await apiClient.get(`/customer-verification/authorised-reps/${customerId}`);
      if (data.success) {
        setReps(data.data || []);
      }
    } catch (err: any) {
      console.error("Failed to fetch authorised representatives:", err);
      setError("Failed to load representatives");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (repId: string) => {
    if (!customerId || !window.confirm("Are you sure you want to remove this authorised representative?")) return;
    try {
      const { data } = await apiClient.delete(`/customer-verification/authorised-reps/${customerId}/${repId}`);
      if (data.success) {
        setReps(data.data || []);
      }
    } catch (err: any) {
      console.error("Failed to delete representative:", err);
      alert("Failed to remove representative");
    }
  };

  const handleEdit = (rep: AuthorisedRep) => {
    setEditingRep(rep);
    setShowModal(true);
  };

  const handleAdd = () => {
    setEditingRep(null);
    setShowModal(true);
  };

  if (!customerId) return null;

  return (
    <div className="rounded-[14px] border border-[#DFDBE3] bg-white p-6 shadow-[0_37px_37px_rgba(0,0,0,0.05)]">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-[20px] font-semibold text-[#0A0A0A]">
          Authorised Representatives
        </h2>
        {reps.length < 3 && (
          <button
            onClick={handleAdd}
            className="rounded-[8px] bg-[#401B60] px-3 py-1.5 text-[13px] font-semibold text-white hover:opacity-95"
          >
            Add New
          </button>
        )}
      </div>

      {error && (
        <div className="mb-4 text-[13px] text-red-600">
          {error}
        </div>
      )}

      {loading ? (
        <div className="py-4 text-center text-[14px] text-[#6F6C90]">
          Loading representatives...
        </div>
      ) : reps.length === 0 ? (
        <div className="py-4 text-center rounded-[10px] border border-dashed border-[#DFDBE3] bg-[#F8F8F8]">
          <p className="text-[13px] text-[#6F6C90]">
            No authorised representatives added.
          </p>
          <p className="text-[11px] text-[#A0A0A0] mt-1">
            Max 3 required for disability support compliance.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {reps.map((rep) => (
            <div
              key={rep._id}
              className="group relative flex items-start justify-between rounded-[10px] border border-[#DFDBE3] bg-white p-4 hover:border-[#401B60]/30 transition-all"
            >
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#401B60]/10 text-[#401B60]">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M8 7a4 4 0 1 0 0-8 4 4 0 0 0 0 8z"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <circle cx="18" cy="11" r="3" stroke="currentColor" strokeWidth="2" />
                  </svg>
                </div>
                <div>
                  <div className="text-[15px] font-bold text-[#0A0A0A]">
                    {rep.firstName} {rep.lastName}
                  </div>
                  <div className="text-[12px] text-[#401B60] font-medium mb-1">
                    {rep.relationship} • {rep.authorisationLevel.replace("_", " ").toUpperCase()}
                  </div>
                  <div className="flex flex-col gap-0.5">
                    <div className="flex items-center gap-1.5 text-[12px] text-[#6F6C90]">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      {rep.phone}
                    </div>
                    {rep.email && (
                      <div className="flex items-center gap-1.5 text-[12px] text-[#6F6C90]">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                          <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                          <path d="m22 6-10 7L2 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        {rep.email}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex gap-1.5">
                <button
                  onClick={() => handleEdit(rep)}
                  className="rounded-[6px] p-1.5 text-[#6F6C90] hover:bg-[#F8F8F8] hover:text-[#401B60]"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
                <button
                  onClick={() => handleDelete(rep._id)}
                  className="rounded-[6px] p-1.5 text-[#6F6C90] hover:bg-red-50 hover:text-red-600"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M10 11v6M14 11v6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <AuthorisedRepModal
          customerId={customerId}
          initialData={editingRep || undefined}
          onClose={() => {
            setShowModal(false);
            setEditingRep(null);
          }}
          onSuccess={(updatedReps) => {
            setReps(updatedReps);
            setShowModal(false);
            setEditingRep(null);
          }}
        />
      )}
    </div>
  );
}
