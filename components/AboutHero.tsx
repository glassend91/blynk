import Image from "next/image";

export default function AboutHero() {
  return (
    <section className="bg-[#401B60]/10 bg-cover bg-center">
      <div className="mx-auto max-w-[1400px] px-6 py-20 md:py-4 lg:py-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          <div className="flex flex-col gap-5">
            <h1 className="text-black text-4xl md:text-6xl font-extrabold">
              We are not a big telco. That is our strength.
            </h1>
            <p className="text-[#6F6C90] text-[22px] leading-[33px]">
              We saw a gap between complex products and the human support people need. So we built a telco that puts real connection first.
            </p>
          </div>

          <div className="relative">
            <Image
              src="https://api.builder.io/api/v1/image/assets/TEMP/a55e926feabd930e47bce358ad9bbf8fbed13c7c?width=872"
              alt="Blynk technician"
              width={400}
              height={400}
              className="w-full h-auto"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
