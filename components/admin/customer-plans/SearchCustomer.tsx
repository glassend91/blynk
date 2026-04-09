import { ChangeEvent } from "react";

type Props = {
  value: string;
  onChange: (v: string) => void;
  onSearch: () => void;
};

export default function SearchCustomer({ value, onChange, onSearch }: Props) {
  return (
    <div className="flex gap-3">
      <div className="flex w-full max-w-[793px] items-center gap-2 rounded-[10px] border border-[#DFDBE3] bg-[#F8F8F8] px-4 py-[11px]">
        <svg width="20" height="20" viewBox="0 0 20 21" fill="none">
          <path
            d="M9.58464 18.0003C13.9569 18.0003 17.5013 14.4559 17.5013 10.0837C17.5013 5.7114 13.9569 2.16699 9.58464 2.16699C5.21238 2.16699 1.66797 5.7114 1.66797 10.0837C1.66797 14.4559 5.21238 18.0003 9.58464 18.0003Z"
            stroke="#292D32"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M18.3346 18.8337L16.668 17.167"
            stroke="#292D32"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>

        <input
          value={value}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            onChange(e.target.value)
          }
          placeholder="Enter customer email..."
          className="w-full bg-transparent text-[16px] leading-[28px] text-[#0A0A0A] outline-none placeholder:text-[#0A0A0A]"
        />
      </div>

      <button
        onClick={onSearch}
        className="rounded-[6px] bg-[#401B60] px-4 py-[9px] text-[16px] font-semibold text-white"
      >
        Search
      </button>
    </div>
  );
}
