import Image from "next/image";

export default function SupportCTA() {
  return (
    <section className="relative">
      {/* Background */}
      <div className="absolute inset-0 -z-10">
        <img
          alt="bg"
          src="https://api.builder.io/api/v1/image/assets/TEMP/071c92f1ca1fe9e3fede44926d09fde3fd5ff23b?width=3840"
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#401B60]/70 to-[#190A2F]/95" />
      </div>

      <div className="max-w-[1171px] mx-auto px-6 py-20 md:py-28">
        <div className="grid grid-cols-1 md:grid-cols-[1fr,320px] items-center gap-10">
          {/* Left Content */}
          <div className="flex flex-col items-center md:items-start text-center md:text-left gap-6">
            <div>
              <h2 className="text-white text-4xl md:text-5xl font-extrabold">
                Still have questions?
              </h2>
              <p className="text-white mt-2 text-lg">
                We are here to help you find the perfect solution
              </p>
            </div>

            {/* Button */}
            <a
              href="#local-tech"
              className="inline-flex items-center gap-2 rounded-md bg-white px-4 py-3 font-semibold text-primary"
            >
              <svg width="24" height="25" viewBox="0 0 24 25" fill="none">
                <path
                  d="M12 14.244C13.7231 14.244 15.12 12.8471 15.12 11.124C15.12 9.40086 13.7231 8.00399 12 8.00399C10.2769 8.00399 8.88001 9.40086 8.88001 11.124C8.88001 12.8471 10.2769 14.244 12 14.244Z"
                  stroke="#401B60"
                  strokeWidth="1.5"
                />
                <path
                  d="M3.6196 9.30452C5.5896 0.64452 18.4196 0.65452 20.3796 9.31452C21.5296 14.3945 18.3696 18.6945 15.5996 21.3545C13.5896 23.2945 10.4096 23.2945 8.3896 21.3545C5.6296 18.6945 2.4696 14.3845 3.6196 9.30452Z"
                  stroke="#401B60"
                  strokeWidth="1.5"
                />
              </svg>
              Find a Blynk-Approved Technician
            </a>
          </div>

          {/* Right Image */}
          <div className="mx-auto md:mx-0">
            <Image
              src="https://api.builder.io/api/v1/image/assets/TEMP/0f7b9c8bd0f068d686dfe65fd55224bb7ef7d2d8?width=576"
              alt="Technician"
              width={288}
              height={316}
              className="h-auto w-[260px] md:w-[288px]"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
