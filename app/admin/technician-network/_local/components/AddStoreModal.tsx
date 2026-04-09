"use client";

import { useEffect, useState } from "react";
import apiClient from "@/lib/apiClient";

type Technician = {
  id?: string;
  fullName: string;
  roleTitle?: string;
  years?: string;
  specialties?: string;
  videoUrl?: string;
  bio?: string;
  photoUrl?: string;
  photoFile?: File | null;
};

type StoreForm = {
  storeName: string;
  address: string;
  hours: string;
  phone: string;
  googleLink: string;
  bannerUrl: string;
  pitch: string;
  status: "Active" | "Inactive";
  uploads: File[];
};

type StoreRow = {
  id: string;
  name: string;
  address: string;
  hours: string;
  phone: string;
  googleLink?: string;
  bannerUrl?: string;
  pitch?: string;
  status: "Active" | "Inactive";
  technicians: Technician[];
};

export default function AddStoreWizard({
  open,
  onClose,
  onCreate,
  onUpdate,
  editingStore,
}: {
  open: boolean;
  onClose: () => void;
  onCreate?: (store: StoreRow) => void;
  onUpdate?: (store: StoreRow) => void;
  editingStore?: StoreRow | null;
}) {
  const isEditMode = !!editingStore;
  const [step, setStep] = useState<1 | 2>(1);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Step 1 state
  const [store, setStore] = useState<StoreForm>({
    storeName: "",
    address: "",
    hours: "",
    phone: "",
    googleLink: "",
    bannerUrl: "",
    pitch: "",
    status: "Active",
    uploads: [],
  });

  // Step 2 state (repeatable profiles)
  const [profiles, setProfiles] = useState<Technician[]>([
    {
      id: crypto.randomUUID(),
      fullName: "",
      roleTitle: "",
      years: "",
      specialties: "",
      videoUrl: "",
      bio: "",
      photoFile: null,
    },
  ]);

  useEffect(() => {
    if (open) {
      if (isEditMode && editingStore) {
        setStore({
          storeName: editingStore.name || "",
          address: editingStore.address || "",
          hours: editingStore.hours || "",
          phone: editingStore.phone || "",
          googleLink: editingStore.googleLink || "",
          bannerUrl: editingStore.bannerUrl || "",
          pitch: editingStore.pitch || "",
          status: editingStore.status || "Active",
          uploads: [],
        });
        setProfiles(
          editingStore.technicians && editingStore.technicians.length > 0
            ? editingStore.technicians.map((t) => ({
              id: t.id || crypto.randomUUID(),
              fullName: t.fullName || "",
              roleTitle: t.roleTitle || "",
              years: t.years || "",
              specialties: t.specialties || "",
              videoUrl: t.videoUrl || "",
              bio: t.bio || "",
              photoUrl: t.photoUrl || "",
              photoFile: null,
            }))
            : [
              {
                id: crypto.randomUUID(),
                fullName: "",
                roleTitle: "",
                years: "",
                specialties: "",
                videoUrl: "",
                bio: "",
                photoFile: null,
              },
            ]
        );
      } else {
        resetAll();
      }
      setStep(1);
      setError(null);
      setSubmitting(false);
    }
  }, [open, isEditMode, editingStore]);

  const resetAll = () => {
    setStep(1);
    setStore({
      storeName: "",
      address: "",
      hours: "",
      phone: "",
      googleLink: "",
      bannerUrl: "",
      pitch: "",
      status: "Active",
      uploads: [],
    });
    setProfiles([
      {
        id: crypto.randomUUID(),
        fullName: "",
        roleTitle: "",
        years: "",
        specialties: "",
        videoUrl: "",
        bio: "",
        photoFile: null,
      },
    ]);
  };

  const closeAndReset = () => {
    resetAll();
    onClose();
  };

  const handleSubmit = async () => {
    // Validate store fields
    if (!store.storeName.trim()) {
      setError("Store name is required.");
      return;
    }
    if (!store.address.trim()) {
      setError("Address is required.");
      return;
    }
    if (!store.hours.trim()) {
      setError("Operating hours are required.");
      return;
    }
    if (!store.phone.trim()) {
      setError("Phone number is required.");
      return;
    }

    // Validate technicians
    const validTechnicians = profiles.filter((p) => p.fullName.trim());
    if (validTechnicians.length === 0) {
      setError("At least one technician with a name is required.");
      return;
    }

    try {
      setSubmitting(true);
      setError(null);

      const payload = {
        name: store.storeName.trim(),
        address: store.address.trim(),
        hours: store.hours.trim(),
        phone: store.phone.trim(),
        googleLink: store.googleLink.trim() || undefined,
        bannerUrl: store.bannerUrl.trim() || undefined,
        pitch: store.pitch.trim() || undefined,
        status: store.status,
        technicians: validTechnicians.map((t) => ({
          fullName: t.fullName.trim(),
          roleTitle: t.roleTitle?.trim() || undefined,
          years: t.years?.trim() || undefined,
          specialties: t.specialties?.trim() || undefined,
          videoUrl: t.videoUrl?.trim() || undefined,
          bio: t.bio?.trim() || undefined,
          photoUrl: t.photoUrl?.trim() || undefined,
        })),
      };

      if (isEditMode && editingStore) {
        const { data } = await apiClient.put<{ success: boolean; data: StoreRow }>(
          `/stores/${editingStore.id}`,
          payload
        );

        if (data?.success && data.data) {
          onUpdate?.(data.data);
          closeAndReset();
          return;
        }
        setError("Failed to update store. Please try again.");
      } else {
        const { data } = await apiClient.post<{ success: boolean; data: StoreRow }>(
          "/stores",
          payload
        );

        if (data?.success && data.data) {
          onCreate?.(data.data);
          closeAndReset();
          return;
        }
        setError("Failed to create store. Please try again.");
      }
    } catch (err: any) {
      setError(err?.message || "Failed to save store. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (!open) return null;

  return (
    <div
      className="fixed z-[100] flex items-center justify-center"
      style={{
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        margin: 0,
        padding: 0,
        width: '100vw',
        height: '100vh'
      }}
    >
      <div
        className="fixed bg-black/30"
        onClick={onClose}
        style={{
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          width: '100vw',
          height: '100vh',
          zIndex: 100
        }}
      />
      <div
        className="fixed z-[101] w-full max-w-[820px] max-h-[95vh] sm:max-h-[90vh] rounded-[10px] sm:rounded-[14px] bg-white shadow-2xl flex flex-col"
        style={{
          left: '50%',
          top: '50%',
          transform: 'translate(-50%, -50%)'
        }}
        onClick={(e) => e.stopPropagation()}
        onMouseDown={(e) => e.stopPropagation()}
      >
        {/* Header with tabs */}
        <div className="flex items-center justify-between border-b border-[#EEEAF4] px-3 sm:px-4 md:px-6 py-3 sm:py-4 md:py-5 flex-shrink-0">
          <h2 className="text-[16px] sm:text-[18px] md:text-[20px] font-bold text-[#0A0A0A] pr-2">
            {isEditMode ? "Edit Partner Store" : "Add Partner Store"}
          </h2>
          <button
            onClick={closeAndReset}
            className="rounded-full p-1.5 sm:p-2 text-[#E05252] hover:bg-[#FFF0F0] flex-shrink-0 touch-manipulation"
            aria-label="Close"
            disabled={submitting}
          >
            <span className="text-[18px] sm:text-[20px]">✕</span>
          </button>
        </div>

        <div className="flex items-center justify-center gap-2 px-3 sm:px-4 md:px-6 pt-3 sm:pt-4 flex-shrink-0">
          <button
            onClick={() => setStep(1)}
            disabled={submitting}
            className={[
              "w-full rounded-[8px] px-2 sm:px-3 py-2 text-[12px] sm:text-[13px] md:text-[14px] font-semibold transition-colors",
              step === 1 ? "bg-[#F4F1F9] text-[#3F205F]" : "bg-[#F7F7FA] text-[#6F6C90]",
              submitting ? "opacity-50 cursor-not-allowed" : "",
            ].join(" ")}
          >
            <span className="hidden sm:inline">Store Details</span>
            <span className="sm:hidden">Store</span>
          </button>
          <button
            onClick={() => setStep(2)}
            disabled={submitting}
            className={[
              "w-full rounded-[8px] px-2 sm:px-3 py-2 text-[12px] sm:text-[13px] md:text-[14px] font-semibold transition-colors",
              step === 2 ? "bg-[#F4F1F9] text-[#3F205F]" : "bg-[#F7F7FA] text-[#6F6C90]",
              submitting ? "opacity-50 cursor-not-allowed" : "",
            ].join(" ")}
          >
            <span className="hidden sm:inline">Technician Details</span>
            <span className="sm:hidden">Technician</span>
          </button>
        </div>

        {/* Body */}
        <div className="max-h-[calc(95vh-200px)] sm:max-h-[calc(90vh-200px)] md:max-h-[72vh] overflow-y-auto px-3 sm:px-4 md:px-6 py-4 sm:py-5 flex-1 min-h-0">
          {step === 1 ? (
            <StoreDetails store={store} setStore={setStore} submitting={submitting} />
          ) : (
            <TechnicianDetails profiles={profiles} setProfiles={setProfiles} submitting={submitting} />
          )}
        </div>

        {error && (
          <div className="mx-3 sm:mx-4 md:mx-6 mb-3 sm:mb-4 rounded-[10px] border border-[#FCD1D2] bg-[#FFF5F5] px-3 sm:px-4 py-2.5 sm:py-3 text-[12px] sm:text-[13px] text-[#C53030] flex-shrink-0">
            {error}
          </div>
        )}

        {/* Footer */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2 sm:gap-0 border-t border-[#EEEAF4] px-3 sm:px-4 md:px-6 py-3 sm:py-4 flex-shrink-0">
          <button
            onClick={closeAndReset}
            className="w-full sm:w-auto rounded-[10px] border border-[#EEEAF4] bg-white px-4 py-2.5 text-[14px] font-semibold text-[#6F6C90] hover:bg-[#F8F8F8] touch-manipulation"
            disabled={submitting}
          >
            Cancel
          </button>

          {step === 1 ? (
            <button
              onClick={() => setStep(2)}
              className="w-full sm:w-auto rounded-[10px] bg-[#3F205F] px-4 sm:px-5 py-2.5 text-[14px] font-semibold text-white hover:opacity-95 disabled:opacity-60 disabled:cursor-not-allowed touch-manipulation"
              disabled={submitting}
            >
              <span className="hidden sm:inline">Next: Technician Details</span>
              <span className="sm:hidden">Next</span>
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={submitting}
              className="w-full sm:w-auto rounded-[10px] bg-[#3F205F] px-4 sm:px-5 py-2.5 text-[14px] font-semibold text-white hover:opacity-95 disabled:opacity-60 disabled:cursor-not-allowed touch-manipulation"
            >
              {submitting ? (isEditMode ? "Updating..." : "Creating...") : isEditMode ? "Update Store" : "Add Store"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

/* ---------------------------------- Step 1 --------------------------------- */

function StoreDetails({
  store,
  setStore,
  submitting,
}: {
  store: StoreForm;
  setStore: (s: StoreForm) => void;
  submitting: boolean;
}) {
  return (
    <div className="space-y-3 sm:space-y-4">
      <Field label="Store Name" required>
        <Input
          value={store.storeName}
          onChange={(e) => setStore({ ...store, storeName: e.target.value })}
          placeholder="Tech Solutions Melbourne"
          disabled={submitting}
        />
      </Field>

      <Field label="Address" required>
        <Input
          value={store.address}
          onChange={(e) => setStore({ ...store, address: e.target.value })}
          placeholder="123 Collins Street, Melbourne VIC 3000"
          disabled={submitting}
        />
      </Field>

      <div className="grid grid-cols-1 gap-3 sm:gap-4 sm:grid-cols-2">
        <Field label="Operating Hours" required>
          <Input
            value={store.hours}
            onChange={(e) => setStore({ ...store, hours: e.target.value })}
            placeholder="Mon–Fri 9AM–6PM"
            disabled={submitting}
          />
        </Field>
        <Field label="Phone Number" required>
          <Input
            value={store.phone}
            onChange={(e) => setStore({ ...store, phone: e.target.value })}
            placeholder="(03) 9123 4567"
            disabled={submitting}
          />
        </Field>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:gap-4 sm:grid-cols-2">
        <Field label="Banner Video URL (Optional)">
          <Input
            value={store.bannerUrl}
            onChange={(e) => setStore({ ...store, bannerUrl: e.target.value })}
            placeholder="https://youtube.com/watch?v=…"
            disabled={submitting}
          />
        </Field>
        <Field label="Google Reviews Link">
          <Input
            value={store.googleLink}
            onChange={(e) => setStore({ ...store, googleLink: e.target.value })}
            placeholder="https://g.page/your-store"
            disabled={submitting}
          />
        </Field>
      </div>

      <Field label="Store Bio/Pitch">
        <TextArea
          rows={4}
          value={store.pitch}
          onChange={(e) => setStore({ ...store, pitch: e.target.value })}
          placeholder="Describe the store and its services…"
          disabled={submitting}
        />
      </Field>

      <Field label="Status">
        <div className="relative">
          <select
            value={store.status}
            onChange={(e) => setStore({ ...store, status: e.target.value as "Active" | "Inactive" })}
            className="w-full appearance-none rounded-[10px] border border-[#EEEAF4] bg-white px-3 py-2.5 text-[14px] text-[#0A0A0A] outline-none touch-manipulation"
            disabled={submitting}
          >
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
          <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#8E8AA3]">
            ▾
          </span>
        </div>
      </Field>
    </div>
  );
}

/* ---------------------------------- Step 2 --------------------------------- */

function TechnicianDetails({
  profiles,
  setProfiles,
  submitting,
}: {
  profiles: Technician[];
  setProfiles: (t: Technician[]) => void;
  submitting: boolean;
}) {
  const add = () =>
    setProfiles([
      ...profiles,
      {
        id: crypto.randomUUID(),
        fullName: "",
        roleTitle: "",
        years: "",
        specialties: "",
        videoUrl: "",
        bio: "",
        photoFile: null,
      },
    ]);

  const remove = (id: string) =>
    setProfiles(profiles.length > 1 ? profiles.filter((p) => p.id !== id) : profiles);

  const update = (id: string, patch: Partial<Technician>) =>
    setProfiles(
      profiles.map((p) => (p.id === id ? { ...p, ...patch } : p)),
    );

  return (
    <div className="space-y-4 sm:space-y-6">
      {profiles.map((p, idx) => (
        <div key={p.id} className="rounded-[10px] sm:rounded-[12px] border border-[#EEEAF4] p-3 sm:p-4">
          <div className="mb-3 flex items-center justify-between">
            <div className="text-[13px] sm:text-[14px] font-semibold text-[#0A0A0A]">
              Technician Profile {idx + 1}
            </div>
            <button
              onClick={() => remove(p.id!)}
              className="rounded-full p-1.5 text-[#E05252] hover:bg-[#FFF0F0] touch-manipulation flex-shrink-0"
              title="Remove"
              disabled={submitting}
              aria-label={`Remove technician ${idx + 1}`}
            >
              <span className="text-[16px] sm:text-[18px]">🗑</span>
            </button>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:gap-4 sm:grid-cols-2">
            <Field label="Full Name" required>
              <Input
                value={p.fullName}
                onChange={(e) => update(p.id!, { fullName: e.target.value })}
                placeholder="John Smith"
                disabled={submitting}
              />
            </Field>
            <Field label="Role/Title">
              <Input
                value={p.roleTitle || ""}
                onChange={(e) => update(p.id!, { roleTitle: e.target.value })}
                placeholder="Senior Technician"
                disabled={submitting}
              />
            </Field>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:gap-4 sm:grid-cols-2">
            <Field label="Years of Experience">
              <Input
                value={p.years || ""}
                onChange={(e) => update(p.id!, { years: e.target.value })}
                placeholder="8 years"
                disabled={submitting}
              />
            </Field>
            <Field label="Specialties (comma separated)">
              <Input
                value={p.specialties || ""}
                onChange={(e) => update(p.id!, { specialties: e.target.value })}
                placeholder="NBN Installation, Business Networks, Troubleshooting"
                disabled={submitting}
              />
            </Field>
          </div>

          <Field label="Introduction Video URL">
            <Input
              value={p.videoUrl || ""}
              onChange={(e) => update(p.id!, { videoUrl: e.target.value })}
              placeholder="https://youtube.com/watch?v=…"
              disabled={submitting}
            />
          </Field>

          <Field label="Bio/Introduction">
            <TextArea
              rows={4}
              value={p.bio || ""}
              onChange={(e) => update(p.id!, { bio: e.target.value })}
              placeholder="Describe the technician's background and expertise…"
              disabled={submitting}
            />
          </Field>
        </div>
      ))}

      <button
        onClick={add}
        disabled={submitting}
        className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-[10px] border border-[#EEEAF4] bg-white px-4 py-2.5 text-[13px] sm:text-[14px] font-semibold text-[#3F205F] hover:bg-[#F4F1F9] disabled:opacity-50 disabled:cursor-not-allowed touch-manipulation"
      >
        ＋ Add more technicians
      </button>
    </div>
  );
}

/* ------------------------------- UI Primitives ------------------------------ */

function Field({
  label,
  children,
  required,
}: {
  label: string;
  children: React.ReactNode;
  required?: boolean;
}) {
  return (
    <label className="block">
      <div className="mb-1.5 text-[11px] sm:text-[12px] font-semibold text-[#6F6C90]">
        {label}
        {required && <span className="ml-1 text-[#E0342F]">*</span>}
      </div>
      {children}
    </label>
  );
}

function Input(
  props: React.InputHTMLAttributes<HTMLInputElement>,
) {
  return (
    <input
      {...props}
      className={[
        "w-full rounded-[8px] sm:rounded-[10px] border border-[#EEEAF4] bg-white px-3 py-2.5 text-[14px] text-[#0A0A0A] outline-none",
        "placeholder:text-[#8E8AA3] touch-manipulation",
        "focus:border-[#3F205F] focus:ring-1 focus:ring-[#3F205F]",
        props.disabled ? "opacity-50 cursor-not-allowed" : "",
        props.className || "",
      ].join(" ")}
    />
  );
}

function TextArea(
  props: React.TextareaHTMLAttributes<HTMLTextAreaElement>,
) {
  return (
    <textarea
      {...props}
      className={[
        "w-full rounded-[8px] sm:rounded-[10px] border border-[#EEEAF4] bg-white px-3 py-2.5 text-[14px] text-[#0A0A0A] outline-none resize-y",
        "placeholder:text-[#8E8AA3] touch-manipulation",
        "focus:border-[#3F205F] focus:ring-1 focus:ring-[#3F205F]",
        props.disabled ? "opacity-50 cursor-not-allowed" : "",
        props.className || "",
      ].join(" ")}
    />
  );
}
