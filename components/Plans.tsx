import Image from "next/image";
import NBN from "@/app/assets/images/NBNInternet.svg";
import Mobile from "@/app/assets/images/mobile.svg";
import Search from "@/app/assets/images/Search.svg";
import ArrowRight from "@/app/assets/images/arrow-right.svg";
import simpleMobile from "@/app/assets/images/SimpleMobile.svg";

export default function Plans() {
  return (
    <section
      className="relative bg-cover bg-center"
      style={{
        backgroundImage:
          "url('https://api.builder.io/api/v1/image/assets/TEMP/071c92f1ca1fe9e3fede44926d09fde3fd5ff23b?width=3840')",
      }}
    >
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#401B60b3] to-[#190A2FF2]" />

      <div className="relative z-10 mx-auto max-w-[1434px] px-4 md:px-6 py-16 md:py-[150px] flex flex-col items-center gap-10 md:gap-[70px]">
        {/* Title */}
        <div className="flex flex-col items-center gap-4 text-center max-w-[702px]">
          <h2 className="text-white text-[28px] leading-[40px] md:text-[48px] md:leading-[72px] font-bold">
            Simple Plans, Powerful Support
          </h2>
          <p className="text-white text-[16px] leading-[24px] md:text-[18px] md:leading-[27px] font-normal">
            We’ve stripped away the confusing bundles and hidden fees. Just simple NBN and Mobile plans with the freedom of no lock-in contracts. It’s connectivity that’s easy to choose and even easier to use.
          </p>
        </div>

        {/* Plans cards */}
        <div className="flex flex-col md:flex-row items-center gap-8 md:gap-[51px]">
          <PlanCard
            icon={NBN}
            title="NBN Internet"
            desc="Get the reliable home internet you need with our straightforward, no-contract plans. Every plan comes with unlimited data and access to our network of expert local technicians."
            price="From $69/month"
            highlightColor="#F9C01D"
            features={[
              "A range of speed tiers to suit your needs.",
              "No lock-in contracts. BYO modem. No setup fees.",
            ]}
            chip="Local technician support"
            tags={["No setup fees", "No contracts", "No confusion"]}
            inputPlaceholder="Enter your address..."
          />

          <PlanCard
            icon={Mobile}
            title="Simple Mobile Plans"
            desc="Everything you need in a mobile plan, without the confusing contracts and call centres."
            price="From just $25/month"
            highlightColor="#F9C01D"
            features={[
              "Unlimited standard calls & texts",
              "Flexible data that fits your life",
              "No lock-in contracts. Real support",
            ]}
            chip="Flexible data options"
            tags={["No lock-in contracts", "Simple pricing", "Real support"]}
            buttonText="View Mobile Plan"
          />
        </div>

        {/* Footer heading */}
        <p className="text-white text-[32px] leading-[48px] font-bold text-center max-w-[1039px]">
          Your Internet, Mobile, And Tech Expert. All In One Place.
        </p>
      </div>
    </section>
  );
}

/* -------------------- Subcomponent -------------------- */

type PlanCardProps = {
  icon: string;
  title: string;
  desc: string;
  price: string;
  highlightColor: string;
  features: string[];
  chip: string;
  tags: string[];
  inputPlaceholder?: string;
  buttonText?: string;
};

function PlanCard({
  icon,
  title,
  desc,
  price,
  highlightColor,
  features,
  chip,
  tags,
  inputPlaceholder,
  buttonText,
}: PlanCardProps) {
  return (
    <div className="w-full max-w-[560px] flex flex-col gap-6 rounded-[30px] border border-white/20 bg-[rgba(19,2,33,0.7)] px-4 py-6 md:px-[50px] md:py-[50px] backdrop-blur-[0.5px]">
      {/* Icon */}
      <div className="flex items-center m-auto justify-center p-4 rounded-[16px] bg-white">
        <Image src={icon} alt={title} width={60} height={60} />
      </div>

      {/* Title + Desc */}
      <div className="flex flex-col items-center gap-[6px] text-center">
        <h3 className="text-white text-[22px] leading-[32px] md:text-[32px] md:leading-[48px] font-bold">{title}</h3>
        <p className="text-white text-[14px] leading-[22px] md:text-[16px] md:leading-[24px]">{desc}</p>
      </div>

      {/* Price */}
      <div className="flex justify-start" >
        <p className="text-[32px] leading-[48px] font-bold text-white">
          {price.split(" ")[0]}{" "}
          <span style={{ color: highlightColor }}>{price.split(" ").slice(1).join(" ")}</span>
        </p>
      </div>

      {/* Features */}
      <ul className="flex flex-col items-start gap-3 md:gap-4 w-full">
        {features.map((feature, idx) => (
          <li key={idx} className="flex items-center gap-2 text-white text-[14px] leading-[22px] md:text-[16px] md:leading-[24px]">
            <span className="h-[20px] w-[20px] flex-shrink-0 rounded-full bg-[#8B8B8B]" />
            {feature}
          </li>
        ))}
      </ul>

      {/* Chip */}
      <div className="flex items-center justify-center px-4 py-2 rounded-full bg-white text-black text-[13px] leading-[19.5px]">
        {chip}
      </div>

      {/* Tags */}
      <div className="flex items-center flex-wrap gap-3 md:gap-5">
        {tags.map((tag, idx) => (
          <div key={idx} className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-white" />
            <span className="text-white text-[12px] leading-[18px] md:text-[14px] md:leading-[21px]">{tag}</span>
          </div>
        ))}
      </div>

      {/* Input or button */}
      {inputPlaceholder ? (
        <div className="flex items-center gap-2 w-full min-w-0">
          <input
            type="text"
            placeholder={inputPlaceholder}
            className="w-full min-w-0 flex-1 px-4 py-3 rounded-[16px] bg-[#2C1B3F] border border-[#401B600D] text-[#6F6C90] text-[14px]"
          />
          <button className="flex flex-shrink-0 items-center justify-center rounded-[16px] bg-white">
            <Image src={Search} alt="search" width={48} height={48} />
          </button>
        </div>
      ) : (
        <button className="w-full md:w-auto px-4 py-3 flex items-center justify-center gap-3 rounded-[8px] bg-white text-[#401B60] font-bold text-[16px] leading-[24px]">
          <Image src={simpleMobile} alt="mobile" width={48} height={48} />
          {buttonText}
          <Image src={ArrowRight} alt="arrow" width={36} height={36} />
        </button>
      )}
    </div>
  );
}
