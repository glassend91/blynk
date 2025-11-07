"use client";

export default function BusinessServicesLanding() {
  // Placeholder phone number - will be provided soon
  const businessSupportPhone = "(Number will be provided soon)";

  return (
    <div className="w-full bg-gradient-to-b from-white to-[#FBF8FF]">
      {/* Hero Section */}
      <section className="mx-auto max-w-[1400px] px-6 py-16 md:py-24">
        <div className="mx-auto max-w-[900px] text-center">
          {/* Icon */}
          <div className="mx-auto grid h-20 w-20 place-items-center rounded-full bg-[#4F1C76] text-white md:h-24 md:w-24">
            <svg
              width="40"
              height="40"
              viewBox="0 0 24 24"
              fill="none"
              aria-hidden
              className="md:w-12 md:h-12"
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
          <h1 className="mt-8 text-[36px] font-extrabold leading-[44px] text-[#170F49] md:text-[48px] md:leading-[56px]">
            Business-Grade Internet, Supported by Your Local Tech Experts.
          </h1>

          {/* Call-to-Action Text */}
          <p className="mx-auto mt-6 max-w-[800px] text-[18px] leading-[28px] text-[#6F6C90] md:text-[20px] md:leading-[30px]">
            Focus on running your business, not your IT. Our local tech partners provide the hands-on, expert support you need to stay connected. Call us to speak with a Business Specialist and build a solution that works for you.
          </p>

          {/* Phone Number - Prominently Displayed */}
          <div className="mx-auto mt-10 max-w-[700px] rounded-[20px] border-2 border-[#4F1C76] bg-[#FBF8FF] p-8 shadow-[0_24px_60px_rgba(64,27,118,0.15)] md:p-10">
            <div className="text-[16px] font-semibold text-[#6F6C90] mb-3 md:text-[18px]">
              Business Support
            </div>
            <a
              href={`tel:${businessSupportPhone.replace(/[^0-9+]/g, "")}`}
              className="inline-flex items-center gap-4 text-[32px] font-bold text-[#4F1C76] hover:text-[#3F205F] transition-colors md:text-[42px]"
            >
              <svg
                width="40"
                height="40"
                viewBox="0 0 24 24"
                fill="none"
                aria-hidden
                className="text-[#4F1C76] md:w-12 md:h-12"
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
        </div>
      </section>

      {/* Benefits Section */}
      <section className="mx-auto max-w-[1400px] px-6 py-12 md:py-16">
        <div className="mx-auto max-w-[900px] rounded-[16px] border border-[#E7E4EC] bg-white p-8 shadow-[0_24px_60px_rgba(64,27,118,0.08)] md:p-10">
          <h2 className="text-center text-[24px] font-semibold text-[#2B1940] mb-8 md:text-[28px]">
            Why Choose Business Services?
          </h2>
          <ul className="grid gap-4 text-[16px] leading-[26px] text-[#6F6C90] md:grid-cols-2 md:gap-6 md:text-[17px]">
            <li className="flex items-start gap-3">
              <svg
                width="24"
                height="24"
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
                width="24"
                height="24"
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
                width="24"
                height="24"
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
                width="24"
                height="24"
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
            <li className="flex items-start gap-3 md:col-span-2 md:justify-center">
              <svg
                width="24"
                height="24"
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
      </section>

      {/* CTA Section */}
      <section className="mx-auto max-w-[1400px] px-6 pb-16 md:pb-24">
        <div className="mx-auto max-w-[700px] text-center">
          <div className="rounded-[20px] border-2 border-[#4F1C76] bg-[#4F1C76] p-8 text-white shadow-[0_24px_60px_rgba(64,27,118,0.20)] md:p-10">
            <h3 className="text-[24px] font-bold mb-4 md:text-[28px]">
              Ready to Get Started?
            </h3>
            <p className="mb-6 text-[16px] leading-[26px] text-white/90 md:text-[18px]">
              Speak with our Business Specialists today to find the perfect solution for your business needs.
            </p>
            <a
              href={`tel:${businessSupportPhone.replace(/[^0-9+]/g, "")}`}
              className="inline-flex items-center gap-3 rounded-[12px] bg-white px-8 py-4 text-[18px] font-bold text-[#4F1C76] hover:bg-[#FBF8FF] transition-colors md:text-[20px]"
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                aria-hidden
              >
                <path
                  d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              Call {businessSupportPhone}
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}

