export default function AuthAvatar() {
  return (
    <div className="flex items-center gap-3">
      <div className="grid h-9 w-9 place-items-center rounded-full bg-[#3F205F] text-white text-sm font-semibold">
        JS
      </div>
      <div className="leading-tight">
        <div className="text-[14px] font-semibold text-[#0A0A0A]">John Smith</div>
        <div className="text-[12px] text-[#6F6C90]">demo@example.com</div>
      </div>
    </div>
  );
}
