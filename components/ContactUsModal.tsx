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
  // Close modal on ESC key press and prevent body scroll
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    if (open) {
      document.addEventListener("keydown", handleEsc);
      // Prevent body scroll when modal is open
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEsc);
      document.body.style.overflow = "";
    };
  }, [onClose, open]);

  if (!open) return null;

  return (
    <>
      <style
        dangerouslySetInnerHTML={{
          __html: `
          #contact-modal::-webkit-scrollbar {
            display: none;
            width: 0;
            height: 0;
          }
          #contact-modal-content::-webkit-scrollbar {
            display: none;
            width: 0;
            height: 0;
          }
          #contact-modal {
            -ms-overflow-style: none;
            scrollbar-width: none;
          }
          #contact-modal-content {
            -ms-overflow-style: none;
            scrollbar-width: none;
          }
        `,
        }}
      />
      <div
        id="contact-modal"
        className="fixed inset-0 z-[9999] flex items-start justify-center bg-black/90 backdrop-blur-[4px] p-3 overflow-y-auto overflow-x-hidden sm:items-center sm:p-4"
        onClick={(e) => {
          if (e.target === e.currentTarget) onClose();
        }}
      >
        {/* Modal content */}
        <div
          id="contact-modal-content"
          className="relative w-full max-w-[calc(100vw-1.5rem)] sm:max-w-[720px] min-w-0 my-2 sm:my-8 max-h-[calc(100vh-1rem)] sm:max-h-[calc(100vh-4rem)] rounded-[20px] shadow-lg animate-fadeIn box-border overflow-y-auto overflow-x-hidden"
        >
          {/* Contact form */}
          <ContactUsForm onClose={onClose} />
        </div>
      </div>
    </>
  );
}
