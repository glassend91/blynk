"use client";

import type { PartnerStore } from "../types";
import Star from "./Star";

export default function StoreCard({
  store,
  onEdit,
  onView,
}: {
  store: PartnerStore;
  onEdit: () => void;
  onView: () => void;
}) {
  return (
    <article className="rounded-[12px] border border-[#E7E4EC] bg-white p-6 shadow-[0_10px_24px_rgba(17,24,39,0.06)]">
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div className="min-w-0">
          <h3 className="text-[16px] font-semibold text-[#0A0A0A]">
            {store.name}
          </h3>

          <div className="mt-2 space-y-1 text-[14px]">
            <p>
              <span className="font-semibold">Address:</span>{" "}
              <span className="text-[#0A0A0A]">{store.address}</span>
            </p>
            <p>
              <span className="font-semibold">Hours:</span>{" "}
              <span className="text-[#0A0A0A]">{store.hours}</span>
            </p>
            <p>
              <span className="font-semibold">Phone:</span>{" "}
              <span className="text-[#0A0A0A]">{store.phone}</span>
            </p>
          </div>
        </div>

        <div className="w-full md:w-auto">
          <div className="flex items-center gap-2">
            <span className="text-[14px] font-semibold text-[#0A0A0A]">
              Rating:
            </span>
            <Star />
            <span className="text-[14px] text-[#0A0A0A]">{store.rating}/5</span>
          </div>

          <div className="mt-2 text-[14px]">
            <span className="font-semibold">Reviews:</span>{" "}
            <button
              onClick={onView}
              className="text-[#401B60] underline underline-offset-2"
            >
              View Google Reviews
            </button>
          </div>
        </div>

        <div className="flex items-start gap-2 md:min-w-[170px]">
          <button
            onClick={onEdit}
            className="rounded-[8px] border border-[#DFDBE3] px-4 py-2 text-[13px] font-semibold text-[#0A0A0A]"
          >
            Edit
          </button>
          <button
            onClick={onView}
            className="rounded-[8px] border border-[#DFDBE3] px-4 py-2 text-[13px] font-semibold text-[#401B60]"
          >
            View Profile
          </button>
        </div>
      </div>
    </article>
  );
}
