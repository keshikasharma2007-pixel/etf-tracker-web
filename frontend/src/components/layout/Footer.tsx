export function Footer() {
  return (
    <footer className="mt-24 border-t border-bg-border py-10">
      <div className="mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          <p className="font-display text-sm font-semibold text-ink-secondary">
            World of <span className="text-gold">ETFs</span>
          </p>
          <p className="text-xs text-ink-muted text-center sm:text-right">
            Data sourced from Yahoo Finance via yahoo-finance2. For informational purposes only —
            not financial advice. Always do your own research.
          </p>
        </div>
      </div>
    </footer>
  );
}
