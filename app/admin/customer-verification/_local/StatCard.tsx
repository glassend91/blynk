type IconKey = "clock" | "check" | "warning" | "send";

const Icon = ({ name }: { name: IconKey }) => {
  const base = "w-4 h-4";
  switch (name) {
    case "clock":
      return (
        <svg className={base} viewBox="0 0 24 24" fill="none">
          <path
            d="M12 8v5l3 2"
            stroke="#6F6C90"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          <circle cx="12" cy="12" r="9" stroke="#6F6C90" strokeWidth="1.5" />
        </svg>
      );
    case "check":
      return (
        <svg className={base} viewBox="0 0 24 24" fill="none">
          <path
            d="m5 12 4 4 10-10"
            stroke="#6F6C90"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </svg>
      );
    case "warning":
      return (
        <svg className={base} viewBox="0 0 24 24" fill="none">
          <path
            d="M12 9v4"
            stroke="#6F6C90"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          <path
            d="M12 17h.01"
            stroke="#6F6C90"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          <path
            d="m10.3 3.9-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.7-3.1l-8-14a2 2 0 0 0-3.4 0Z"
            stroke="#6F6C90"
            strokeWidth="1.5"
          />
        </svg>
      );
    case "send":
      return (
        <svg className={base} viewBox="0 0 24 24" fill="none">
          <path
            d="m22 2-7 20-4-9-9-4 20-7Z"
            stroke="#6F6C90"
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
        </svg>
      );
  }
};

export function StatCard({
  label,
  value,
  icon,
}: {
  label: string;
  value: number | string;
  icon: IconKey;
}) {
  return (
    <div className="rounded-xl border border-[#EEEAF4] bg-white p-5 shadow-[0_1px_0_#EEEAF4,0_8px_24px_rgba(24,8,56,0.06)]">
      <div className="mb-2 flex items-center justify-between">
        <span className="text-[14px] font-semibold text-[#0A0A0A]">
          {label}
        </span>
        <span className="rounded-md bg-[#F7F4FB] p-2">
          <Icon name={icon} />
        </span>
      </div>
      <div className="text-[28px] font-bold text-[#0A0A0A]">{value}</div>
    </div>
  );
}
