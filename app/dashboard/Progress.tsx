export default function Progress({ value, max = 100 }: { value: number; max?: number }) {
  const pct = Math.max(0, Math.min(100, (value / max) * 100));
  return (
    <div className="h-2.5 w-full rounded-full bg-[#E9E6F0]">
      <div className="h-2.5 rounded-full bg-[#3F205F]" style={{ width: `${pct}%` }} />
    </div>
  );
}
