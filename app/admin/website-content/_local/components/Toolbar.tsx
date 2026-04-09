"use client";

export default function Toolbar({
  query,
  onQuery,
}: {
  query: string;
  onQuery: (v: string) => void;
}) {
  return (
    <div className="mb-4">
      <div className="flex w-full max-w-[380px] items-center gap-3 rounded-[10px] border border-[#DFDBE3] bg-white px-4 py-3">
        <svg width="18" height="18" viewBox="0 0 20 21" fill="none">
          <path
            d="M9.6 18c4.4 0 8-3.6 8-8s-3.6-8-8-8-8 3.6-8 8 3.6 8 8 8Z"
            stroke="#292D32"
            strokeWidth="1.5"
          />
          <path
            d="m18.3 18.8-1.7-1.7"
            stroke="#292D32"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </svg>
        <input
          value={query}
          onChange={(e) => onQuery(e.target.value)}
          placeholder="Search pages…"
          className="w-full bg-transparent text-[14px] text-[#0A0A0A] placeholder-[#6F6C90] outline-none"
        />
      </div>
    </div>
  );
}
