"use client";

export default function StarRating({ value }: { value: number }) {
  const n = Math.max(0, Math.min(5, Math.round(value)));
  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: 5 }).map((_, i) => (
        <svg
          key={i}
          width="18"
          height="18"
          viewBox="0 0 24 24"
          className={i < n ? "text-[#F5C948]" : "text-[#E0DCE6]"}
          fill="currentColor"
        >
          <path d="M12 17.27 18.18 21l-1.64-7.03L22 9.24l-7.19-.62L12 2 9.19 8.62 2 9.24l5.46 4.73L5.82 21 12 17.27Z" />
        </svg>
      ))}
    </div>
  );
}
