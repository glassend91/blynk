export type TabKey = "integrations" | "notification" | "security" | "system";

const tabs: { key: TabKey; label: string }[] = [
  { key: "integrations", label: "Integrations" },
  { key: "notification", label: "Notification" },
  { key: "security", label: "Security" },
  { key: "system", label: "System" },
];

export default function SettingsTabs({
  active,
  onChange,
}: {
  active: TabKey;
  onChange: (k: TabKey) => void;
}) {
  return (
    <div className="flex gap-2">
      {tabs.map((t) => {
        const isActive = t.key === active;
        return (
          <button
            key={t.key}
            onClick={() => onChange(t.key)}
            className={[
              "rounded-[8px] px-4 py-[9px] text-[14px] font-semibold",
              isActive
                ? "bg-[#ECE8F5] text-[#401B60]"
                : "bg-[#F8F8F8] text-[#6F6C90] border border-[#ECE8F5]",
            ].join(" ")}
          >
            {t.label}
          </button>
        );
      })}
    </div>
  );
}
