import { ChevronUp, ChevronDown, ChevronsUpDown } from "lucide-react";
import { ETFData, SortKey } from "@/types/etf.types";
import { useStore } from "@/store/useStore";
import { formatCurrency, formatPercent, formatVolume } from "@/utils/formatters";
import { FilterBar } from "./FilterBar";

interface ETFTableProps {
  etfs: ETFData[];
  totalCount: number;
  isLoading: boolean;
}

// Column definitions — label, sort key, and alignment
const COLUMNS: Array<{ label: string; key: SortKey; align: "left" | "right" }> = [
  { label: "Rank",       key: "rank",          align: "left"  },
  { label: "Ticker",     key: "ticker",        align: "left"  },
  { label: "Price",      key: "cmp",           align: "right" },
  { label: "20 DMA",     key: "dma20",         align: "right" },
  { label: "% vs DMA",   key: "percentFromDMA",align: "right" },
  { label: "Volume",     key: "volume",        align: "right" },
];

function SortIcon({ columnKey }: { columnKey: SortKey }) {
  const { sortKey, sortDirection } = useStore();
  if (sortKey !== columnKey) return <ChevronsUpDown className="h-3 w-3 text-ink-muted" />;
  return sortDirection === "asc"
    ? <ChevronUp className="h-3 w-3 text-gold" />
    : <ChevronDown className="h-3 w-3 text-gold" />;
}

function TableRowSkeleton({ index }: { index: number }) {
  return (
    <tr
      className="border-b border-bg-border animate-pulse"
      style={{ animationDelay: `${index * 30}ms` }}
    >
      {COLUMNS.map((col) => (
        <td key={col.key} className="px-4 py-3">
          <div className="h-4 skeleton rounded w-3/4 mx-auto" />
        </td>
      ))}
      {/* Name column */}
      <td className="px-4 py-3 hidden md:table-cell">
        <div className="h-4 skeleton rounded" />
      </td>
    </tr>
  );
}

function ETFRow({ etf, isTop3 }: { etf: ETFData; isTop3: boolean }) {
  const isBelow = etf.percentFromDMA < 0;

  return (
    <tr className={`
      group border-b border-bg-border transition-colors duration-100
      hover:bg-bg-raised
      ${isTop3 ? "bg-signal/[0.04] hover:bg-signal/[0.07]" : ""}
    `}>
      {/* Rank */}
      <td className="px-4 py-3">
        <div className="flex items-center gap-2">
          {isTop3 && (
            <span className="h-1.5 w-1.5 rounded-full bg-signal shrink-0" />
          )}
          <span className="font-mono text-sm text-ink-secondary">#{etf.rank}</span>
        </div>
      </td>

      {/* Ticker */}
      <td className="px-4 py-3">
        <span className="font-mono text-sm font-medium text-ink-primary">{etf.ticker}</span>
      </td>

      {/* Price (CMP) */}
      <td className="px-4 py-3 text-right">
        <span className="font-mono text-sm text-ink-primary">{formatCurrency(etf.cmp)}</span>
      </td>

      {/* 20 DMA */}
      <td className="px-4 py-3 text-right">
        <span className="font-mono text-sm text-ink-secondary">{formatCurrency(etf.dma20)}</span>
      </td>

      {/* % vs DMA — colored red/green, this is the key signal column */}
      <td className="px-4 py-3 text-right">
        <span className={`
          inline-flex items-center justify-end font-mono text-sm font-medium
          rounded-md px-2 py-0.5
          ${isBelow
            ? "bg-bear/10 text-bear"
            : "bg-bull/10 text-bull"
          }
        `}>
          {formatPercent(etf.percentFromDMA)}
        </span>
      </td>

      {/* Volume */}
      <td className="px-4 py-3 text-right">
        <span className="font-mono text-xs text-ink-muted">{formatVolume(etf.volume)}</span>
      </td>

      {/* Name — hidden on small screens */}
      <td className="hidden px-4 py-3 md:table-cell">
        <span className="text-xs text-ink-secondary leading-snug">{etf.name}</span>
      </td>
    </tr>
  );
}

export function ETFTable({ etfs, totalCount, isLoading }: ETFTableProps) {
  const { toggleSort } = useStore();

  return (
    <section className="space-y-4">
      {/* Section header */}
      <div className="flex items-center gap-3">
        <div className="h-5 w-1 rounded-full bg-gold" />
        <h2 className="font-display text-xl font-bold text-ink-primary">All ETFs</h2>
        <div className="flex-1 h-px bg-bg-border" />
      </div>

      {/* Filters */}
      <FilterBar resultCount={etfs.length} totalCount={totalCount} />

      {/* Table container — horizontal scroll on mobile */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] border-collapse">
            <thead>
              <tr className="border-b border-bg-border bg-bg-raised">
                {COLUMNS.map((col) => (
                  <th
                    key={col.key}
                    onClick={() => toggleSort(col.key)}
                    className={`
                      cursor-pointer select-none px-4 py-3 text-[10px] uppercase tracking-widest
                      font-semibold text-ink-muted hover:text-ink-secondary transition-colors
                      ${col.align === "right" ? "text-right" : "text-left"}
                    `}
                  >
                    <span className={`inline-flex items-center gap-1 ${col.align === "right" ? "flex-row-reverse" : ""}`}>
                      {col.label}
                      <SortIcon columnKey={col.key} />
                    </span>
                  </th>
                ))}
                {/* Name column header — hidden on mobile */}
                <th className="hidden px-4 py-3 text-left text-[10px] uppercase tracking-widest font-semibold text-ink-muted md:table-cell">
                  Name
                </th>
              </tr>
            </thead>

            <tbody>
              {isLoading
                ? Array.from({ length: 15 }).map((_, i) => (
                    <TableRowSkeleton key={i} index={i} />
                  ))
                : etfs.map((etf) => (
                    <ETFRow key={etf.ticker} etf={etf} isTop3={etf.rank <= 3} />
                  ))}

              {/* Empty state */}
              {!isLoading && etfs.length === 0 && (
                <tr>
                  <td colSpan={7} className="py-16 text-center">
                    <p className="text-sm text-ink-muted">No ETFs match your filters.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
