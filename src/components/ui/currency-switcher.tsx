"use client";

import { Globe } from "lucide-react";
import { CURRENCIES, useCurrency } from "@/lib/currency";

export function CurrencySwitcher({ full = false }: { full?: boolean }) {
  const { currency, setCurrency } = useCurrency();

  return (
    <div
      className={`relative flex items-center gap-2 bg-[#0A0F1E] border border-slate-700 rounded-lg ${
        full ? "px-4 py-3 w-full" : "px-2.5 py-1.5"
      }`}
    >
      <Globe className={`${full ? "w-4 h-4" : "w-3.5 h-3.5"} text-slate-400 shrink-0 pointer-events-none`} />
      <select
        value={currency}
        onChange={(e) => setCurrency(e.target.value)}
        aria-label="Display currency"
        className={`appearance-none bg-transparent text-white font-semibold outline-none cursor-pointer pr-5 ${
          full ? "text-sm w-full" : "text-xs"
        }`}
      >
        {CURRENCIES.map((c) => (
          <option key={c.code} value={c.code} className="bg-[#131A2E] text-white">
            {c.flag} {c.code} — {c.label}
          </option>
        ))}
      </select>
      <svg
        className="absolute right-2.5 w-3 h-3 text-slate-500 pointer-events-none"
        fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
      </svg>
    </div>
  );
}
