"use client";

import { createPortal } from "react-dom";
import { useEffect, useMemo, useState } from "react";

type Location = {
  id: string;
  name: string;
  address: string;
  hours: string;
  phone: string;
  rating: number;
  ratingCount: number;
  // normalized 0..1 for demo pin positioning
  pinX: number;
  pinY: number;
  photo: string;
};

const MOCK_LOCATIONS: Location[] = [
  {
    id: "l1",
    name: "ByteRight Services",
    address: "210 Pitt St, Sydney NSW 2000",
    hours: "Mon–Sat 9am–5pm",
    phone: "(07) 8123 5678",
    rating: 4.6,
    ratingCount: 125,
    pinX: 0.28,
    pinY: 0.42,
    photo:
      "https://images.unsplash.com/photo-1529336953121-a0ce6242c85b?q=80&w=800&auto=format&fit=crop",
  },
  {
    id: "l2",
    name: "Austral South Wales",
    address: "82 Oxford St, Darlinghurst NSW 2010",
    hours: "Mon–Sat 9am–5pm",
    phone: "(07) 8123 5678",
    rating: 4.2,
    ratingCount: 98,
    pinX: 0.58,
    pinY: 0.57,
    photo:
      "https://images.unsplash.com/photo-1526948128573-703ee1aeb6fa?q=80&w=800&auto=format&fit=crop",
  },
  {
    id: "l3",
    name: "NetFix Labs",
    address: "12 George St, Chatswood NSW 2067",
    hours: "Mon–Sat 9am–5pm",
    phone: "(02) 9000 1234",
    rating: 4.3,
    ratingCount: 61,
    pinX: 0.72,
    pinY: 0.33,
    photo:
      "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?q=80&w=800&auto=format&fit=crop",
  },
];

type Props = { open: boolean; onClose: () => void };

