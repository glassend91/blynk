"use client";

import ModalShell from "./ModalShell";
import SectionPanel from "./SectionPanel";

interface ExitConfirmationDialogProps {
  open: boolean;
  onStay: () => void;
  onExit: () => void;
}

export default function ExitConfirmationDialog({
  open,
  onStay,
  onExit,
}: ExitConfirmationDialogProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[2000] grid place-items-center bg-black/70 p-4">
      <ModalShell onClose={onStay} size="default" showClose={false}>
        <SectionPanel>
          <div className="text-center">
            <div className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-[#F44] text-white">
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                aria-hidden
              >
                <path
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  stroke="white"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <h2 className="mt-4 text-[24px] font-extrabold leading-[30px] text-[#170F49]">
              Are you sure you want to exit?
            </h2>
            <p className="mt-2 text-[14px] leading-[22px] text-[#6F6C90]">
              Your sign-up will be cancelled and your progress will not be
              saved.
            </p>
            <div className="mt-6 flex gap-3">
              <button
                type="button"
                onClick={onStay}
                className="flex-1 rounded-lg border border-[#D9D4E5] bg-white px-4 py-3 text-[14px] font-semibold text-[#3F205F] hover:bg-[#F7F7FA]"
              >
                Stay
              </button>
              <button
                type="button"
                onClick={onExit}
                className="flex-1 rounded-lg bg-[#3F205F] px-4 py-3 text-[14px] font-semibold text-white hover:bg-[#4F1C76]"
              >
                Exit Anyway
              </button>
            </div>
          </div>
        </SectionPanel>
      </ModalShell>
    </div>
  );
}
