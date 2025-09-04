export default function SectionPanel({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-[22px] border border-[#E7E1EF] bg-[#FBF7FF] p-6 md:p-8">
      {children}
    </div>
  );
}
