"use client";

import { useState } from "react";

type Technician = {
  id: string;
  fullName: string;
  roleTitle: string;
  years: string;
  specialties: string;
  videoUrl: string;
  bio: string;
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
  uploads: File[];
};

export default function AddStoreWizard({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [step, setStep] = useState<1 | 2>(1);

  // Step 1 state
  const [store, setStore] = useState<StoreForm>({
    storeName: "",
    address: "",
    hours: "",
    phone: "",
    googleLink: "",
    bannerUrl: "",
    pitch: "",
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

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/30 p-4">
      <div className="w-full max-w-[820px] rounded-[14px] bg-white shadow-2xl">
        {/* Header with tabs */}
        <div className="flex items-center justify-between border-b border-[#EEEAF4] px-6 py-5">
          <h2 className="text-[20px] font-bold text-[#0A0A0A]">Add Partner Store</h2>
          <button
            onClick={closeAndReset}
            className="rounded-full p-1.5 text-[#E05252] hover:bg-[#FFF0F0]"
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        <div className="flex items-center justify-center gap-2 px-6 pt-4">
          <button
            onClick={() => setStep(1)}
            className={[
              "w-full rounded-[8px] px-3 py-2 text-[14px] font-semibold",
              step === 1 ? "bg-[#F4F1F9] text-[#3F205F]" : "bg-[#F7F7FA] text-[#6F6C90]",
            ].join(" ")}
          >
            Store Details
          </button>
          <button
            onClick={() => setStep(2)}
            className={[
              "w-full rounded-[8px] px-3 py-2 text-[14px] font-semibold",
              step === 2 ? "bg-[#F4F1F9] text-[#3F205F]" : "bg-[#F7F7FA] text-[#6F6C90]",
            ].join(" ")}
          >
            Technician Details
          </button>
        </div>

        {/* Body */}
        <div className="max-h-[72vh] overflow-y-auto px-6 py-5">
          {step === 1 ? (
            <StoreDetails store={store} setStore={setStore} />
          ) : (
            <TechnicianDetails profiles={profiles} setProfiles={setProfiles} />
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-[#EEEAF4] px-6 py-4">
          <button
            onClick={closeAndReset}
            className="rounded-[10px] border border-[#EEEAF4] bg-white px-4 py-2.5 text-[14px] font-semibold text-[#6F6C90]"
          >
            Cancel
          </button>

          {step === 1 ? (
            <button
              onClick={() => setStep(2)}
              className="rounded-[10px] bg-[#3F205F] px-5 py-2.5 text-[14px] font-semibold text-white"
            >
              Add Store
            </button>
          ) : (
            <button
              onClick={() => {
                // Submit aggregate payload
                // You can replace this with an action or API call.
                // eslint-disable-next-line no-console
                console.log({ store, profiles });
                closeAndReset();
              }}
              className="rounded-[10px] bg-[#3F205F] px-5 py-2.5 text-[14px] font-semibold text-white"
            >
              Add Technician
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
}: {
  store: {
    storeName: string;
    address: string;
    hours: string;
    phone: string;
    googleLink: string;
    bannerUrl: string;
    pitch: string;
    uploads: File[];
  };
  setStore: (s: any) => void;
}) {
  return (
    <div className="space-y-4">
      <Field label="Store Name">
        <Input
          value={store.storeName}
          onChange={(e) => setStore({ ...store, storeName: e.target.value })}
          placeholder="Tech Solutions Melbourne"
        />
      </Field>

      <Field label="Address">
        <Input
          value={store.address}
          onChange={(e) => setStore({ ...store, address: e.target.value })}
          placeholder="123 Collins Street, Melbourne VIC 3000"
        />
      </Field>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <Field label="Operating Hours">
          <Input
            value={store.hours}
            onChange={(e) => setStore({ ...store, hours: e.target.value })}
            placeholder="Mon–Fri 9AM–6PM"
          />
        </Field>
        <Field label="Phone Number">
          <Input
            value={store.phone}
            onChange={(e) => setStore({ ...store, phone: e.target.value })}
            placeholder="(03) 9123 4567"
          />
        </Field>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <Field label="Banner Video URL (Optional)">
          <Input
            value={store.bannerUrl}
            onChange={(e) => setStore({ ...store, bannerUrl: e.target.value })}
            placeholder="https://youtube.com/watch?v=…"
          />
        </Field>
        <Field label="Google Reviews Link">
          <Input
            value={store.googleLink}
            onChange={(e) => setStore({ ...store, googleLink: e.target.value })}
            placeholder="https://g.page/your-store"
          />
        </Field>
      </div>

      <Field label="Store Bio/Pitch">
        <TextArea
          rows={4}
          value={store.pitch}
          onChange={(e) => setStore({ ...store, pitch: e.target.value })}
          placeholder="Describe the technician’s background and expertise…"
        />
      </Field>

      <Field label="Upload Images">
        <DropZone
          onFiles={(files) => setStore({ ...store, uploads: files })}
          hint="Drop your files here or browse"
        />
      </Field>
    </div>
  );
}

/* ---------------------------------- Step 2 --------------------------------- */

function TechnicianDetails({
  profiles,
  setProfiles,
}: {
  profiles: Technician[];
  setProfiles: (t: Technician[]) => void;
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
    <div className="space-y-6">
      {profiles.map((p, idx) => (
        <div key={p.id} className="rounded-[12px] border border-[#EEEAF4] p-4">
          <div className="mb-3 flex items-center justify-between">
            <div className="text-[14px] font-semibold text-[#0A0A0A]">
              Technician Profiles {idx + 1}
            </div>
            <button
              onClick={() => remove(p.id)}
              className="rounded-full p-1.5 text-[#E05252] hover:bg-[#FFF0F0]"
              title="Remove"
            >
              🗑
            </button>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <Field label="Full Name">
              <Input
                value={p.fullName}
                onChange={(e) => update(p.id, { fullName: e.target.value })}
                placeholder="John Smith"
              />
            </Field>
            <Field label="Role/Title">
              <Input
                value={p.roleTitle}
                onChange={(e) => update(p.id, { roleTitle: e.target.value })}
                placeholder="Senior Technician"
              />
            </Field>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <Field label="Years of Experience">
              <Input
                value={p.years}
                onChange={(e) => update(p.id, { years: e.target.value })}
                placeholder="8 years"
              />
            </Field>
            <Field label="Specialties (comma separated)">
              <Input
                value={p.specialties}
                onChange={(e) => update(p.id, { specialties: e.target.value })}
                placeholder="NBN Installation, Business Networks, Troubleshooting"
              />
            </Field>
          </div>

          <Field label="Introduction Video URL">
            <Input
              value={p.videoUrl}
              onChange={(e) => update(p.id, { videoUrl: e.target.value })}
              placeholder="https://youtube.com/watch?v=…"
            />
          </Field>

          <Field label="Bio/Introduction">
            <TextArea
              rows={4}
              value={p.bio}
              onChange={(e) => update(p.id, { bio: e.target.value })}
              placeholder="Describe the technician’s background and expertise…"
            />
          </Field>

          <Field label="Technician Photo (optional)">
            <PhotoInput
              onFile={(file) => update(p.id, { photoFile: file })}
              filename={p.photoFile?.name}
            />
          </Field>
        </div>
      ))}

      <button
        onClick={add}
        className="inline-flex items-center gap-2 rounded-[10px] border border-[#EEEAF4] bg-white px-4 py-2.5 text-[14px] font-semibold text-[#3F205F]"
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
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <div className="mb-1.5 text-[12px] font-semibold text-[#6F6C90]">{label}</div>
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
        "w-full rounded-[10px] border border-[#EEEAF4] bg-white px-3 py-2.5 text-[14px] text-[#0A0A0A] outline-none",
        "placeholder:text-[#8E8AA3]",
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
        "w-full rounded-[10px] border border-[#EEEAF4] bg-white px-3 py-2.5 text-[14px] text-[#0A0A0A] outline-none",
        "placeholder:text-[#8E8AA3]",
        props.className || "",
      ].join(" ")}
    />
  );
}

function DropZone({
  onFiles,
  hint,
}: {
  onFiles: (files: File[]) => void;
  hint?: string;
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-[10px] border border-dashed border-[#D9D4E3] bg-[#FBFAFD] px-4 py-8 text-center text-[14px] text-[#6F6C90]">
      <svg width="28" height="28" viewBox="0 0 24 24" className="mb-2" fill="none">
        <path d="M12 16V8M8 12h8" stroke="#6F6C90" strokeWidth="1.5" strokeLinecap="round" />
        <rect x="3" y="3" width="18" height="18" rx="4" stroke="#D1CBDE" strokeWidth="1.5" />
      </svg>
      <span>{hint || "Drop files here"}</span>
      <input
        type="file"
        multiple
        className="mt-3"
        onChange={(e) => onFiles(Array.from(e.target.files || []))}
      />
    </div>
  );
}

function PhotoInput({
  onFile,
  filename,
}: {
  onFile: (file: File | null) => void;
  filename?: string;
}) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#F4F1F9] text-[#7F5DA9]">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="10" r="3" stroke="currentColor" strokeWidth="1.5" />
          <path d="M5 20c1.8-4 6.2-5 8-5s6.2 1 8 5" stroke="currentColor" strokeWidth="1.5" />
        </svg>
      </div>
      <label className="rounded-[10px] border border-[#EEEAF4] px-3 py-2 text-[14px] font-semibold text-[#3F205F]">
        <input
          type="file"
          className="hidden"
          onChange={(e) => onFile(e.target.files?.[0] || null)}
          accept="image/*"
        />
        Upload Photo
      </label>
      <span className="text-[12px] text-[#6F6C90]">{filename || "No file chosen"}</span>
    </div>
  );
}
