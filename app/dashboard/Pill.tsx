export function Pill({
  tone = "neutral",
  children,
}: {
  tone?: "neutral" | "purple" | "green" | "red" | "grey";
  children: React.ReactNode;
}) {
  const tones: Record<string, string> = {
    neutral: "bg-[#F4F3F7] text-[#3F205F]",
    purple: "bg-[#EFE9F7] text-[#3F205F]",
    green: "bg-[#EAF8EE] text-[#2F8E51]",
    red: "bg-[#FDECEC] text-[#C63D3D]",
    grey: "bg-[#EFF1F5] text-[#667085]",
  };
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-[8px] px-3 py-1 text-[12px] font-semibold ${tones[tone]}`}
    >
      {children}
    </span>
  );
}
