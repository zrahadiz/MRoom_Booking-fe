import { formatTime, timeToMinutes, isoToMinutes } from "../utils/datetime";
import type { AvailabilitySlot } from "../types";

interface AvailabilityGridProps {
  slots: AvailabilitySlot[];
  loading: boolean;
  selectedStart?: string;
  selectedEnd?: string;
}

export function AvailabilityGrid({
  slots,
  loading,
  selectedStart,
  selectedEnd,
}: AvailabilityGridProps) {
  if (loading) {
    return (
      <div
        style={{
          color: "#C8C5BB",
          fontSize: 13,
          textAlign: "center",
          padding: "20px 0",
        }}
      >
        Loading availability…
      </div>
    );
  }

  if (slots.length === 0) {
    return (
      <div
        style={{
          color: "#C8C5BB",
          fontSize: 13,
          textAlign: "center",
          padding: "20px 0",
        }}
      >
        Select a room and date to see availability
      </div>
    );
  }

  return (
    <>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: 4,
        }}
      >
        {slots.map(({ start_time, end_time, status }) => {
          const start = formatTime(start_time);
          const end = formatTime(end_time);
          const startMin = isoToMinutes(start_time);
          const selStart = selectedStart ? timeToMinutes(selectedStart) : null;
          const selEnd = selectedEnd ? timeToMinutes(selectedEnd) : null;
          const inSelection =
            selStart !== null &&
            selEnd !== null &&
            startMin >= selStart &&
            startMin < selEnd;
          const cls = inSelection
            ? "slot-selected"
            : status === "busy"
              ? "slot-busy"
              : "slot-free";

          return (
            <div key={start_time} className={`availability-slot ${cls}`}>
              {start} – {end}
            </div>
          );
        })}
      </div>

      <div style={{ display: "flex", gap: 12, marginTop: 12 }}>
        {(
          [
            ["slot-free", "Free"],
            ["slot-busy", "Busy"],
            ["slot-selected", "Selected"],
          ] as [string, string][]
        ).map(([cls, label]) => (
          <div
            key={label}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 4,
              fontSize: 11,
              color: "#9B9890",
            }}
          >
            <div
              className={`availability-slot ${cls}`}
              style={{ width: 16, height: 12, borderRadius: 3, fontSize: 0 }}
            />
            {label}
          </div>
        ))}
      </div>
    </>
  );
}
