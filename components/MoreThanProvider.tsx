// components/MoreThanNeighbour.tsx
import Image from "next/image";
import mapSrc from "@/app/assets/images/Morethanproviders.png";


type Props = {
  /** High-res SVG/PNG of the Australia network map from your design */
  mapSrc?: string;
};

export default function MoreThanNeighbour({

}: Props) {
  return (
    <section className="relative">
      {/* background wash */}
      <div
        className="pointer-events-none absolute inset-0 -z-10 bg-[#401B60]/10"
        aria-hidden
      />

      {/* canvas: 1434px, generous vertical rhythm */}
      <div className="mx-auto max-w-[1434px] px-6 py-[100px] md:py-4 lg:py-10">
        <div className="grid grid-cols-1 items-center gap-[48px] md:grid-cols-2">
          {/* left copy block */}
          <div className="relative">
            {/* decorative rails (thin vertical ticks) */}
            <span className="absolute left-[-16px] top-[6px] hidden h-[28px] w-[2px] rounded bg-[#3BA3FF] md:block" />
            <span className="absolute left-[-16px] bottom-[6px] hidden h-[28px] w-[2px] rounded bg-[#7A4DB3] md:block" />

            <h2 className="text-[40px] leading-[52px] md:text-[44px] md:leading-[58px] font-extrabold text-[#170F49] tracking-[-0.2px]">
              More Than a Provider. We&apos;re
              <br className="hidden md:block" /> Your Neighbour.
            </h2>

            <p className="mt-5 max-w-[640px] text-[18px] leading-[30px] text-[#6F6C90]">
              At Blynk, our commitment to local goes beyond just our support network. We believe in the power of
              community. As we grow, our goal is to invest back into the neighbourhoods we serve, whether that&rsquo;s
              by supporting local events, partnering with other small businesses, or simply being a friendly, familiar
              face you can rely on. Because great service starts with being a great neighbour.
            </p>
          </div>

          {/* right visual */}
          <div className="relative">
            <div className="relative mx-auto w-full max-w-[620px]">
              <Image
                src={mapSrc}
                alt="Blynk network across Australia"
                width={1240}
                height={920}
                priority
                className="h-auto w-full"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