export default function FindLocalSupportModal({ open, onClose }: Props) {
  const [query, setQuery] = useState("");
  const [focused, setFocused] = useState<Location | null>(null);
  const [hoverId, setHoverId] = useState<string | null>(null);

  useEffect(() => {
    if (!open) {
      setQuery("");
      setFocused(null);
      setHoverId(null);
    }
  }, [open]);

  const filtered = useMemo(() => {
    if (!query.trim()) return MOCK_LOCATIONS;
    return MOCK_LOCATIONS.filter(
      (l) =>
        l.name.toLowerCase().includes(query.toLowerCase()) ||
        l.address.toLowerCase().includes(query.toLowerCase())
    );
  }, [query]);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (open) {
      const scrollY = window.scrollY;
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = '100%';
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.position = '';
        document.body.style.top = '';
        document.body.style.width = '';
        document.body.style.overflow = '';
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
        width: '100vw',
        height: '100vh',
        overflow: 'auto',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
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
          width: '100vw',
          height: '100vh',
          zIndex: 100
        }}
      />
      <div
        className="fixed z-[101] mx-3 w-full max-w-[1120px] rounded-2xl bg-white shadow-xl h-[80vh] overflow-auto noscrollbar"
        style={{
          left: '50%',
          top: '50%',
          transform: 'translate(-50%, -50%)'
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
              placeholder="Enter your address or postcode…"
            />
            <span className="absolute left-3 top-2.5 text-[#8E8AA3]">🔎</span>

            {/* Suggestions */}
            {query && (
              <div className="absolute z-10 mt-1 w-full overflow-hidden rounded-lg border border-[#EEEAF4] bg-white shadow-lg">
                {["82 Oxford St, Darlinghurst NSW 2010", "45 Oxford St…", "55 Oxford St…"].map(
                  (s, i) => (
                    <button
                      key={i}
                      onClick={() => setQuery(s)}
                      className="block w-full px-3 py-2 text-left text-[14px] hover:bg-[#FBFAFD]"
                    >
                      {s}
                    </button>
                  )
                )}
              </div>
            )}
          </div>

          <button className="rounded-lg bg-[#3F205F] px-4 py-2 text-[14px] font-semibold text-white">
            Search
          </button>
        </div>

        {/* Body */}
        <div className="grid gap-6 px-6 pb-6 md:grid-cols-[360px,1fr] ">
          {/* Nearby list */}
          <div className="rounded-xl border border-[#EEEAF4] bg-[#FBFAFD] p-4">
            <div className="mb-3 text-[14px] font-semibold">Nearby Technicians</div>
            <div className="space-y-3">
              {filtered.map((l) => (
                <button
                  key={l.id}
                  onClick={() => setFocused(l)}
                  onMouseEnter={() => setHoverId(l.id)}
                  onMouseLeave={() => setHoverId(null)}
                  className={`flex w-full gap-3 rounded-xl border px-3 py-3 text-left transition ${focused?.id === l.id || hoverId === l.id
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
                    <div className="truncate text-[14px] font-semibold">{l.name}</div>
                    <div className="truncate text-[12px] text-[#6F6C90]">{l.address}</div>
                    <div className="flex items-center gap-2 text-[12px] text-[#6F6C90]">
                      ⭐ {l.rating}/5 • {l.phone}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Map panel */}
          <div className="relative overflow-hidden rounded-xl border border-[#EEEAF4]">
            {/* Static map image placeholder */}
            <img
              src="https://images.unsplash.com/photo-1526779259212-939e64788e3c?q=80&w=1600&auto=format&fit=crop"
              alt=""
              className="h-[520px] w-full object-cover opacity-70"
            />

            {/* Pins */}
            {filtered.map((l) => (
              <button
                key={l.id}
                style={{
                  left: `${l.pinX * 100}%`,
                  top: `${l.pinY * 100}%`,
                }}
                onClick={() => setFocused(l)}
                className={`absolute -translate-x-1/2 -translate-y-full rounded-full border-2 px-2 py-1 text-white transition ${focused?.id === l.id ? "scale-110 border-white bg-[#2D0F4D]" : "bg-[#5E2B86]"
                  }`}
                onMouseEnter={() => setHoverId(l.id)}
                onMouseLeave={() => setHoverId(null)}
                aria-label={`Marker for ${l.name}`}
              >
                📍
              </button>
            ))}

            {/* Focused card overlay (like the callout on map) */}
            {focused && (
              <div className="pointer-events-auto absolute left-1/2 top-6 w-[360px] -translate-x-1/2 overflow-hidden rounded-xl border border-[#EEEAF4] bg-white shadow-xl">
                <img src={focused.photo} className="h-[140px] w-full object-cover" alt="" />
                <div className="space-y-1 p-3">
                  <div className="text-[14px] font-semibold">{focused.name}</div>
                  <div className="text-[12px] text-[#6F6C90]">{focused.address}</div>
                  <div className="text-[12px] text-[#6F6C90]">
                    ⭐ {focused.rating}/5 <span className="text-[#8E8AA3]">({focused.ratingCount} reviews)</span>
                  </div>
                </div>
              </div>
            )}

            {/* Zoom & my-location UI dummies */}
            <div className="absolute bottom-4 right-4 grid gap-2">
              <button className="grid h-9 w-9 place-items-center rounded-full bg-white shadow">＋</button>
              <button className="grid h-9 w-9 place-items-center rounded-full bg-white shadow">－</button>
              <button className="grid h-9 w-9 place-items-center rounded-full bg-[#3F205F] text-white shadow">
                ⊙
              </button>
            </div>
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
              <div className="text-[13px] text-[#6F6C90]">{focused.address}</div>
              <div className="mt-3 grid gap-4 md:grid-cols-[1.3fr,1fr]">
                <img src={focused.photo} className="h-[220px] w-full rounded-lg object-cover" alt="" />
                <div className="space-y-3">
                  <div>
                    <div className="text-[12px] font-semibold text-[#6F6C90]">Store Details</div>
                    <p className="text-[13px] text-[#0A0A0A]">
                      Expert technicians specialising in Blynk IoT solutions with 10+ years of
                      experience. We provide comprehensive support for smart-home & industrial IoT needs.
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

              {/* Approved technicians (sample) */}
              <div className="mt-5">
                <div className="mb-3 text-[14px] font-semibold">Meet Your Blynk Approved Technicians</div>
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {["Catherine Deck", "Alex Marcus", "Lia Vance"].map((n, i) => (
                    <div key={i} className="rounded-xl border border-[#EEEAF4] p-3">
                      <div className="mb-2 flex items-center gap-3">
                        <div className="grid h-10 w-10 place-items-center rounded-full bg-[#F1EAF8] text-[#3F205F]">
                          👩‍🔧
                        </div>
                        <div>
                          <div className="text-[14px] font-semibold">{n}</div>
                          <div className="text-[12px] text-[#6F6C90]">
                            5+ years • phone & data recovery
                          </div>
                        </div>
                      </div>
                      <div className="h-28 rounded-lg bg-[url('https://images.unsplash.com/photo-1587614382346-4ec70e388b28?q=80&w=800&auto=format&fit=crop')] bg-cover bg-center"></div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Photo gallery */}
              <div className="mt-5">
                <div className="mb-3 text-[14px] font-semibold">Photo Gallery</div>
                <div className="grid grid-cols-3 gap-3 md:grid-cols-6">
                  {Array.from({ length: 9 }).map((_, i) => (
                    <div
                      key={i}
                      className="h-20 rounded-lg bg-[url('https://images.unsplash.com/photo-1554151228-14d9def656e4?q=80&w=600&auto=format&fit=crop')] bg-cover bg-center"
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>,
    document.body
  );
}
