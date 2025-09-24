"use client";

import StarRating from "./StarRating";
import type { Testimonial } from "../types";

export default function TestimonialCard({
  t,
  onEdit,
  onDelete,
}: {
  t: Testimonial;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const date = new Date(t.createdAt);
  const dateStr = date.toLocaleDateString(undefined, {
    year: "numeric",
    month: "numeric",
    day: "numeric",
  });

  return (
    <article className="rounded-[12px] border border-[#E7E4EC] bg-white p-6 shadow-[0_10px_24px_rgba(17,24,39,0.06)]">
      <div className="flex items-start justify-between">
        <div className="min-w-0">
          <h3 className="text-[16px] font-semibold text-[#0A0A0A]">{t.name}</h3>
          <p className="text-[13px] text-[#6F6C90]">{t.location}</p>
          <div className="mt-2">
            <StarRating value={t.rating} />
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onEdit}
            className="text-[#4A4B57] hover:text-[#2B2C34]"
            aria-label="Edit"
            title="Edit"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25Z" stroke="currentColor" strokeWidth="1.5" />
            </svg>
          </button>
          <button
            onClick={onDelete}
            className="text-[#E0342F] hover:text-[#B82723]"
            aria-label="Delete"
            title="Delete"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M6 7h12M9 7V6a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v1M9 11v6M12 11v6M15 11v6M5 7l1 13a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2l1-13" stroke="currentColor" strokeWidth="1.5" />
            </svg>
          </button>
        </div>
      </div>

      <blockquote className="mt-4 border-l-4 border-[#6F49A3] pl-4 italic text-[#0A0A0A]">
        “{t.quote}”
      </blockquote>

      <p className="mt-3 text-[13px] text-[#6F6C90]">Added on {dateStr}</p>
    </article>
  );
}
