"use client";

export default function BsmHeaderBanner() {
  return (
    <div
      className="rounded-2xl border px-5 py-4 sm:px-6"
      style={{ background: "#FBF7FF", borderColor: "rgba(79,28,118,.16)" }}
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <div className="grid h-10 w-10 place-items-center rounded-full bg-[#4F1C76] text-white">
            {/* headset */}
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
              <path d="M12 3a7 7 0 0 0-7 7v3a3 3 0 0 0 3 3v5h4v-4h2v4h4v-5a3 3 0 0 0 3-3v-3a7 7 0 0 0-7-7z" />
            </svg>
          </div>
          <div>
            <div className="text-[15px] font-medium text-[#111827]">
              Having trouble or have a question? Our team is here to help.
            </div>
            <div className="text-sm text-[#6B7280]">
              Call us on <span className="font-semibold">(02) 8123 4567</span> or request a callback.
            </div>
          </div>
        </div>
        <div className="flex gap-3">
          <button
            className="rounded-[12px] border px-4 py-2 font-semibold text-[#4F1C76]"
            style={{ borderColor: "rgba(79,28,118,.16)" }}
          >
            Contact Us
          </button>
          <button className="rounded-[12px] bg-[#4F1C76] px-4 py-2 font-semibold text-white">Call Now</button>
        </div>
      </div>
    </div>
  );
}
