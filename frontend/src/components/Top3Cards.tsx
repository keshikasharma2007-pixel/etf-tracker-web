import { TrendingDown, Trophy, Medal } from "lucide-react";
import { ETFData } from "@/types/etf.types";
import { formatCurrency, formatPercent } from "@/utils/formatters";

interface Top3CardsProps {
  top3: ETFData[];
}

// Rank-specific visual config: icon, label, and ring color
const RANK_CONFIG = [
  {
    icon: Trophy,
    label: "Top Pick",
    ringClass: "ring-gold/40",
    bgClass: "bg-gold/5",
    iconClass: "text-gold",
    rankBadgeClass: "bg-gold text-bg-base",
  },
  {
    icon: Medal,
    label: "2nd Best",
    ringClass: "ring-ink-muted/30",
    bgClass: "bg-bg-raised",
    iconClass: "text-ink-secondary",
    rankBadgeClass: "bg-ink-secondary text-bg-base",
  },
  {
    icon: Medal,
    label: "3rd Best",
    ringClass: "ring-ink-muted/20",
    bgClass: "bg-bg-raised",
    iconClass: "text-ink-muted",
    rankBadgeClass: "bg-ink-muted/60 text-bg-base",
  },
] as const;

function Top3Card({ etf, rankIndex }: { etf: ETFData; rankIndex: number }) {
  const config = RANK_CONFIG[rankIndex];
  const Icon = config.icon;

  return (
    <div
      className={`
        relative overflow-hidden rounded-2xl p-5 ring-1 transition-transform duration-200
        hover:-translate-y-0.5 animate-slide-up
        ${config.bgClass} ${config.ringClass}
      `}
      style={{ animationDelay: `${rankIndex * 80}ms`, animationFillMode: "both" }}
    >
      {/* Rank badge */}
      <div className="mb-4 flex items-center justify-between">
        <span className={`
          rounded-full px-2.5 py-0.5 text-xs font-semibold font-mono
          ${config.rankBadgeClass}
        `}>
          #{etf.rank}
        </span>
        <div className={`flex items-center gap-1.5 text-xs ${config.iconClass}`}>
          <Icon className="h-3.5 w-3.5" />
          <span className="font-display font-semibold">{config.label}</span>
        </div>
      </div>

      {/* Ticker + Name */}
      <div className="mb-4">
        <div className="font-display text-2xl font-bold text-ink-primary tracking-tight">
          {etf.ticker}
        </div>
        <div className="mt-0.5 text-xs text-ink-secondary leading-snug line-clamp-2">
          {etf.name}
        </div>
        <div className="mt-1.5 inline-block rounded-full bg-bg-border px-2 py-0.5 text-[10px] text-ink-muted">
          {etf.assetClass}
        </div>
      </div>

      {/* Price metrics */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <div className="mb-1 text-[10px] uppercase tracking-widest text-ink-muted">Price</div>
          <div className="font-mono text-sm font-medium text-ink-primary">
            {formatCurrency(etf.cmp)}
          </div>
        </div>
        <div>
          <div className="mb-1 text-[10px] uppercase tracking-widest text-ink-muted">20 DMA</div>
          <div className="font-mono text-sm font-medium text-ink-secondary">
            {formatCurrency(etf.dma20)}
          </div>
        </div>
      </div>

      {/* % below DMA — the key signal */}
      <div className="mt-4 flex items-center gap-2 rounded-lg bg-bear/10 px-3 py-2 ring-1 ring-bear/20">
        <TrendingDown className="h-3.5 w-3.5 text-bear shrink-0" />
        <span className="text-xs text-ink-secondary">Below 20 DMA</span>
        <span className="ml-auto font-mono text-sm font-semibold text-bear">
          {formatPercent(etf.percentFromDMA)}
        </span>
      </div>
    </div>
  );
}

// Skeleton version shown while data is loading
function Top3Skeleton() {
  return (
    <div className="rounded-2xl p-5 ring-1 ring-bg-border bg-bg-surface animate-pulse">
      <div className="mb-4 flex justify-between">
        <div className="h-5 w-10 skeleton rounded-full" />
        <div className="h-5 w-20 skeleton rounded-full" />
      </div>
      <div className="mb-4">
        <div className="h-8 w-20 skeleton mb-2 rounded" />
        <div className="h-3 w-full skeleton rounded" />
        <div className="mt-1 h-3 w-3/4 skeleton rounded" />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="h-10 skeleton rounded" />
        <div className="h-10 skeleton rounded" />
      </div>
      <div className="mt-4 h-9 skeleton rounded-lg" />
    </div>
  );
}

export function Top3Cards({ top3 }: Top3CardsProps) {
  return (
    <section>
      {/* Section header */}
      <div className="mb-5 flex items-center gap-3">
        <div className="flex items-center gap-2">
          <div className="h-5 w-1 rounded-full bg-gold" />
          <h2 className="font-display text-xl font-bold text-ink-primary">
            Today's Top Buys
          </h2>
        </div>
        <div className="flex-1 h-px bg-bg-border" />
        <span className="text-xs text-ink-muted">Ranked by % below 20 DMA</span>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        {top3.length > 0
          ? top3.map((etf, i) => (
              <Top3Card key={etf.ticker} etf={etf} rankIndex={i} />
            ))
          : Array.from({ length: 3 }).map((_, i) => <Top3Skeleton key={i} />)}
      </div>
    </section>
  );
}
