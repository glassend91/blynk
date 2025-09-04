"use client";

import { useEffect } from "react";
import { X } from "lucide-react";
import ContactUsForm from "@/components/ContactUsForm";

export default function ContactUsModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  // Close modal on ESC key press
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  if (!open) return null;

  return (
    <div
      id="contact-modal"
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/90 backdrop-blur-[4px] px-4"
    >
      {/* Modal content */}
      <div className="relative w-full max-w-[720px] rounded-[20px] shadow-lg animate-fadeIn">

        {/* Contact form */}
        <ContactUsForm onClose={onClose}/>
      </div>
    </div>
  );
}
