"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export interface CurrencyDef {
  code: string;
  label: string;
  flag: string;
}

// USD stays the platform's settlement/default currency.
// Rates are static indicative FX (USD base) — wire a live rates feed before launch.
export const CURRENCIES: CurrencyDef[] = [
  { code: "USD", label: "US Dollar", flag: "🇺🇸" },
  { code: "GHS", label: "Ghanaian Cedi", flag: "🇬🇭" },
  { code: "NGN", label: "Nigerian Naira", flag: "🇳🇬" },
  { code: "KES", label: "Kenyan Shilling", flag: "🇰🇪" },
  { code: "ZAR", label: "South African Rand", flag: "🇿🇦" },
  { code: "EUR", label: "Euro", flag: "🇪🇺" },
  { code: "GBP", label: "British Pound", flag: "🇬🇧" },
];

const RATES: Record<string, number> = {
  USD: 1,
  GHS: 12.5,
  NGN: 1550,
  KES: 129,
  ZAR: 17.5,
  EUR: 0.92,
  GBP: 0.79,
};

const STORAGE_KEY = "d4_currency";

interface CurrencyContextValue {
  currency: string;
  setCurrency: (code: string) => void;
  /** Convert a USD amount and format it in the selected currency. */
  format: (amountUsd: number | null | undefined, opts?: { suffix?: string }) => string;
}

const CurrencyContext = createContext<CurrencyContextValue | null>(null);

export function CurrencyProvider({ children }: { children: ReactNode }) {
  const [currency, setCurrencyState] = useState("USD");
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved && RATES[saved]) setCurrencyState(saved);
    setHydrated(true);
  }, []);

  const setCurrency = (code: string) => {
    if (!RATES[code]) return;
    setCurrencyState(code);
    localStorage.setItem(STORAGE_KEY, code);
  };

  const format: CurrencyContextValue["format"] = (amountUsd, opts = {}) => {
    if (amountUsd == null || Number.isNaN(Number(amountUsd))) return "—";
    const converted = Number(amountUsd) * RATES[currency];
    const formatted = new Intl.NumberFormat("en-US", {
      style: "currency",
      currency,
      maximumFractionDigits: 0,
    }).format(converted);
    return formatted + (opts.suffix ?? "");
  };

  return (
    <CurrencyContext.Provider value={{ currency: hydrated ? currency : "USD", setCurrency, format }}>
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency() {
  const ctx = useContext(CurrencyContext);
  if (!ctx) throw new Error("useCurrency must be used within <CurrencyProvider>");
  return ctx;
}
