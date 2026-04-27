import type { FoodListing } from "@/lib/types";

export function timeUntil(ms: number): { label: string; urgent: boolean; expired: boolean } {
  const diff = ms - Date.now();
  if (diff <= 0) return { label: "Expired", urgent: false, expired: true };
  const mins = Math.floor(diff / 60000);
  const hrs = Math.floor(mins / 60);
  const days = Math.floor(hrs / 24);
  let label: string;
  if (days >= 1) label = `${days}d ${hrs % 24}h left`;
  else if (hrs >= 1) label = `${hrs}h ${mins % 60}m left`;
  else label = `${mins}m left`;
  return { label, urgent: diff <= 2 * 60 * 60 * 1000, expired: false };
}

export function formatDateTime(ms: number): string {
  return new Date(ms).toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export function mapsLink(address: string): string {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
}

export function isExpired(l: FoodListing): boolean {
  return l.expiresAt <= Date.now();
}
