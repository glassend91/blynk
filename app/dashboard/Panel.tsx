import { ReactNode } from "react";

export default function Panel({
  children,
  className = "",
  as = "div",
}: { children: ReactNode; className?: string; as?: keyof JSX.IntrinsicElements }) {
  const Tag = as as any;
  return (
    <Tag
      className={[
        "rounded-[16px] border border-[#EEEAF4] bg-white",
        "shadow-[0_32px_80px_rgba(0,0,0,0.08)]",
        className,
      ].join(" ")}
    >
      {children}
    </Tag>
  );
}
