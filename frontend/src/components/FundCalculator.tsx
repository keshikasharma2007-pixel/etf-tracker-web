import { useState } from "react";
import { Calculator, ChevronRight } from "lucide-react";
import { ETFData } from "@/types/etf.types";
import {
  formatCurrency,
  formatPercent,
  computeDailyBuy,
} from "@/utils/formatters";
import { useStore } from "@/store/useStore";

interface FundCalculatorProps {
  top3: ETFData[];
}

// Preset fund amounts for quick selection — matches the Google Sheet's preset values
const PRESETS = [10_000, 25_000, 50_000, 100_000, 250_000, 500_000];

export function FundCalculator({ top3 }: FundCalculatorProps) {
  const { fundAmount, setFundAmount } = useStore();
  const [inputValue, setInputValue] = useState(fundAmount.toString());

  const { dailyAmount, tripleAmount } = computeDailyBuy(fundAmount);

  // Handle raw input — allow the user to type freely, parse on blur
  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    setInputValue(e.target.value);
  }

  function handleInputBlur() {
    const parsed = parseFloat(inputValue.replace(/[^0-9.]/g, ""));
    if (!isNaN(parsed) && parsed > 0) {
      setFundAmount(parsed);
      setInputValue(parsed.toString());
    } else {
      setInputValue(fundAmount.toString());
    }
  }

  return (
    <section className="space-y-4">
      {/* Section header */}
      <div className="flex items-center gap-3">
        <div className="h-5 w-1 rounded-full bg-gold" />
        <h2 className="font-display text-xl font-bold text-ink-primary">
          Fund Calculator
        </h2>
        <div className="flex-1 h-px bg-bg-border" />
      </div>

      <div className="card p-5 space-y-5">
        {/* Fund input */}
        <div className="space-y-2">
          <label className="text-[10px] uppercase tracking-widest text-ink-muted font-semibold">
            Total Fund (USD)
          </label>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 font-mono text-sm text-ink-muted">
                $
              </span>
              <input
                type="text"
                value={inputValue}
                onChange={handleInputChange}
                onBlur={handleInputBlur}
                className="
                  w-full rounded-lg bg-bg-raised py-2.5 pl-7 pr-3 font-mono text-sm text-ink-primary
                  ring-1 ring-bg-border focus:outline-none focus:ring-2 focus:ring-gold/40
                  transition-all duration-150
                "
              />
            </div>
          </div>

          {/* Quick-select presets */}
          <div className="flex flex-wrap gap-1.5">
            {PRESETS.map((preset) => (
              <button
                key={preset}
                onClick={() => {
                  setFundAmount(preset);
                  setInputValue(preset.toString());
                }}
                className={`
                  rounded-md px-2.5 py-1 text-xs font-mono transition-all duration-100
                  ${
                    fundAmount === preset
                      ? "bg-gold text-bg-base font-semibold"
                      : "bg-bg-raised text-ink-secondary ring-1 ring-bg-border hover:ring-gold/30 hover:text-ink-primary"
                  }
                `}
              >
                {preset >= 1000 ? `$${preset / 1000}K` : `$${preset}`}
              </button>
            ))}
          </div>
        </div>

        {/* Results */}
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-xl bg-bg-raised p-4 ring-1 ring-bg-border">
            <div className="mb-1 text-[10px] uppercase tracking-widest text-ink-muted">
              Daily Buy Amount
            </div>
            <div className="font-mono text-xl font-semibold text-gold">
              {formatCurrency(dailyAmount)}
            </div>
            <div className="mt-0.5 text-[10px] text-ink-muted">
              fund ÷ 60 trading days
            </div>
          </div>

          <div className="rounded-xl bg-bg-raised p-4 ring-1 ring-bg-border">
            <div className="mb-1 text-[10px] uppercase tracking-widest text-ink-muted">
              Triple Buy (3×)
            </div>
            <div className="font-mono text-xl font-semibold text-ink-primary">
              {formatCurrency(tripleAmount)}
            </div>
            <div className="mt-0.5 text-[10px] text-ink-muted">
              for high-conviction signals
            </div>
          </div>
        </div>

        {/* Today's allocation — top 3 ETFs with recommended buy */}
        {top3.length > 0 && (
          <div className="space-y-2">
            <div className="text-[10px] uppercase tracking-widest text-ink-muted font-semibold">
              Today's Allocation
            </div>
            {top3.map((etf, i) => (
              <div
                key={etf.ticker}
                className="flex items-center gap-3 rounded-lg bg-bg-raised px-4 py-3 ring-1 ring-bg-border"
              >
                <span className="font-mono text-xs text-ink-muted w-4">
                  #{i + 1}
                </span>
                <div className="flex-1 min-w-0">
                  <span className="font-mono text-sm font-medium text-ink-primary">
                    {etf.ticker}
                  </span>
                  <span className="ml-2 text-xs text-ink-muted hidden sm:inline">
                    {etf.name}
                  </span>
                </div>
                <span className="font-mono text-xs text-bear shrink-0">
                  {formatPercent(etf.percentFromDMA)} DMA
                </span>
                <ChevronRight className="h-3.5 w-3.5 text-ink-muted shrink-0" />
                <span className="font-mono text-sm font-semibold text-gold shrink-0">
                  {/* Rank 1 gets triple, ranks 2+3 get the standard daily amount */}
                  {formatCurrency(i === 0 ? tripleAmount : dailyAmount)}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
