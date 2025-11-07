"use client";

import ModalShell from "@/components/shared/ModalShell";

export default function StaticIPInfoModal({ onClose }: { onClose: () => void }) {
  return (
    <ModalShell onClose={onClose} size="narrow" showClose={true}>
      <div className="relative">
        <h3 className="text-[30px] font-extrabold text-[var(--cl-brand-ink)] pr-12">Static IP Address Benefits</h3>

        <ul className="mt-5 space-y-5">
          {[
            ["Home Servers", "Perfect for running your own web or file server"],
            ["Remote Access", "Access your home network from anywhere"],
            ["Better Gaming Experience", "Improved online gaming performance"],
          ].map(([t, s]) => (
            <li key={t} className="flex items-start gap-3">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" className="mt-0.5">
                <circle cx="12" cy="12" r="10" stroke="#3EB164" />
                <path d="M7.5 12.5l2.5 2.5 6-6" stroke="#3EB164" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <div>
                <div className="text-[18px] font-semibold text-[#1A1531]">{t}</div>
                <div className="text-[15px] text-[var(--cl-sub)]">{s}</div>
              </div>
            </li>
          ))}
        </ul>

        {/* Additional Close Button at the bottom for better visibility */}
        <div className="mt-8 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="inline-flex items-center gap-2 rounded-lg border border-[#401B60] bg-white px-6 py-2.5 text-[#401B60] font-semibold hover:bg-[#401B60] hover:text-white transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </ModalShell>
  );
}
