import { QueryClient, QueryClientProvider, useQueryClient } from "@tanstack/react-query";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Dashboard } from "@/pages/Dashboard";
import { ETFApiResponse } from "@/types/etf.types";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Data is "fresh" for 14 minutes. TanStack Query triggers a background refetch
      // once data goes stale — this aligns with the 15-min backend cron interval.
      staleTime: 14 * 60 * 1000,
    },
  },
});

// Reads already-cached ETF data from TanStack Query's cache to populate the Header.
// We use useQueryClient().getQueryData() instead of calling useQuery() again —
// this reads the cache synchronously without triggering another fetch.
// The query was already initiated by Dashboard → useETFData, so the cache is always warm.
function AppShell() {
  const qc = useQueryClient();
  const cached = qc.getQueryData<ETFApiResponse>(["etfs"]);

  return (
    <div className="relative min-h-screen noise-overlay">
      <Header
        marketStatus={cached?.marketStatus}
        lastUpdated={cached?.lastUpdated}
      />
      <main>
        <Dashboard />
      </main>
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AppShell />
    </QueryClientProvider>
  );
}
