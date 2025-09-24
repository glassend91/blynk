"use client";

export type ModalSize = "narrow" | "default" | "wide";

export default function ModalShell({
  children,
  onClose,
  size = "wide",
  showClose = true,
}: {
  children: React.ReactNode;
  onClose: () => void;
  size?: ModalSize;
  showClose?: boolean;
}) {
  const maxW =
    size === "narrow" ? "max-w-[600px]" :
    size === "default" ? "max-w-[820px]" :
    "max-w-[1160px]";

  return (
    <div className="fixed inset-0 z-[100] grid place-items-center bg-black/55 px-3 py-4 sm:px-4">
      <div
        className={[
          "relative w-full bg-white shadow-[0_30px_80px_rgba(22,9,41,0.18)]",
          "p-4 sm:p-6 md:p-8 lg:p-10",
          "max-h-[min(100vh-1rem,980px)] overflow-y-auto",
          "rounded-none sm:rounded-[20px] md:rounded-[24px] lg:rounded-[28px]",
          maxW,
        ].join(" ")}
      >
        {showClose && (
          <button
            onClick={onClose}
            aria-label="Close"
            className="absolute right-3 top-3 grid h-8 w-8 place-items-center rounded-full bg-[#F44] sm:right-4 sm:top-4"
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M1 1L13 13M13 1L1 13" stroke="white" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>
        )}

        {children}

        <div className="h-4 sm:h-5 md:h-6" />
      </div>
    </div>
  );
}
