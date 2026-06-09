import { Activity } from "lucide-react";
import { MarketStatus } from "../../types/etf.types";
import { formatTimestamp } from "@/utils/formatters";
interface HeaderProps {
  marketStatus?: MarketStatus;
  lastUpdated?: string;
}

export function Header({ marketStatus, lastUpdated }: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 border-b border-bg-border bg-bg-base/80 backdrop-blur-md">
      <div className="mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gold/10 ring-1 ring-gold/30">
              <Activity className="h-4 w-4 text-gold" strokeWidth={1.5} />
            </div>
            <span className="font-display text-lg font-700 tracking-tight text-ink-primary">
              World of <span className="text-gold">ETFs</span>
            </span>
          </div>

          {/* Right side — market status + last updated */}
          <div className="flex items-center gap-4">
            {lastUpdated && (
              <span className="hidden text-xs text-ink-muted sm:block font-mono">
                Updated {formatTimestamp(lastUpdated)}
              </span>
            )}

            {marketStatus && (
              <div
                className={`
                flex items-center gap-2 rounded-full px-3 py-1 text-xs font-medium
                ${
                  marketStatus.isOpen
                    ? "bg-bull/10 text-bull ring-1 ring-bull/20"
                    : "bg-bg-raised text-ink-secondary ring-1 ring-bg-border"
                }
              `}
              >
                {/* Pulsing dot — only animates when market is open */}
                <span
                  className={`
                  h-1.5 w-1.5 rounded-full
                  ${marketStatus.isOpen ? "bg-bull animate-pulse-slow" : "bg-ink-muted"}
                `}
                />
                <span>{marketStatus.label}</span>
                <span className="text-ink-muted">·</span>
                <span className="text-ink-secondary">
                  {marketStatus.nextEventLabel}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
