"use client";

type Trend = "up" | "down";
type IconKey = "user" | "box" | "card" | "headset";

const Icons: Record<IconKey, JSX.Element> = {
  user: (
    <svg width="24" height="24" viewBox="0 0 36 37" fill="none" aria-hidden>
      <path d="M13.74 16.805c-.15-.015-.33-.015-.495 0C9.675 16.685 6.84 13.76 6.84 10.16 6.84 6.485 9.81 3.5 13.5 3.5c3.675 0 6.66 2.985 6.66 6.66-.015 3.6-2.85 6.525-6.42 6.645Z" stroke="#401B60" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M24.617 6.5c2.91 0 5.25 2.355 5.25 5.25 0 2.835-2.25 5.145-5.055 5.25-.12-.015-.255-.015-.39 0" stroke="#401B60" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M6.238 22.34c-3.63 2.43-3.63 6.39 0 8.805 4.125 2.76 10.89 2.76 15.015 0 3.63-2.43 3.63-6.39 0-8.805-4.11-2.745-10.875-2.745-15.015 0Z" stroke="#401B60" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  box: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden>
      <rect x="3" y="4" width="18" height="14" rx="2" stroke="#6F6C90" strokeWidth="1.6"/>
      <path d="M7 8h10M7 12h6" stroke="#6F6C90" strokeWidth="1.6" strokeLinecap="round"/>
    </svg>
  ),
  card: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden>
      <rect x="4" y="4" width="16" height="12" rx="2" stroke="#6F6C90" strokeWidth="1.6"/>
      <path d="M4 9h16M8 17h8" stroke="#6F6C90" strokeWidth="1.6" strokeLinecap="round"/>
    </svg>
  ),
  headset: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M4 9a8 8 0 0 1 16 0v6a4 4 0 0 1-4 4h-2" stroke="#6F6C90" strokeWidth="1.6"/>
      <rect x="3" y="11" width="4" height="6" rx="2" stroke="#6F6C90" strokeWidth="1.6"/>
      <rect x="17" y="11" width="4" height="6" rx="2" stroke="#6F6C90" strokeWidth="1.6"/>
    </svg>
  ),
};

export default function KpiCard({
  title, value, delta, trend, icon,
}: {
  title: string;
  value: number;
  delta: string;
  trend: Trend;
  icon: IconKey;
}) {
  const isDown = trend === "down";
  const tone = isDown ? "text-red-600" : "text-emerald-600";

  return (
    <div className=" rounded-[12.75px] border border-[#DFDBE3] bg-white p-2 shadow-[0_37px_37px_rgba(0,0,0,0.05)]">
      <div className="text-[18px] font-bold text-[#0A0A0A]">{title}</div>

      {/* inner row */}
      <div className="mt-4 flex items-center justify-between rounded-[10px] bg-[#F8F8F8] p-2">
        <div>
          <div className="text-2xl font-bold leading-[34px] text-[#0A0A0A]">
            {value.toLocaleString()}
          </div>
          <div className={`mt-4 flex items-center text-[16px] ${tone}`}>
            {/* arrow only, no stray character */}
            {isDown ? (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="mr-2">
                <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            ) : (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="mr-2">
                <path d="M6 15l6-6 6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            )}
            <span>{delta}</span>
          </div>
        </div>

        {/* icon badge */}
        <div className="grid h-[44px] w-[44px] place-items-center rounded-[10px] border border-[#E7E4EC] bg-[#F6F3FA]">
          {Icons[icon]}
        </div>
      </div>
    </div>
  );
}
