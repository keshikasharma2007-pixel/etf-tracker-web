import { AlertTriangle, RefreshCw } from "lucide-react";

interface ErrorStateProps {
  onRetry: () => void;
}

export function ErrorState({ onRetry }: ErrorStateProps) {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4">
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-bear/10 ring-1 ring-bear/20">
        <AlertTriangle className="h-6 w-6 text-bear" />
      </div>
      <div className="text-center">
        <p className="font-display text-base font-semibold text-ink-primary">
          Failed to load ETF data
        </p>
        <p className="mt-1 text-xs text-ink-muted">
          This could be a temporary issue with the data provider.
        </p>
      </div>
      <button
        onClick={onRetry}
        className="flex items-center gap-2 rounded-lg bg-bg-raised px-4 py-2 text-sm text-ink-secondary
          ring-1 ring-bg-border hover:ring-gold/30 hover:text-ink-primary transition-all duration-150"
      >
        <RefreshCw className="h-3.5 w-3.5" />
        Try again
      </button>
    </div>
  );
}
