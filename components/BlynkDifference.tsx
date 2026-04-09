// components/BlynkDifference.tsx
export default function BlynkDifference() {
  return (
    <section className="bg-cover bg-center bg-[#401B60]/10">
      {/* section padding 100px; inner canvas width 1434px */}
      <div className="mx-auto max-w-[1434px] px-6 py-[100px] md:py-4 lg:py-10">
        {/* top emblem + heading block */}
        <div className="flex flex-col items-center">
          <img
            src="https://api.builder.io/api/v1/image/assets/TEMP/b67f8bd3f410fd95108432fab6865630dd7a8931?width=288"
            alt="devices"
            className="h-[131px] w-[144px]"
          />

          <div className="mt-[-10px] flex flex-col items-center gap-4">
            {/* H2: 48/72 centered, max width 922px */}
            <h2 className="mx-auto max-w-[922px] text-center text-[48px] leading-[72px] font-bold text-black">
              The Blynk Difference: Real Technicians, Real Solutions
            </h2>

            {/* subcopy: 18/27 centered, width 922px */}
            <p className="mx-auto max-w-[922px] text-center text-[18px] leading-[27px] text-[#6F6C90]">
              What makes us truly unique is our support model. We&apos;re
              building a new kind of support network by partnering with a
              growing number of trusted, independent computer stores in
              communities across Australia—the places you already go for expert
              tech help.
            </p>
          </div>
        </div>

        {/* cards row: gap 30px, card padding 44px 30px, radius 24, border rgba(64,27,96,0.05) */}
        <div className="mt-[50px] grid grid-cols-1 items-stretch gap-[30px] md:grid-cols-3">
          {/* Card 1 */}
          <div className="flex flex-col items-center gap-4 rounded-[24px] border border-[rgba(64,27,96,0.05)] bg-[linear-gradient(132deg,#FDFAFF_26.52%,#FEFBFF_131.97%)] px-[30px] py-[44px]">
            <div className="grid h-20 w-20 place-items-center rounded-[10px] bg-[#401B60]">
              {/* user-headset 34x34 */}
              <svg width="34" height="34" viewBox="0 0 34 34" fill="none">
                <g clipPath="url(#a)">
                  <path
                    d="M12.041 13.449c0 .781.181 1.52.505 2.178a4.98 4.98 0 0 0-1.184 3.195c-1.333-1.4-2.153-3.292-2.153-5.372 0-4.832 4.423-8.651 9.434-7.623 2.949.606 5.339 2.982 5.968 5.928.19.89.225 1.761.129 2.594-.082.706-.701 1.227-1.412 1.227h-.064c-.838 0-1.428-.746-1.335-1.579.062-.56.03-1.148-.113-1.747-.422-1.775-1.869-3.213-3.647-3.623-3.239-.744-6.126 1.709-6.126 4.823Z"
                    fill="white"
                  />
                  <path
                    d="M6.53 11.615c.388-2.257 1.491-4.314 3.203-5.92 2.166-2.03 5.002-3.033 7.975-2.849 5.6.363 9.979 5.269 9.914 11.142-.027 2.459-2.086 4.417-4.544 4.417h-3.408a3.093 3.093 0 1 0-2.705 4.803c.762 0 1.452-.305 1.96-.795h4.154c3.993 0 7.321-3.18 7.377-7.172.105-7.397-5.451-13.588-12.564-14.047-3.774-.245-7.354 1.037-10.095 3.609-2.124 1.99-3.536 4.625-4.045 7.46-.154.861.527 1.652 1.401 1.652.669 0 1.265-.466 1.377-1.127Z"
                    fill="white"
                  />
                  <path
                    d="M17 24.074c-5.235 0-9.764 3.247-11.27 8.078-.234.746.184 1.541.93 1.775a1.5 1.5 0 0 0 1.774-.931c1.118-3.584 4.639-6.088 8.564-6.088s7.447 2.504 8.563 6.088a1.5 1.5 0 0 0 2.199.931c.747-.234 1.163-1.029.931-1.775-1.506-4.83-6.035-8.078-11.27-8.078Z"
                    fill="white"
                  />
                </g>
                <defs>
                  <clipPath id="a">
                    <rect width="34" height="34" fill="white" />
                  </clipPath>
                </defs>
              </svg>
            </div>

            <div className="w-full text-center">
              <h3 className="text-[22px] leading-[33px] font-bold text-black">
                Real Experts, Not Scripts.
              </h3>
              <p className="mt-2 text-[16px] leading-[24px] text-[#6F6C90]">
                We believe support should be a conversation, not a checklist.
                When you have a problem, you&apos;ll talk to an experienced,
                local computer technician who will listen to understand your
                issue and has the expertise to actually fix it.
              </p>
            </div>
          </div>

          {/* Card 2 */}
          <div className="flex flex-col items-center gap-4 rounded-[24px] border border-[rgba(64,27,96,0.05)] bg-[linear-gradient(132deg,#FDFAFF_26.52%,#FEFBFF_131.97%)] px-[30px] py-[44px]">
            <div className="grid h-20 w-20 place-items-center rounded-[10px] bg-[#401B60]">
              {/* document 34x34 */}
              <svg width="34" height="34" viewBox="0 0 34 34" fill="none">
                <g clipPath="url(#b)">
                  <path
                    d="M24.083 19.824a1.333 1.333 0 0 1-1.417 1.417H11.333a1.333 1.333 0 1 1 0-2.667h11.333a1.333 1.333 0 0 1 1.417 1.25Zm-5.667 4.25H11.333a1.333 1.333 0 1 0 0 2.667h7.083a1.333 1.333 0 0 0 0-2.667ZM31.166 14.845V26.908c-.002 1.878-.749 3.678-2.077 5.006-1.328 1.328-3.128 2.075-5.006 2.077H9.916c-1.878-.002-3.678-.749-5.006-2.077A7.085 7.085 0 0 1 2.833 26.908V7.074C2.835 5.196 3.582 3.396 4.91 2.068 6.238.74 8.038-.007 9.916-.009h6.397c1.303-.003 2.594.252 3.797.75a10.45 10.45 0 0 1 3.215 2.154l4.936 4.938A10.39 10.39 0 0 1 30.416 11.048c.499 1.204.754 2.494.75 3.797Zm-6.011-9.946a10.42 10.42 0 0 0-1.322-.955v6.114c0 .376.149.736.415 1.002.265.266.626.415 1.001.415h6.114a10.42 10.42 0 0 0-.955-1.322l-5.253-5.254ZM28.333 14.845a2.76 2.76 0 0 0-.066-.687h-7.017c-1.127 0-2.208-.447-3.005-1.244a4.25 4.25 0 0 1-1.245-3.005V2.825c-.23-.022-.456-.067-.688-.067H9.916c-1.127 0-2.208.448-3.005 1.245A4.25 4.25 0 0 0 5.666 7.074V26.908a4.25 4.25 0 0 0 1.245 3.005 4.25 4.25 0 0 0 3.005 1.245H24.083a4.25 4.25 0 0 0 3.005-1.245 4.25 4.25 0 0 0 1.245-3.005V14.845Z"
                    fill="white"
                  />
                </g>
                <defs>
                  <clipPath id="b">
                    <rect width="34" height="34" fill="white" />
                  </clipPath>
                </defs>
              </svg>
            </div>

            <div className="w-full text-center">
              <h3 className="text-[22px] leading-[33px] font-bold text-black">
                Radically Simple Plans
              </h3>
              <p className="mt-2 text-[16px] leading-[24px] text-[#6F6C90]">
                We believe in transparency. That means no confusing bundles, no
                hidden fees, and no lock-in contracts. Just straightforward NBN
                and Mobile plans that are easy to understand and even easier to
                use.
              </p>
            </div>
          </div>

          {/* Card 3 */}
          <div className="flex flex-col items-center gap-4 rounded-[24px] border border-[rgba(64,27,96,0.05)] bg-[linear-gradient(132deg,#FDFAFF_26.52%,#FEFBFF_131.97%)] px-[30px] py-[44px]">
            <div className="grid h-20 w-20 place-items-center rounded-[10px] bg-[#401B60]">
              {/* messages 34x34 */}
              <svg width="34" height="34" viewBox="0 0 34 34" fill="none">
                <g clipPath="url(#c)">
                  <path
                    d="M29.75 5.658H25.5V4.241C25.5 1.898 23.593-.009 21.25-.009H4.25C1.907-.009 0 1.898 0 4.241v21.043c0 1.124.616 2.153 1.606 2.682.45.242.945.361 1.938.361.589 0 1.177-.172 1.686-.51l3.77-2.513v4.435h15.154l5.616 3.744c.51.34 1.096.511 1.685.511.493 0 .986-.12 1.438-.362C33.385 33.104 34 32.076 34 30.951V9.908c0-2.343-1.907-4.25-4.25-4.25ZM3.159 25.461c-.027.017-.106.068-.216.01-.112-.059-.112-.154-.112-.185V4.241c0-.782.636-1.417 1.417-1.417H21.25c.78 0 1.416.635 1.416 1.417V21.24H9.487l-6.328 4.22ZM31.167 30.952c0 .03 0 .127-.112.186-.112.059-.188.008-.214-.009l-6.328-4.22H11.333v-2.833H25.5V8.491h4.25c.78 0 1.417.635 1.417 1.417v21.044Z"
                    fill="white"
                  />
                </g>
                <defs>
                  <clipPath id="c">
                    <rect width="34" height="34" fill="white" />
                  </clipPath>
                </defs>
              </svg>
            </div>

            <div className="w-full text-center">
              <h3 className="text-[22px] leading-[33px] font-bold text-black">
                Founded on Service
              </h3>
              <p className="mt-2 text-[16px] leading-[24px] text-[#6F6C90]">
                Blynk was founded on the conviction that customers deserve
                better. We&apos;re here to build relationships and provide
                support you can actually understand and trust, every step of the
                way.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
