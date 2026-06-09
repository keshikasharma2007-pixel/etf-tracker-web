import { Search, X } from "lucide-react";
import { AssetClass } from "@/types/etf.types";
import { useStore } from "@/store/useStore";

const ASSET_CLASSES: Array<AssetClass | "All"> = [
  "All",
  "US Equity",
  "Sector",
  "International Equity",
  "Fixed Income",
  "Commodity",
  "Real Estate",
  "Inverse/Leveraged",
];

interface FilterBarProps {
  resultCount: number;
  totalCount: number;
}

export function FilterBar({ resultCount, totalCount }: FilterBarProps) {
  const { assetClass, search, setAssetClass, setSearch } = useStore();

  return (
    <div className="space-y-3">
      {/* Asset class tabs — horizontal scroll on mobile */}
      <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-hide">
        {ASSET_CLASSES.map((cls) => (
          <button
            key={cls}
            onClick={() => setAssetClass(cls)}
            className={`
              whitespace-nowrap rounded-lg px-3 py-1.5 text-xs font-medium transition-all duration-150
              ${assetClass === cls
                ? "bg-gold text-bg-base shadow-sm shadow-gold/20"
                : "bg-bg-raised text-ink-secondary hover:bg-bg-border hover:text-ink-primary ring-1 ring-bg-border"
              }
            `}
          >
            {cls}
          </button>
        ))}
      </div>

      {/* Search + result count */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-ink-muted" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search ticker or name..."
            className="
              w-full rounded-lg bg-bg-raised py-2 pl-9 pr-9 text-sm text-ink-primary
              placeholder:text-ink-muted ring-1 ring-bg-border
              focus:outline-none focus:ring-gold/40 focus:ring-2
              transition-all duration-150
            "
          />
          {/* Clear button — only visible when there's a search query */}
          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-ink-muted hover:text-ink-secondary"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

        <span className="shrink-0 font-mono text-xs text-ink-muted">
          {resultCount === totalCount
            ? `${totalCount} ETFs`
            : `${resultCount} / ${totalCount}`}
        </span>
      </div>
    </div>
  );
}
