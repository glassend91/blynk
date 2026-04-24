"use client";

import { createPortal } from "react-dom";
import { useEffect, useMemo, useState } from "react";
import dynamic from "next/dynamic";
import apiClient from "@/lib/apiClient";

const LeafletMap = dynamic(() => import("./LeafletMap"), { ssr: false });

type Location = {
  id: string;
  name: string;
  address: string;
  hours: string;
  phone: string;
  rating: number;
  ratingCount: number;
  lat?: number;
  lng?: number;
  photo: string;
};

type Props = { open: boolean; onClose: () => void };

export default function FindLocalSupportModal({ open, onClose }: Props) {
  const [locations, setLocations] = useState<Location[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [focused, setFocused] = useState<Location | null>(null);
  const [hoverId, setHoverId] = useState<string | null>(null);

  useEffect(() => {
    if (open) {
      fetchLocations();
    } else {
      setQuery("");
      setFocused(null);
      setHoverId(null);
      setError(null);
    }
  }, [open]);

  const fetchLocations = async () => {
    try {
      setLoading(true);
      setError(null);
      const { data } = await apiClient.get("stores");
      if (data?.success && data.data) {
        const mapped: Location[] = data.data.map((s: any) => ({
          id: s.id,
          name: s.name,
          address: s.address,
          hours: s.hours,
          phone: s.phone,
          rating: 5.0,
          ratingCount: Math.floor(Math.random() * 50) + 10,
          lat: s.lat,
          lng: s.lng,
          status: s.status,
          photo: s.bannerUrl || "https://images.unsplash.com/photo-1526948128573-703ee1aeb6fa?q=80&w=800&auto=format&fit=crop",
        })).filter((l: any) => l.status === "Active");
        setLocations(mapped);
      }
    } catch (err: any) {
      console.error("Failed to fetch locations:", err);
      setError(err?.message || "Failed to load technicians. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const filtered = useMemo(() => {
    if (!query.trim()) return locations;
    const q = query.toLowerCase();
    return locations.filter(
      (l) =>
        l.name.toLowerCase().includes(q) ||
        l.address.toLowerCase().includes(q),
    );
  }, [query, locations]);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (open) {
      const scrollY = window.scrollY;
      document.body.style.position = "fixed";
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = "100%";
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.position = "";
        document.body.style.top = "";
        document.body.style.width = "";
        document.body.style.overflow = "";
        window.scrollTo(0, scrollY);
      };
    }
  }, [open]);

  if (!open) return null;

  return createPortal(
    <div
      className="fixed z-[100]"
      style={{
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        margin: 0,
        padding: 0,
        width: "100vw",
        height: "100vh",
        overflow: "auto",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        className="fixed bg-black/50"
        onClick={onClose}
        style={{
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          width: "100vw",
          height: "100vh",
          zIndex: 100,
        }}
      />
      <div
        className="fixed z-[101] mx-3 w-full max-w-[1120px] rounded-2xl bg-white shadow-xl h-[80vh] overflow-auto noscrollbar"
        style={{
          left: "50%",
          top: "50%",
          transform: "translate(-50%, -50%)",
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between gap-4 border-b border-[#EEEAF4] px-6 py-5">
          <div className="flex items-center gap-3">
            <div className="grid h-9 w-9 place-items-center rounded-full bg-[#F1EAF8] text-[#3F205F]">
              📍
            </div>
            <div>
              <div className="text-[22px] font-bold">Find Local Support</div>
              <div className="text-[12px] text-[#6F6C90]">
                Search for certified technicians and repair services near you.
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-full p-2 text-[#6F6C90] hover:bg-[#F4F3F7]"
          >
            ✕
          </button>
        </div>

        {/* Search */}
        <div className="flex items-center gap-3 px-6 py-4">
          <div className="relative w-full">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full rounded-lg border border-[#E8E6ED] px-3 py-2 pl-9"
              placeholder="Enter store name, address or postcode…"
            />
            <span className="absolute left-3 top-2.5 text-[#8E8AA3]">🔎</span>
          </div>
        </div>

        {/* Body */}
        <div className="grid gap-6 px-6 pb-6 md:grid-cols-[360px,1fr] ">
          {/* Nearby list */}
          <div className="rounded-xl border border-[#EEEAF4] bg-[#FBFAFD] p-4 h-[520px] overflow-y-auto noscrollbar">
            <div className="mb-3 flex items-center justify-between text-[14px] font-semibold">
              <span>{query ? `Search Results (${filtered.length})` : "Nearby Technicians"}</span>
              <span className="text-[10px] text-[#8E8AA3]">Total: {locations.length}</span>
            </div>
            
            {error && (
              <div className="mb-4 rounded-lg bg-red-50 p-3 text-xs text-red-600">
                {error}
              </div>
            )}

            <div className="space-y-3">
              {filtered.map((l) => (
                <button
                  key={l.id}
                  onClick={() => setFocused(l)}
                  onMouseEnter={() => setHoverId(l.id)}
                  onMouseLeave={() => setHoverId(null)}
                  className={`flex w-full gap-3 rounded-xl border px-3 py-3 text-left transition ${
                    focused?.id === l.id || hoverId === l.id
                      ? "border-[#D7CCE8] bg-white shadow-sm"
                      : "border-transparent bg-white"
                  }`}
                >
                  <img
                    src={l.photo}
                    className="h-[66px] w-[88px] rounded-lg object-cover"
                    alt=""
                  />
                  <div className="min-w-0">
                    <div className="truncate text-[14px] font-semibold">
                      {l.name}
                    </div>
                    <div className="truncate text-[12px] text-[#6F6C90]">
                      {l.address}
                    </div>
                    <div className="flex items-center gap-2 text-[12px] text-[#6F6C90]">
                      ⭐ {l.rating}/5 • {l.phone}
                    </div>
                  </div>
                </button>
              ))}
              {filtered.length === 0 && (
                <div className="text-center py-10 text-[#6F6C90] text-sm">
                  No stores found.
                </div>
              )}
            </div>
          </div>

          {/* Map panel */}
          <div className="relative overflow-hidden rounded-xl border border-[#EEEAF4] h-[520px] z-0">
            <LeafletMap 
              locations={filtered} 
              focused={focused} 
              onMarkerClick={(loc) => setFocused(loc)} 
            />
          </div>
        </div>

        {/* Store drawer modal (full details) */}
        {focused && (
          <div className="px-6 pb-6">
            <div className="rounded-2xl border border-[#EEEAF4] p-4">
              <div className="mb-2 flex items-center justify-between">
                <div className="text-[16px] font-semibold">{focused.name}</div>
                <button className="rounded-lg bg-[#3F205F] px-3 py-1.5 text-[13px] font-semibold text-white">
                  Contact
                </button>
              </div>
              <div className="text-[13px] text-[#6F6C90]">
                {focused.address}
              </div>
              <div className="mt-3 grid gap-4 md:grid-cols-[1.3fr,1fr]">
                <img
                  src={focused.photo}
                  className="h-[220px] w-full rounded-lg object-cover"
                  alt=""
                />
                <div className="space-y-3">
                  <div>
                    <div className="text-[12px] font-semibold text-[#6F6C90]">
                      Store Details
                    </div>
                    <p className="text-[13px] text-[#0A0A0A]">
                      Expert technicians specialising in Blynk IoT solutions. 
                      We provide comprehensive support for smart-home & industrial IoT needs.
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <a
                      href="#"
                      className="inline-flex items-center gap-2 rounded-lg border border-[#EEEAF4] px-3 py-2 text-[13px] hover:bg-[#FBFAFD]"
                    >
                      ⭐ View Google reviews
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>,
    document.body,
  );
}
