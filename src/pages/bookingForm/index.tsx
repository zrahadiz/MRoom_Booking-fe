import { useState, useMemo, useEffect } from "react";
import { useRooms } from "@/hooks/useRooms";
import { useRoomAvailability } from "@/hooks/useRoomAvailability";
import { AvailabilityGrid } from "@/components/AvailabilityGrid";
import { checkBooking, createBooking } from "@/services/bookings";
import {
  TODAY,
  TIME_SLOTS,
  toISODateTime,
  timeToMinutes,
} from "@/utils/datetime";
import { CURRENT_USER_ID } from "@/utils/constants";
import type { Booking, Room } from "@/types";

interface BookingFormPageProps {
  selectedRoom?: Room | null;
  onSuccess: (booking: Booking) => void;
  onCancel: () => void;
}

export function BookingFormPage({
  selectedRoom,
  onSuccess,
  onCancel,
}: BookingFormPageProps) {
  const { rooms } = useRooms();

  const [roomId, setRoomId] = useState<number | "">(selectedRoom?.id ?? "");
  const [date, setDate] = useState(TODAY);
  const [startTime, setStartTime] = useState("09:00");
  const [endTime, setEndTime] = useState("10:00");
  const [meetingName, setMeetingName] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [availability, setAvailability] = useState<boolean | null>(null);

  const room = rooms.find((r) => r.id === roomId);

  const { slots, loading: slotsLoading } = useRoomAvailability(
    roomId !== "" ? roomId : null,
    date,
  );

  useEffect(() => {
    setAvailability(null);
    setError("");
  }, [roomId, date, startTime, endTime]);

  const isValidTime = useMemo(
    () => timeToMinutes(startTime) < timeToMinutes(endTime),
    [startTime, endTime],
  );

  const handleCheck = async () => {
    if (roomId === "") return setError("Please select a room.");
    if (!isValidTime) return setError("End time must be after start time.");
    setError("");
    try {
      const { available } = await checkBooking({
        room: roomId,
        start_time: toISODateTime(date, startTime),
        end_time: toISODateTime(date, endTime),
      });
      setAvailability(available);
      if (!available)
        setError("This slot is not available. Please choose another time.");
    } catch (e) {
      setError((e as Error).message);
    }
  };

  const handleSubmit = async () => {
    if (roomId === "") return setError("Please select a room.");
    if (!meetingName.trim()) return setError("Please enter a meeting name.");
    if (!isValidTime) return setError("End time must be after start time.");
    if (availability !== true)
      return setError("Please check availability first.");

    setSubmitting(true);
    setError("");
    try {
      const booking = await createBooking({
        room: roomId,
        user: CURRENT_USER_ID,
        start_time: toISODateTime(date, startTime),
        end_time: toISODateTime(date, endTime),
      });
      onSuccess(booking);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <div style={{ marginBottom: 32 }}>
        <h1
          style={{
            fontFamily: "'DM Serif Display', serif",
            fontSize: 36,
            color: "#1C1B18",
            letterSpacing: "-1px",
            marginBottom: 6,
          }}
        >
          New Booking
        </h1>
        <p style={{ color: "#6B6860", fontSize: 15 }}>
          Reserve a space for your team
        </p>
      </div>

      <div
        style={{ display: "grid", gridTemplateColumns: "1fr 360px", gap: 24 }}
      >
        <div
          style={{
            background: "#fff",
            borderRadius: 16,
            border: "1px solid #E8E5DC",
            padding: 28,
          }}
        >
          <Field label="Meeting name">
            <input
              className="form-input"
              placeholder="e.g. Design Review, Sprint Planning…"
              value={meetingName}
              onChange={(e) => setMeetingName(e.target.value)}
            />
          </Field>

          <Field label="Room">
            <select
              className="form-input"
              value={roomId}
              onChange={(e) =>
                setRoomId(e.target.value === "" ? "" : Number(e.target.value))
              }
            >
              <option value="">Select a room…</option>
              {rooms.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.name} — {r.capacity} seats
                </option>
              ))}
            </select>
          </Field>

          <Field label="Date">
            <input
              className="form-input"
              type="date"
              value={date}
              min={TODAY}
              onChange={(e) => setDate(e.target.value)}
            />
          </Field>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 12,
              marginBottom: 20,
            }}
          >
            <Field label="Start time">
              <select
                className="form-input"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
              >
                {TIME_SLOTS.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="End time">
              <select
                className="form-input"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
              >
                {TIME_SLOTS.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </Field>
          </div>

          <button
            className="btn-secondary"
            style={{ width: "100%", marginBottom: 16, padding: "11px" }}
            onClick={handleCheck}
            disabled={roomId === "" || !isValidTime}
          >
            Check availability
          </button>

          {availability === true && !error && (
            <div
              style={{
                background: "#F0FDF4",
                border: "1px solid #BBF7D0",
                borderRadius: 10,
                padding: "12px 16px",
                marginBottom: 16,
                fontSize: 14,
                color: "#065F46",
              }}
            >
              ✓ This slot is available
            </div>
          )}

          {error && (
            <div
              style={{
                background: "#FEF2F0",
                border: "1px solid #F5C0BB",
                borderRadius: 10,
                padding: "12px 16px",
                marginBottom: 16,
                color: "#C0392B",
                fontSize: 14,
              }}
            >
              ⚠ {error}
            </div>
          )}

          <div style={{ display: "flex", gap: 10 }}>
            <button
              className="btn-primary"
              style={{ flex: 1 }}
              onClick={handleSubmit}
              disabled={
                availability !== true || !meetingName.trim() || submitting
              }
            >
              {submitting ? "Booking…" : "Confirm Booking"}
            </button>
            <button className="btn-secondary" onClick={onCancel}>
              Cancel
            </button>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {room && (
            <div
              style={{
                background: "#fff",
                borderRadius: 16,
                border: "1px solid #E8E5DC",
                padding: 20,
              }}
            >
              <div
                style={{
                  fontFamily: "'DM Serif Display', serif",
                  fontSize: 20,
                  color: "#1C1B18",
                  marginBottom: 2,
                }}
              >
                {room.name}
              </div>
              <div style={{ fontSize: 13, color: "#9B9890", marginBottom: 10 }}>
                {room.capacity} seats
              </div>
            </div>
          )}

          <div
            style={{
              background: "#fff",
              borderRadius: 16,
              border: "1px solid #E8E5DC",
              padding: 20,
            }}
          >
            <div
              style={{
                fontSize: 13,
                fontWeight: 500,
                color: "#6B6860",
                marginBottom: 14,
                textTransform: "uppercase",
                letterSpacing: "0.05em",
              }}
            >
              Day availability{room ? ` — ${room.name}` : ""}
            </div>
            <AvailabilityGrid
              slots={slots}
              loading={slotsLoading}
              selectedStart={roomId !== "" && date ? startTime : undefined}
              selectedEnd={roomId !== "" && date ? endTime : undefined}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

interface FieldProps {
  label: string;
  children: React.ReactNode;
}

function Field({ label, children }: FieldProps) {
  return (
    <div style={{ marginBottom: 20 }}>
      <label
        style={{
          fontSize: 13,
          fontWeight: 500,
          color: "#6B6860",
          display: "block",
          marginBottom: 8,
          textTransform: "uppercase",
          letterSpacing: "0.05em",
        }}
      >
        {label}
      </label>
      {children}
    </div>
  );
}
