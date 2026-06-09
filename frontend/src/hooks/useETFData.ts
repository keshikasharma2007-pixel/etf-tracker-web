import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { fetchETFs } from "@/api/etf.api";
import { useStore } from "@/store/useStore";
import { ETFData } from "@/types/etf.types";

// How often to re-fetch in the foreground (15 min = same as backend cron interval)
const REFETCH_INTERVAL_MS = 15 * 60 * 1000;

export function useETFData() {
  const { assetClass, search, sortKey, sortDirection } = useStore();

  const query = useQuery({
    queryKey: ["etfs"],
    queryFn: fetchETFs,

    // Re-fetch every 15 minutes automatically — aligns with the backend cache TTL
    refetchInterval: REFETCH_INTERVAL_MS,

    // Re-fetch when the user comes back to the tab (e.g. left for 20 mins, returns)
    refetchOnWindowFocus: true,

    // Keep the previous data visible while a background refresh is in progress —
    // avoids a loading flash every 15 minutes
    placeholderData: (prev) => prev,

    // Don't retry more than twice on error — Yahoo Finance might just be down
    retry: 2,
  });

  // Derive filtered + sorted ETF list from the raw API data.
  // useMemo ensures we only re-sort when data or filter state actually changes —
  // not on every render. This matters when the table has 100 rows.
  const filteredETFs = useMemo<ETFData[]>(() => {
    if (!query.data?.etfs) return [];

    let result = [...query.data.etfs];

    // Asset class filter
    if (assetClass !== "All") {
      result = result.filter((e) => e.assetClass === assetClass);
    }

    // Search filter — matches ticker or name, case-insensitive
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (e) => e.ticker.toLowerCase().includes(q) || e.name.toLowerCase().includes(q)
      );
    }

    // Sort — handles both numeric and string columns
    result.sort((a, b) => {
      const aVal = a[sortKey];
      const bVal = b[sortKey];

      let comparison = 0;
      if (typeof aVal === "string" && typeof bVal === "string") {
        comparison = aVal.localeCompare(bVal);
      } else {
        comparison = (aVal as number) - (bVal as number);
      }

      return sortDirection === "asc" ? comparison : -comparison;
    });

    return result;
  }, [query.data, assetClass, search, sortKey, sortDirection]);

  return {
    ...query,
    filteredETFs,
    top3: query.data?.top3 ?? [],
    marketStatus: query.data?.marketStatus,
    lastUpdated: query.data?.lastUpdated,
    nextRefresh: query.data?.nextRefresh,
  };
}
