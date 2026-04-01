import type { Booking } from "../types";

export const TODAY: string = new Date().toISOString().split("T")[0];

export const TIME_SLOTS: string[] = Array.from({ length: 25 }, (_, i) => {
  const h = Math.floor(i / 2) + 8;
  const m = i % 2 === 0 ? "00" : "30";
  if (h > 20 || (h === 20 && m === "30")) return null;
  return `${String(h).padStart(2, "0")}:${m}`;
}).filter((t): t is string => t !== null);

export function isoToMinutes(iso: string) {
  const d = new Date(iso);
  return d.getHours() * 60 + d.getMinutes();
}

export function timeToMinutes(time: string): number {
  const [h, m] = time.split(":").map(Number);
  return h * 60 + m;
}

export function toISODateTime(date: string, time: string): string {
  return new Date(`${date}T${time}:00`).toISOString();
}

export function isBookingPast(booking: Booking): boolean {
  return new Date(booking.end_time) < new Date();
}

export function formatDate(date: string): string {
  return new Date(`${date}T00:00:00`).toLocaleDateString(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}

export function formatTime(iso: string) {
  return new Date(iso).toLocaleTimeString("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
}

export function formatTimeRange(startISO: string, endISO: string): string {
  const start = new Date(startISO);
  const end = new Date(endISO);

  const format = (d: Date) =>
    d.toLocaleTimeString("id-ID", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });

  return `${format(start)} – ${format(end)}`;
}
