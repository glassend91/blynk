"use client";

import { useState } from "react";
import AddStoreWizard from "./_local/components/AddStoreModal";

type StoreRow = {
  id: number;
  name: string;
  address: string;
  hours: string;
  phone: string;
  technicians: string;
  status: "Active" | "Inactive";
};

const rows: StoreRow[] = [
  {
    id: 1,
    name: "TechConnect Brisbane",
    address: "123 Queen St, Brisbane QLD 4000",
    hours: "Mon–Fri 9am–5pm",
    phone: "(07) 3123 4567",
    technicians: "John Smith, Mark ductle… +2",
    status: "Active",
  },
  {
    id: 2,
    name: "Network Solutions Sydney",
    address: "Ideal for streaming and working from home",
    hours: "Mon–Fri 9am–5pm",
    phone: "100/20 Mbps",
    technicians: "John Smith, Mark ductle… +2",
    status: "Inactive",
  },
];

function StatCard({
  label,
  value,
  sub,
  rightIcon,
}: {
  label: string;
  value: string;
  sub: string;
  rightIcon?: React.ReactNode;
}) {
  return (
    <div className="rounded-[12px] border border-[#EEEAF4] bg-white px-6 py-5 shadow-[0_1px_0_#F1EDF7]">
      <div className="flex items-center justify-between">
        <div className="text-[14px] font-semibold text-[#0A0A0A]">{label}</div>
        <div className="text-[#7F5DA9]">{rightIcon}</div>
      </div>
      <div className="mt-2 text-[28px] font-bold text-[#0A0A0A]">{value}</div>
      <div className="mt-1 text-[12px] text-[#6F6C90]">{sub}</div>
    </div>
  );
}

export default function TechnicianNetworkPage() {
  const [open, setOpen] = useState(false);

  return (
    <div className="mx-auto w-full max-w-[1686px] p-[30px]">
      {/* Page title + CTA */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-[26px] font-bold text-[#0A0A0A]">Technician Network</h1>
          <p className="mt-1 text-[14px] text-[#6F6C90]">
            Manage partner stores and technician profiles
          </p>
        </div>
        <button
          onClick={() => setOpen(true)}
          className="rounded-[10px] bg-[#3F205F] px-5 py-2.5 text-[14px] font-semibold text-white"
        >
          Add Store
        </button>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
        <StatCard
          label="All Technician"
          value="20"
          sub="All Technician"
          rightIcon={
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="7.5" r="3.5" stroke="#7F5DA9" strokeWidth="1.5" />
              <path
                d="M4 20c2-4.5 6-6 8-6s6 1.5 8 6"
                stroke="#7F5DA9"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
          }
        />
        <StatCard
          label="Active Local Store"
          value="10"
          sub="From last month"
          rightIcon={
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
              <rect x="4" y="4" width="16" height="16" rx="4" stroke="#7F5DA9" strokeWidth="1.5" />
              <path d="M9 13l2 2 4-4" stroke="#7F5DA9" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          }
        />
        <StatCard
          label="Inactive Local Store"
          value="05"
          sub="From last month"
          rightIcon={
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
              <rect x="4" y="4" width="16" height="16" rx="4" stroke="#7F5DA9" strokeWidth="1.5" />
              <path d="M9 9l6 6M15 9l-6 6" stroke="#7F5DA9" strokeWidth="1.5" />
            </svg>
          }
        />
      </div>

      {/* Search + filter */}
      <div className="mt-7 rounded-[12px] border border-[#EEEAF4] bg-white p-6">
        <div className="mb-4 grid grid-cols-1 gap-3 md:grid-cols-2">
          <div className="relative">
            <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#8E8AA3]">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="1.5" />
                <path d="M20 20l-3-3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </span>
            <input
              className="w-full rounded-[10px] border border-[#EEEAF4] bg-white px-10 py-2.5 text-[14px] text-[#0A0A0A] outline-none placeholder:text-[#8E8AA3]"
              placeholder="Search local store…"
            />
          </div>
          <div className="relative">
            <select className="w-full appearance-none rounded-[10px] border border-[#EEEAF4] bg-white px-3 py-2.5 text-[14px] text-[#0A0A0A] outline-none">
              <option>All Type</option>
              <option>NBN</option>
              <option>Mobile</option>
            </select>
            <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#8E8AA3]">
              ▾
            </span>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-[14px]">
            <thead>
              <tr className="text-[#6F6C90]">
                <th className="border-b border-[#EEEAF4] px-4 py-3 font-semibold">#</th>
                <th className="border-b border-[#EEEAF4] px-4 py-3 font-semibold">Local Store Name</th>
                <th className="border-b border-[#EEEAF4] px-4 py-3 font-semibold">Address</th>
                <th className="border-b border-[#EEEAF4] px-4 py-3 font-semibold">Open Hours</th>
                <th className="border-b border-[#EEEAF4] px-4 py-3 font-semibold">Phone</th>
                <th className="border-b border-[#EEEAF4] px-4 py-3 font-semibold">Technician</th>
                <th className="border-b border-[#EEEAF4] px-4 py-3 font-semibold">Status</th>
                <th className="border-b border-[#EEEAF4] px-4 py-3 font-semibold">ACTION</th>
              </tr>
            </thead>
            <tbody className="text-[#0A0A0A]">
              {rows.map((r) => (
                <tr key={r.id} className="hover:bg-[#FAF9FC]">
                  <td className="border-b border-[#F0EDF5] px-4 py-3">{r.id}</td>
                  <td className="border-b border-[#F0EDF5] px-4 py-3">{r.name}</td>
                  <td className="border-b border-[#F0EDF5] px-4 py-3">{r.address}</td>
                  <td className="border-b border-[#F0EDF5] px-4 py-3">{r.hours}</td>
                  <td className="border-b border-[#F0EDF5] px-4 py-3">{r.phone}</td>
                  <td className="border-b border-[#F0EDF5] px-4 py-3 text-[#401B60] underline-offset-2 hover:underline">
                    {r.technicians}
                  </td>
                  <td className="border-b border-[#F0EDF5] px-4 py-3">
                    {r.status === "Active" ? (
                      <span className="text-[#0F9D58]">Active</span>
                    ) : (
                      <span className="text-[#E05252]">Inactive</span>
                    )}
                  </td>
                  <td className="border-b border-[#F0EDF5] px-4 py-3">
                    <div className="flex items-center gap-4 text-[#6F6C90]">
                      <button title="Edit">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                          <path d="M4 15.5V20h4.5L20 8.5 15.5 4 4 15.5Z" stroke="currentColor" strokeWidth="1.5" />
                        </svg>
                      </button>
                      <button title="Delete" className="text-[#E05252]">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                          <path d="M6 7h12M9 7V5h6v2M8 7v12h8V7" stroke="currentColor" strokeWidth="1.5" />
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Wizard */}
      <AddStoreWizard open={open} onClose={() => setOpen(false)} />
    </div>
  );
}
