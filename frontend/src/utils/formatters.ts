// Formats a number as USD currency: 1234.5 → "$1,234.50"
export function formatCurrency(value: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

// Formats a percentage with sign: -3.45 → "-3.45%" | 1.2 → "+1.20%"
export function formatPercent(value: number, decimals = 2): string {
  const sign = value >= 0 ? "+" : "";
  return `${sign}${value.toFixed(decimals)}%`;
}

// Formats large volume numbers: 1234567 → "1.23M" | 987654 → "987.7K"
export function formatVolume(value: number): string {
  if (value >= 1_000_000_000) return `${(value / 1_000_000_000).toFixed(1)}B`;
  if (value >= 1_000_000)     return `${(value / 1_000_000).toFixed(2)}M`;
  if (value >= 1_000)         return `${(value / 1_000).toFixed(1)}K`;
  return value.toString();
}

// Formats an ISO timestamp to a readable "Jun 5, 3:42 PM" style
export function formatTimestamp(iso: string): string {
  return new Date(iso).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

// Returns a Tailwind color class based on whether a % value is positive or negative.
// Used consistently across the table and cards.
export function percentColorClass(value: number): string {
  return value >= 0 ? "text-bull" : "text-bear";
}

// Computes daily buy amount and top ETF allocation from fund size.
// Replicates the Google Sheet calculator: divide by 60 trading days (~3 months).
export function computeDailyBuy(fundAmount: number): {
  dailyAmount: number;
  tripleAmount: number;
} {
  return {
    dailyAmount: fundAmount / 60,
    tripleAmount: (fundAmount / 60) * 3,
  };
}
