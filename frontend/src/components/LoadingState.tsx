import { Activity } from "lucide-react";

// Shown on the very first load when there's no cached data yet.
// The Render free tier can take ~30 seconds to cold-start, so we give the user
// a clear signal that something is happening rather than a blank screen.
export function LoadingState() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4">
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gold/10 ring-1 ring-gold/20">
        <Activity className="h-6 w-6 animate-pulse text-gold" />
      </div>
      <div className="text-center">
        <p className="font-display text-base font-semibold text-ink-primary">
          Loading ETF data
        </p>
        <p className="mt-1 text-xs text-ink-muted">
          Fetching live prices and computing 20-day moving averages…
        </p>
        <p className="mt-3 text-xs text-ink-muted/60">
          First load may take ~30 seconds while the server wakes up.
        </p>
      </div>
    </div>
  );
}
