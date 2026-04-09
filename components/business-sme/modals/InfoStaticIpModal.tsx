"use client";
import ModalShell from "@/components/shared/ModalShell";

export default function InfoStaticIpModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  if (!open) return null;

  return (
    <ModalShell onClose={onClose} size="narrow">
      <div className="p-6 sm:p-8">
        <h3 className="text-[22px] sm:text-[24px] font-extrabold leading-7 text-[#2B1940]">
          Static IP Benefits for Business
        </h3>
        <ul className="mt-4 list-disc space-y-2 pl-5 text-[14px] leading-7 text-[#6F6C90]">
          <li>Host business servers and applications</li>
          <li>Secure remote access to office network</li>
          <li>Enhanced VPN connections</li>
          <li>Improved email deliverability</li>
          <li>Professional online presence</li>
        </ul>
      </div>
    </ModalShell>
  );
}
