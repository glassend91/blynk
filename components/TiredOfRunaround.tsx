export default function TiredOfRunaround() {
  return (
    <section className="mx-auto max-w-[1171px] px-6 py-24 md:py-28">
      {/* Title */}
      <div className="flex flex-col items-center gap-4">
        <img
          src="https://api.builder.io/api/v1/image/assets/TEMP/d03754bc671618db36784ac3fe52277a37a33ffe?width=288"
          alt="devices"
          className="h-[131px] w-[144px]"
        />
        <h2 className="text-center text-4xl md:text-5xl font-extrabold text-black">
          Tired of the Runaround? We are too
        </h2>
        <p className="text-center max-w-[702px] text-[#6F6C90] text-[18px] leading-[27px]">
          We started Blynk because we believe getting great internet shouldn’t be hassle.
        </p>
      </div>

      {/* Feature cards */}
      <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Card 1 */}
        <div className="flex flex-col items-center gap-4 rounded-2xl border border-[#401B60]/5 bg-[linear-gradient(132deg,#FDFAFF_26.52%,#FEFBFF_131.97%)] px-7 py-11 shadow-sm">
          <div className="grid place-items-center h-20 w-20 rounded-[10px] bg-[#401B60]">
            {/* headset icon */}
            <svg width="34" height="35" viewBox="0 0 34 35" fill="none">
              <g clipPath="url(#a)">
                <path d="M12.04 13.634c0 .781.18 1.52.505 2.178a4.98 4.98 0 0 0-1.184 3.195 7.43 7.43 0 0 1-2.153-5.372c0-4.832 4.423-8.651 9.433-7.623 2.949.606 5.339 2.982 5.968 5.928.19.89.225 1.761.129 2.594-.082.706-.701 1.227-1.412 1.227h-.064c-.838 0-1.428-.746-1.335-1.579.062-.56.03-1.148-.113-1.747-.422-1.775-1.869-3.213-3.647-3.623-3.239-.744-6.126 1.709-6.126 4.823ZM6.53 11.799c.388-2.257 1.491-4.314 3.203-5.92 2.166-2.03 5.002-3.033 7.975-2.849 5.6.363 9.979 5.269 9.914 11.142-.027 2.459-2.086 4.417-4.544 4.417h-3.408a3.093 3.093 0 1 0-2.705 4.803c.762 0 1.452-.305 1.96-.795h4.154c3.993 0 7.321-3.18 7.377-7.172.105-7.397-5.451-13.588-12.564-14.047-3.774-.245-7.354 1.037-10.095 3.609C5.673 5.805 4.26 8.44 3.752 11.275c-.154.861.527 1.652 1.401 1.652.669 0 1.265-.466 1.377-1.127ZM17 24.259c-5.235 0-9.764 3.247-11.27 8.078-.234.746.184 1.541.93 1.775.746.225 1.54-.186 1.774-.931 1.118-3.584 4.639-6.088 8.564-6.088s7.447 2.504 8.563 6.088c.19.606.749.994 1.354.994.141 0 .281-.021.423-.063.747-.234 1.163-1.029.931-1.775-1.506-4.83-6.035-8.078-11.27-8.078Z" fill="white"/>
              </g>
              <defs><clipPath id="a"><rect width="34" height="34" fill="white" transform="translate(0 .176)"/></clipPath></defs>
            </svg>
          </div>
          <div className="text-center space-y-2">
            <h3 className="text-[22px] font-bold text-black">Support From Actual Techs</h3>
            <p className="text-[#6F6C90] text-[16px] leading-[24px]">
              Our support is not a call centre. It is a network of certified local technicians who solve problems fast.
            </p>
          </div>
        </div>

        {/* Card 2 */}
        <div className="flex flex-col items-center gap-4 rounded-2xl border border-[#401B60]/5 bg-[linear-gradient(132deg,#FDFAFF_26.52%,#FEFBFF_131.97%)] px-7 py-11 shadow-sm">
          <div className="grid place-items-center h-20 w-20 rounded-[10px] bg-[#401B60]">
            {/* generic icon */}
            <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
              <circle cx="18" cy="18" r="16" stroke="white" strokeWidth="2"/>
              <path d="M10 18h16M18 10v16" stroke="white" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </div>
          <div className="text-center space-y-2">
            <h3 className="text-[22px] font-bold text-black">Simple Plans</h3>
            <p className="text-[#6F6C90] text-[16px] leading-[24px]">
              Clear pricing without lock-ins or hidden fees. Pick what you need.
            </p>
          </div>
        </div>

        {/* Card 3 */}
        <div className="flex flex-col items-center gap-4 rounded-2xl border border-[#401B60]/5 bg-[linear-gradient(132deg,#FDFAFF_26.52%,#FEFBFF_131.97%)] px-7 py-11 shadow-sm">
          <div className="grid place-items-center h-20 w-20 rounded-[10px] bg-[#401B60]">
            {/* shield/check */}
            <svg width="34" height="34" viewBox="0 0 34 34" fill="none">
              <path d="M17 3l10 5v8c0 6.5-4.6 10.9-10 13-5.4-2.1-10-6.5-10-13V8l10-5Z" stroke="white" strokeWidth="2"/>
              <path d="m12 18 3 3 7-7" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <div className="text-center space-y-2">
            <h3 className="text-[22px] font-bold text-black">Reliable Service</h3>
            <p className="text-[#6F6C90] text-[16px] leading-[24px]">
              Solid network, transparent support, and easy account tools.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
