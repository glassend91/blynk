"use client";

import ModalShell from "@/components/shared/ModalShell";
import SectionPanel from "@/components/shared/SectionPanel";

export default function BusinessServicesPage({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  if (!open) return null;

  // Placeholder phone number - will be provided soon
  const businessSupportPhone = "(Number will be provided soon)";

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/70 p-4 md:p-6">
      <ModalShell onClose={onClose} size="wide">
        <SectionPanel>
          <div className="text-center">
            {/* Icon */}
            <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-[#4F1C76] text-white">
              <svg
                width="32"
                height="32"
                viewBox="0 0 24 24"
                fill="none"
                aria-hidden
              >
                <path
                  d="M12 2L2 7L12 12L22 7L12 2Z"
                  stroke="white"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M2 17L12 22L22 17"
                  stroke="white"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M2 12L12 17L22 12"
                  stroke="white"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>

            {/* Headline */}
            <h1 className="mt-6 text-[32px] font-extrabold leading-[40px] text-[#170F49] md:text-[40px] md:leading-[48px]">
              Business-Grade Internet, Supported by Your Local Tech Experts.
            </h1>

            {/* Call-to-Action Text */}
            <p className="mx-auto mt-6 max-w-[720px] text-[16px] leading-[26px] text-[#6F6C90] md:text-[18px] md:leading-[28px]">
              Focus on running your business, not your IT. Our local tech partners provide the hands-on, expert support you need to stay connected. Call us to speak with a Business Specialist and build a solution that works for you.
            </p>

            {/* Phone Number - Prominently Displayed */}
            <div className="mx-auto mt-8 max-w-[600px] rounded-[16px] border-2 border-[#4F1C76] bg-[#FBF8FF] p-6 shadow-[0_24px_60px_rgba(64,27,118,0.10)]">
              <div className="text-[14px] font-semibold text-[#6F6C90] mb-2">
                Business Support
              </div>
              <a
                href={`tel:${businessSupportPhone.replace(/[^0-9+]/g, "")}`}
                className="inline-flex items-center gap-3 text-[28px] font-bold text-[#4F1C76] hover:text-[#3F205F] transition-colors md:text-[36px]"
              >
                <svg
                  width="32"
                  height="32"
                  viewBox="0 0 24 24"
                  fill="none"
                  aria-hidden
                  className="text-[#4F1C76]"
                >
                  <path
                    d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                {businessSupportPhone}
              </a>
            </div>

            {/* Additional Information */}
            <div className="mx-auto mt-8 max-w-[720px] rounded-[12px] border border-[#E7E4EC] bg-white p-6">
              <h2 className="text-[20px] font-semibold text-[#2B1940] mb-4">
                Why Choose Business Services?
              </h2>
              <ul className="space-y-3 text-left text-[15px] leading-[24px] text-[#6F6C90]">
                <li className="flex items-start gap-3">
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    className="mt-0.5 flex-shrink-0 text-[#10B981]"
                    aria-hidden
                  >
                    <path
                      d="M20 6L9 17l-5-5"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <span>Dedicated business support team</span>
                </li>
                <li className="flex items-start gap-3">
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    className="mt-0.5 flex-shrink-0 text-[#10B981]"
                    aria-hidden
                  >
                    <path
                      d="M20 6L9 17l-5-5"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <span>Service Level Agreement (SLA) protection</span>
                </li>
                <li className="flex items-start gap-3">
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    className="mt-0.5 flex-shrink-0 text-[#10B981]"
                    aria-hidden
                  >
                    <path
                      d="M20 6L9 17l-5-5"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <span>Priority fault resolution</span>
                </li>
                <li className="flex items-start gap-3">
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    className="mt-0.5 flex-shrink-0 text-[#10B981]"
                    aria-hidden
                  >
                    <path
                      d="M20 6L9 17l-5-5"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <span>Enhanced network reliability</span>
                </li>
                <li className="flex items-start gap-3">
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    className="mt-0.5 flex-shrink-0 text-[#10B981]"
                    aria-hidden
                  >
                    <path
                      d="M20 6L9 17l-5-5"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <span>Local tech partners for hands-on support</span>
                </li>
              </ul>
            </div>

            {/* Close Button */}
            <button
              type="button"
              onClick={onClose}
              className="mt-8 rounded-[10px] border border-[#4F1C76] bg-white px-6 py-3 text-[15px] font-semibold text-[#4F1C76] hover:bg-[#FBF8FF] transition-colors"
            >
              Close
            </button>
          </div>
        </SectionPanel>
      </ModalShell>
    </div>
  );
}

