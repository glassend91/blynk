// components/WhatOurCustomersSay.tsx
import Image from "next/image";

export default function WhatOurCustomersSay() {
  return (
    <section
      className="bg-cover bg-center bg-[#401B60]/10"
    // style={{
    //   backgroundImage:
    //     "linear-gradient(0deg, rgba(255,255,255,0.10) 0%, rgba(255,255,255,0.1) 100%), url(https://api.builder.io/api/v1/image/assets/TEMP/c1a89bf878f52350be0114a9f31a36f08f13ccac?width=3840)",
    // }}
    >
      {/* Figma: padding 150px vertical, 243px horizontal. Keep canvas centered at 1434px. */}
      <div className="mx-auto max-w-[1434px] px-32 py-[150px]">
        {/* Header row: left text (609px) + right rating (559px), gap 266px */}
        <div className="flex flex-col items-center gap-12 md:flex-row md:items-center md:justify-center md:gap-[266px]">
          {/* Left copy block */}
          <div className="w-full max-w-[609px]">
            <h2 className="text-black font-bold text-[36px] leading-[72px]">
              What Our Customers Say
            </h2>
            <p className="mt-2 text-[#6F6C90] text-[18px] leading-[27px]">
              Real stories from real customers who&apos;ve experienced the Blynk difference
            </p>
          </div>

          {/* Right rating block */}
          <div className="w-full max-w-[559px] flex flex-col items-center gap-1">
            <Stars width={263} height={52} fill="currentColor" className="text-[#F9C01D]" />
            <div className="text-black text-[20px] leading-[46px] font-bold text-center">
              4.8 average rating from 1,000+ customers
            </div>
          </div>
        </div>

        {/* Cards row: three cards 458x284, padding 44/30, radius 24, border rgba(64,27,96,0.05), gap 30 */}
        <div className="mt-[50px] grid grid-cols-1 gap-[30px] md:grid-cols-3">
          {/* Card 1 (light) */}
          <TestimonialCard
            variant="light"
            quote={`"Finally, a telco that actually cares about their customers. Michael from the Sydney team was incredible - he not only fixed our internet but taught us how to get the best speeds throughout our home."`}
            name="Sarah Johnson"
            location="Sydney, NSW"
            tag="NBN Installation"
            avatar="https://api.builder.io/api/v1/image/assets/TEMP/0b2ead6403749147a735cc279d7d7cfad4e3f7a4?width=88"
          />

          {/* Card 2 (primary) */}
          <TestimonialCard
            variant="primary"
            quote={`"Finally, a telco that actually cares about their customers. Michael from the Sydney team was incredible - he not only fixed our internet but taught us how to get the best speeds throughout our home."`}
            name="David Chen"
            location="Melbourne, VIC"
            tag="Mobile & NBN Bundle"
            avatar="https://api.builder.io/api/v1/image/assets/TEMP/0b2ead6403749147a735cc279d7d7cfad4e3f7a4?width=88"
          />

          {/* Card 3 (light) */}
          <TestimonialCard
            variant="light"
            quote={`"Finally, a telco that actually cares about their customers. Michael from the Sydney team was incredible - he not only fixed our internet but taught us how to get the best speeds throughout our home."`}
            name="Lisa Thompson"
            location="Brisbane, QLD"
            tag="Business NBN"
            avatar="https://api.builder.io/api/v1/image/assets/TEMP/0b2ead6403749147a735cc279d7d7cfad4e3f7a4?width=88"
          />
        </div>
      </div>
    </section>
  );
}

/* ------- Subcomponents ------- */

function TestimonialCard(props: {
  variant: "light" | "primary";
  quote: string;
  name: string;
  location: string;
  tag: string;
  avatar: string;
}) {
  const primary = props.variant === "primary";
  return (
    <div
      className={[
        "flex w-full max-w-[458px] h-[284px] flex-col justify-center items-start rounded-[24px] border px-[30px] py-[44px]",
        primary ? "bg-[#401B60] border-[#401B60]" : "bg-white border-[rgba(64,27,96,0.05)]",
      ].join(" ")}
    >
      <Stars width={158} height={31} fill={primary ? "#F9C01D" : "#F9C01D"} />
      <p
        className={[
          "mt-4 text-[16px] leading-[24px]",
          primary ? "text-white" : "text-[#6F6C90]",
        ].join(" ")}
      >
        {props.quote}
      </p>

      <div className="mt-4 flex items-center justify-between w-full">
        <div className="flex items-center gap-4">
          <Image
            src={props.avatar}
            alt={props.name}
            width={44}
            height={44}
            className="h-[44px] w-[44px] rounded-full object-cover"
          />
          <div>
            <div className={["text-[16px] leading-[24px] font-bold", primary ? "text-white" : "text-black"].join(" ")}>
              {props.name}
            </div>
            <div className={["text-[14px] leading-[21px]", primary ? "text-white" : "text-black"].join(" ")}>
              {props.location}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span
            className={[
              "inline-block h-2 w-2 rounded-full",
              primary ? "bg-white" : "bg-[#401B60]",
            ].join(" ")}
          />
          <span className={["text-[14px] leading-[21px] font-bold", primary ? "text-white" : "text-[#401B60]"].join(" ")}>
            {props.tag}
          </span>
        </div>
      </div>
    </div>
  );
}

function Stars({
  width,
  height,
  className,
  fill = "#F9C01D",
}: {
  width: number;
  height: number;
  fill?: string;
  className?: string;
}) {
  // Compact five-star SVG used in both header and cards
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 263 52"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden
    >
      {[0, 53, 106, 159, 212].map((x) => (
        <path
          key={x}
          transform={`translate(${x} 0)`}
          d="M22.6468 8.9562C23.5449 6.19227 27.4551 6.19227 28.3532 8.9562L30.5516 15.7222C30.9532 16.9582 32.1051 17.7951 33.4047 17.7951H40.5189C43.4251 17.7951 44.6334 21.514 42.2822 23.2222L36.5268 27.4038C35.4753 28.1677 35.0353 29.5218 35.437 30.7579L37.6354 37.5238C38.5334 40.2878 35.37 42.5861 33.0188 40.8779L27.2634 36.6963C26.2119 35.9324 24.7881 35.9324 23.7366 36.6963L17.9812 40.8779C15.63 42.5861 12.4666 40.2878 13.3646 37.5238L15.563 30.7579C15.9647 29.5218 15.5247 28.1677 14.4732 27.4038L8.71775 23.2222C6.36661 21.514 7.57494 17.7951 10.4811 17.7951H17.5953C18.8949 17.7951 20.0468 16.9582 20.4484 15.7222L22.6468 8.9562Z"
          fill={fill}
        />
      ))}
    </svg>
  );
}
