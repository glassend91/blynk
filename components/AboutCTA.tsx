import Image from "next/image";

export default function AboutCTA() {
  return (
    <section className="px-6 pb-[150px] md:py-4 lg:py-10">
      <div className="mx-auto max-w-[1434px] rounded-[30px] bg-[image:linear-gradient(90deg,rgba(64,27,96,0.89)_0%,rgba(64,27,96,0.71)_52.33%,rgba(64,27,96,0.89)_100%),url(https://api.builder.io/api/v1/image/assets/TEMP/227c24f5fb765986eef5a7a19e932ae2eef85af5?width=2868)] bg-cover bg-center">
        <div className="flex flex-col md:flex-row items-center justify-center gap-10 px-6 py-8 md:py-10">
          <Image
            src="https://api.builder.io/api/v1/image/assets/TEMP/03d64740be0d0396a6eab4648e558959f997f428?width=608"
            alt="character"
            width={304}
            height={316}
            className="hidden md:block h-[316px] w-[304px]"
          />

          <div className="flex flex-col items-center gap-6 text-center">
            <div className="space-y-2">
              <h3 className="text-white text-4xl md:text-5xl font-extrabold">Still have questions?</h3>
              <p className="text-white text-[18px] leading-[27px]">We can help you find the right solution.</p>
            </div>

            <a
              href="#local-tech"
              className="inline-flex items-center gap-2 rounded-[8px] bg-white px-4 py-3 font-semibold text-[#401B60]"
            >
              <svg width="24" height="25" viewBox="0 0 24 25" fill="none">
                <path d="M12 14.244C13.7231 14.244 15.12 12.8471 15.12 11.124C15.12 9.40086 13.7231 8.00399 12 8.00399C10.2769 8.00399 8.88001 9.40086 8.88001 11.124C8.88001 12.8471 10.2769 14.244 12 14.244Z" stroke="#401B60" strokeWidth="1.5" />
                <path d="M3.6196 9.30452C5.5896 0.64452 18.4196 0.65452 20.3796 9.31452C21.5296 14.3945 18.3696 18.6945 15.5996 21.3545C13.5896 23.2945 10.4096 23.2945 8.3896 21.3545C5.6296 18.6945 2.4696 14.3845 3.6196 9.30452Z" stroke="#401B60" strokeWidth="1.5" />
              </svg>
              Find a Blynk-Approved Technician
            </a>
          </div>

          <Image
            src="https://api.builder.io/api/v1/image/assets/TEMP/0f7b9c8bd0f068d686dfe65fd55224bb7ef7d2d8?width=576"
            alt="technician"
            width={288}
            height={316}
            className="h-[316px] w-[288px]"
          />
        </div>
      </div>
    </section>
  );
}
