"use client";

import { useState } from "react";
import apiClient from "@/lib/apiClient";
import { Loader2 } from "lucide-react";

export default function ContactUsForm({
  dark = false,
  onClose,
}: {
  dark?: boolean;
  onClose?: () => void;
}) {
  const [method, setMethod] = useState<"email" | "phone">("email");
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    subject: "",
    message: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg("");
    setSuccess(false);

    try {
      await apiClient.post("/support-tickets/public", {
        ...formData,
        contactMethod: method,
      });
      setSuccess(true);
      setFormData({
        fullName: "",
        email: "",
        phone: "",
        subject: "",
        message: ""
      });
    } catch (err: any) {
      setErrorMsg(err.message || "Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section
      className={`w-full min-w-0 ${dark ? "bg-[#190A2F]" : "bg-transparent"} ${onClose ? "relative" : ""}`}
    >
      <form
        className="relative mx-auto w-full min-w-0 max-w-full sm:max-w-[661px] rounded-[20px] bg-white px-4 py-6 shadow-[0_10px_40px_rgba(0,0,0,0.04)] sm:rounded-[30px] sm:px-[30px] sm:py-[50px] box-border overflow-hidden"
        onSubmit={handleSubmit}
      >
        {/* Close Button */}
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full bg-[#F44336] hover:bg-[#FFD6D6] transition sm:right-6 sm:top-6"
            aria-label="Close"
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 14 14"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M1 1L13 13M13 1L1 13"
                stroke="#FFFFFF"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </button>
        )}

        {/* Heading */}
        <h2
          className={`text-center text-[24px] font-bold sm:text-[28px] md:text-[32px] ${
            dark ? "text-white" : "text-black"
          }`}
        >
          Get in Touch
        </h2>

        {success && (
          <div className="mt-4 p-4 text-sm text-green-700 bg-green-100 rounded-lg text-center font-medium">
            Thank you! Your message has been sent successfully. Our support team will get back to you soon.
          </div>
        )}

        {errorMsg && (
          <div className="mt-4 p-4 text-sm text-red-700 bg-red-100 rounded-lg text-center font-medium">
            {errorMsg}
          </div>
        )}

        {/* Two-column fields */}
        <div className="mt-4 grid grid-cols-1 gap-4 sm:mt-6 md:grid-cols-2 min-w-0">
          <Field label="Full Name">
            <input
              required
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              placeholder="Enter your name"
              className="h-[44px] w-full min-w-0 rounded-[8px] border border-[#DFDBE3] bg-[#FDFAFF] px-3 text-[14px] text-[#6F6C90] outline-[#401B60] sm:h-[48px] sm:px-[14px]"
            />
          </Field>

          <Field label="Email Address">
            <input
              required
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              className="h-[44px] w-full min-w-0 rounded-[8px] border border-[#DFDBE3] bg-[#FDFAFF] px-3 text-[14px] text-[#6F6C90] outline-[#401B60] sm:h-[48px] sm:px-[14px]"
            />
          </Field>

          <Field label="Phone Number">
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="Enter your phone number"
              className="h-[44px] w-full min-w-0 rounded-[8px] border border-[#DFDBE3] bg-[#FDFAFF] px-3 text-[14px] text-[#6F6C90] outline-[#401B60] sm:h-[48px] sm:px-[14px]"
            />
          </Field>

          <Field label="Subject">
            <input
              required
              type="text"
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              placeholder="How can we help you?"
              className="h-[44px] w-full min-w-0 rounded-[8px] border border-[#DFDBE3] bg-[#FDFAFF] px-3 text-[14px] text-[#6F6C90] outline-[#401B60] sm:h-[48px] sm:px-[14px]"
            />
          </Field>
        </div>

        {/* Message */}
        <div className="mt-4 sm:mt-6">
          <label className="text-[14px] font-semibold text-black">
            Message
          </label>
          <textarea
            required
            name="message"
            value={formData.message}
            onChange={handleChange}
            placeholder="Write your message..."
            className="mt-2 h-[100px] w-full min-w-0 rounded-[8px] border border-[#DFDBE3] bg-[#FDFAFF] p-3 text-[14px] text-[#6F6C90] outline-[#401B60] sm:mt-[9px] sm:h-[114px] sm:p-[14px] resize-none"
          />
        </div>

        {/* Preferred Contact Method */}
        <div className="mt-4 sm:mt-6">
          <div className="text-[14px] font-semibold text-black">
            Preferred Contact Method
          </div>
          <div className="mt-3 flex flex-wrap items-start gap-4 sm:mt-4 sm:gap-[22px]">
            <label className="inline-flex cursor-pointer items-center gap-[5px]">
              <span
                className={`grid h-[13px] w-[13px] place-items-center rounded-full border-[0.5px] ${method === 'email' ? 'border-[#401B60]' : 'border-[#6F6C90]'}`}
                aria-hidden
              >
                {method === 'email' && <span className="h-[7px] w-[7px] rounded-full bg-[#401B60]" />}
              </span>
              <input
                type="radio"
                name="contactMethod"
                value="email"
                className="sr-only"
                checked={method === "email"}
                onChange={() => setMethod("email")}
              />
              <span className={`text-[14px] ${method === 'email' ? 'text-black' : 'text-[#6F6C90]'}`}>Email</span>
            </label>

            <label className="inline-flex cursor-pointer items-center gap-[5px]">
              <span
                className={`grid h-[13px] w-[13px] place-items-center rounded-full border-[0.5px] ${method === 'phone' ? 'border-[#401B60]' : 'border-[#6F6C90]'}`}
                aria-hidden
              >
                {method === 'phone' && <span className="h-[7px] w-[7px] rounded-full bg-[#401B60]" />}
              </span>
              <input
                type="radio"
                name="contactMethod"
                value="phone"
                className="sr-only"
                checked={method === "phone"}
                onChange={() => setMethod("phone")}
              />
              <span className={`text-[14px] ${method === 'phone' ? 'text-black' : 'text-[#6F6C90]'}`}>Phone</span>
            </label>
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-[8px] bg-[#401B60] px-4 py-3 text-[16px] font-semibold text-white hover:bg-[#5E2E89] transition disabled:opacity-70 disabled:cursor-not-allowed sm:mt-6 sm:py-[14px] sm:text-[18px]"
        >
          {isSubmitting ? (
            <Loader2 className="animate-spin h-5 w-5" />
          ) : (
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="flex-shrink-0"
            >
              <path d="M22 2L11 13" />
              <path d="M22 2L15 22L11 13L2 9L22 2Z" />
            </svg>
          )}
          <span>{isSubmitting ? "Sending..." : "Send Message"}</span>
        </button>
      </form>
    </section>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-start gap-2 sm:gap-[9px]">
      <label className="text-[14px] font-semibold text-black">{label}</label>
      {children}
    </div>
  );
}
