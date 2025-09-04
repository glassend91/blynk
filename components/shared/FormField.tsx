export default function FormField({
  label,
  children,
  hint,
}: {
  label: string;
  children: React.ReactNode;
  hint?: string;
}) {
  return (
    <div>
      <div className="text-sm font-semibold text-[#3B3551]">{label}</div>
      <div className="mt-2">{children}</div>
      {hint ? <div className="mt-1 text-xs text-[var(--cl-sub)]">{hint}</div> : null}
    </div>
  );
}
