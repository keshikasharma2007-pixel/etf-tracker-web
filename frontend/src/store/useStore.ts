import { create } from "zustand";
import { AssetClass, FilterState, SortDirection, SortKey } from "@/types/etf.types";

// We extend FilterState with the actions that mutate it.
// Zustand co-locates state and actions in a single object — simpler than Redux
// for a project of this scale where we don't need middleware or devtools.
interface StoreState extends FilterState {
  setAssetClass: (assetClass: AssetClass | "All") => void;
  setSearch: (search: string) => void;
  setSort: (key: SortKey, direction: SortDirection) => void;
  setFundAmount: (amount: number) => void;
  toggleSort: (key: SortKey) => void; // flips direction if key is already active
}

export const useStore = create<StoreState>((set, get) => ({
  // Initial state
  assetClass: "All",
  search: "",
  sortKey: "rank",
  sortDirection: "asc",
  fundAmount: 10000,

  setAssetClass: (assetClass) => set({ assetClass }),
  setSearch: (search) => set({ search }),
  setFundAmount: (fundAmount) => set({ fundAmount }),

  setSort: (sortKey, sortDirection) => set({ sortKey, sortDirection }),

  // If clicking the same column header twice, flip the direction.
  // If clicking a new column, default to ascending.
  toggleSort: (key) => {
    const { sortKey, sortDirection } = get();
    if (sortKey === key) {
      set({ sortDirection: sortDirection === "asc" ? "desc" : "asc" });
    } else {
      set({ sortKey: key, sortDirection: "asc" });
    }
  },
}));
