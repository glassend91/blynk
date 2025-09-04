import { ReactNode } from "react";

/** Outer lilac canvas used in every step body */
export default function SectionPanel({ children }: { children: ReactNode }) {
  return (
    <section className="mt-6 rounded-[20px] border border-[#E9E3F2] bg-[#FBF8FF] px-6 py-10 sm:px-10 sm:py-12">
      {children}
    </section>
  );
}
