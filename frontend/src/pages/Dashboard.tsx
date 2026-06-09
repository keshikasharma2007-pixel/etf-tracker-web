import { RefreshCw } from "lucide-react";
import { useETFData } from "@/hooks/useETFData";
import { Top3Cards } from "@/components/Top3Cards";
import { ETFTable } from "@/components/ETFTable";
import { FundCalculator } from "@/components/FundCalculator";
import { LoadingState } from "@/components/LoadingState";
import { ErrorState } from "@/components/ErrorState";
import { formatTimestamp } from "@/utils/formatters";

export function Dashboard() {
  const {
    filteredETFs,
    top3,
    data,
    isLoading,
    isError,
    isFetching,
    refetch,
    lastUpdated,
    nextRefresh,
  } = useETFData();

  // First-ever load with no data yet
  if (isLoading && !data) return <LoadingState />;
  if (isError && !data)   return <ErrorState onRetry={refetch} />;

  return (
    <div className="mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8 py-10 space-y-12">

      {/* Page title + background refresh indicator */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="font-display text-3xl font-bold text-ink-primary sm:text-4xl">
            ETF Dashboard
          </h1>
          <p className="mt-1 text-sm text-ink-secondary">
            US ETFs ranked by discount to 20-day moving average
          </p>
        </div>

        {/* Refresh button — shows a spinner during background fetches */}
        <button
          onClick={() => refetch()}
          disabled={isFetching}
          className={`
            flex items-center gap-2 rounded-lg px-3 py-2 text-xs
            ring-1 ring-bg-border bg-bg-raised text-ink-secondary
            hover:text-ink-primary hover:ring-gold/30 transition-all duration-150
            disabled:opacity-50 disabled:cursor-not-allowed
          `}
        >
          <RefreshCw className={`h-3.5 w-3.5 ${isFetching ? "animate-spin" : ""}`} />
          <span className="hidden sm:inline">
            {isFetching ? "Refreshing…" : nextRefresh ? `Next: ${formatTimestamp(nextRefresh)}` : "Refresh"}
          </span>
        </button>
      </div>

      {/* Top 3 buy signal cards */}
      <Top3Cards top3={top3} />

      {/* Fund calculator — sits alongside or below the top 3 */}
      <FundCalculator top3={top3} />

      {/* Full ETF table */}
      <ETFTable
        etfs={filteredETFs}
        totalCount={data?.etfs.length ?? 0}
        isLoading={isLoading}
      />
    </div>
  );
}
