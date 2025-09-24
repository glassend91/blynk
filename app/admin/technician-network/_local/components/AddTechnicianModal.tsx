"use client";

import { useEffect, useState } from "react";

export default function AddTechnicianModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [years, setYears] = useState("");
  const [skills, setSkills] = useState("");
  const [video, setVideo] = useState("");
  const [bio, setBio] = useState("");

  useEffect(() => {
    if (!open) {
      setName("");
      setRole("");
      setYears("");
      setSkills("");
      setVideo("");
      setBio("");
    }
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/70" onClick={onClose} />
      <div className="absolute left-1/2 top-1/2 w-[880px] -translate-x-1/2 -translate-y-1/2 rounded-[14px] bg-white p-6 shadow-2xl">
        <div className="mb-1 flex items-center justify-between">
          <h2 className="text-[24px] font-extrabold text-[#0A0A0A]">Add Technician Profile</h2>
          <button
            onClick={onClose}
            className="grid h-7 w-7 place-items-center rounded-full bg-[#FFF0F0] text-[#E0342F]"
            aria-label="Close"
          >
            ×
          </button>
        </div>

        <p className="text-[14px] text-[#6F6C90]">
          Add a new technician profile to showcase on the network map.
        </p>

        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <Field label="Full Name">
            <input value={name} onChange={(e) => setName(e.target.value)} placeholder="John Smith" className="field" />
          </Field>

          <Field label="Role/Title">
            <input value={role} onChange={(e) => setRole(e.target.value)} placeholder="Senior Technician" className="field" />
          </Field>

          <Field label="Years of Experience">
            <input value={years} onChange={(e) => setYears(e.target.value)} placeholder="8 years" className="field" />
          </Field>

          <div className="md:col-span-2">
            <Field label="Specialties (comma separated)">
              <input value={skills} onChange={(e) => setSkills(e.target.value)} placeholder="NBN Installation, Business Networks, Troubleshooting" className="field" />
            </Field>
          </div>

          <div className="md:col-span-2">
            <Field label="Introduction Video URL">
              <input value={video} onChange={(e) => setVideo(e.target.value)} placeholder="https://youtube.com/watch?v=…" className="field" />
            </Field>
          </div>

          <div className="md:col-span-2">
            <Field label="Bio/Introduction">
              <textarea rows={4} value={bio} onChange={(e) => setBio(e.target.value)} placeholder="Describe the technician’s background and expertise…" className="field" />
            </Field>
          </div>
        </div>

        <div className="mt-6 flex items-center justify-between gap-3">
          <button onClick={onClose} className="h-[44px] flex-1 rounded-[10px] border border-[#DFDBE3] bg-[#F8F8F8] text-[14px] font-semibold text-[#6F6C90]">
            Cancel
          </button>
          <button onClick={onClose} className="h-[44px] flex-1 rounded-[10px] bg-[#401B60] text-[14px] font-semibold text-white">
            Add Technician
          </button>
        </div>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="mb-1 block text-[13px] font-medium text-[#0A0A0A]">{label}</label>
      {children}
    </div>
  );
}
