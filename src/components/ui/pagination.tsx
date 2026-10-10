"use client";

import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";

interface PaginationProps {
  page: number;
  totalPages: number;
  total?: number;
  limit?: number;
  onPageChange: (page: number) => void;
  className?: string;
}

function getPageNumbers(current: number, total: number): (number | "ellipsis")[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);

  const pages: (number | "ellipsis")[] = [1];
  const start = Math.max(2, current - 1);
  const end = Math.min(total - 1, current + 1);

  if (start > 2) pages.push("ellipsis");
  for (let i = start; i <= end; i++) pages.push(i);
  if (end < total - 1) pages.push("ellipsis");
  pages.push(total);

  return pages;
}

export function Pagination({ page, totalPages, total, limit, onPageChange, className = "" }: PaginationProps) {
  if (totalPages <= 1) return null;

  const pages = getPageNumbers(page, totalPages);
  const from = total !== undefined && limit ? Math.min(total, (page - 1) * limit + 1) : null;
  const to = total !== undefined && limit ? Math.min(total, page * limit) : null;

  const btnBase =
    "w-9 h-9 flex items-center justify-center rounded-xl text-xs font-semibold transition-all border disabled:opacity-30 disabled:cursor-not-allowed";
  const btnIdle = "bg-[#0A0F1E] border-slate-800 text-slate-400 hover:text-white hover:border-slate-600";
  const btnActive = "bg-[#00FF85] border-[#00FF85] text-black shadow-lg shadow-[#00FF85]/10";

  return (
    <div className={`flex flex-col sm:flex-row items-center justify-between gap-4 ${className}`}>
      {from !== null && to !== null ? (
        <p className="text-xs text-slate-500 font-mono order-2 sm:order-1">
          Showing <span className="text-slate-300">{from}–{to}</span> of <span className="text-slate-300">{total}</span> ventures
        </p>
      ) : (
        <span className="order-2 sm:order-1" />
      )}

      <div className="flex items-center gap-1.5 order-1 sm:order-2">
        <button
          aria-label="First page"
          className={`${btnBase} ${btnIdle} hidden sm:flex`}
          disabled={page <= 1}
          onClick={() => onPageChange(1)}
        >
          <ChevronsLeft className="w-4 h-4" />
        </button>
        <button
          aria-label="Previous page"
          className={`${btnBase} ${btnIdle}`}
          disabled={page <= 1}
          onClick={() => onPageChange(page - 1)}
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        {pages.map((p, i) =>
          p === "ellipsis" ? (
            <span key={`e-${i}`} className="w-9 h-9 flex items-center justify-center text-slate-600 text-xs select-none">
              &hellip;
            </span>
          ) : (
            <button
              key={p}
              aria-label={`Page ${p}`}
              aria-current={p === page ? "page" : undefined}
              className={`${btnBase} ${p === page ? btnActive : btnIdle}`}
              onClick={() => onPageChange(p)}
            >
              {p}
            </button>
          ),
        )}

        <button
          aria-label="Next page"
          className={`${btnBase} ${btnIdle}`}
          disabled={page >= totalPages}
          onClick={() => onPageChange(page + 1)}
        >
          <ChevronRight className="w-4 h-4" />
        </button>
        <button
          aria-label="Last page"
          className={`${btnBase} ${btnIdle} hidden sm:flex`}
          disabled={page >= totalPages}
          onClick={() => onPageChange(totalPages)}
        >
          <ChevronsRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
