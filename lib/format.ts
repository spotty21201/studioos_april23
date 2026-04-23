export function formatCurrencyIdr(
  value: number,
  options?: { compact?: boolean },
) {
  if (options?.compact) {
    if (value >= 1_000_000_000) {
      return `Rp${(value / 1_000_000_000).toFixed(1)} M`;
    }

    if (value >= 1_000_000) {
      return `Rp${(value / 1_000_000).toFixed(1)} jt`;
    }

    if (value >= 1_000) {
      return `Rp${(value / 1_000).toFixed(0)} rb`;
    }
  }

  return `Rp${new Intl.NumberFormat("en-US", {
    maximumFractionDigits: 0,
  }).format(value)}`;
}

export function formatPercent(value: number) {
  return `${value > 0 ? "+" : ""}${value.toFixed(1)}%`;
}

export function formatShortDate(value: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value));
}

export function formatDateTime(value: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(value));
}

export function formatRelativeTime(value: string) {
  const deltaMs = new Date(value).getTime() - Date.now();
  const deltaMinutes = Math.round(deltaMs / 60000);
  const formatter = new Intl.RelativeTimeFormat("en", { numeric: "auto" });

  if (Math.abs(deltaMinutes) < 60) {
    return formatter.format(deltaMinutes, "minute");
  }

  const deltaHours = Math.round(deltaMinutes / 60);
  if (Math.abs(deltaHours) < 24) {
    return formatter.format(deltaHours, "hour");
  }

  const deltaDays = Math.round(deltaHours / 24);
  return formatter.format(deltaDays, "day");
}
