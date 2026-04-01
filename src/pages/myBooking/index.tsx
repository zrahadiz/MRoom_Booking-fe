import { useState } from "react";
import { useBookings } from "@/hooks/useBookings";
import { Pagination } from "@/components/Pagination";
import { BOOKINGS_PER_PAGE } from "@/utils/constants";
import { isBookingPast, formatDate, formatTimeRange } from "@/utils/datetime";
import type { Booking, Room, ToastType } from "@/types";

interface BookingsPageProps {
  rooms: Room[];
  onNew: () => void;
  onToast: (message: string, type?: ToastType) => void;
}

export function BookingsPage({ rooms, onNew, onToast }: BookingsPageProps) {
  const [filterDate, setFilterDate] = useState("");
  const [page, setPage] = useState(1);

  const { bookings, loading, error, cancelBooking } = useBookings(
    filterDate || null,
  );

  const totalPages = Math.ceil(bookings.length / BOOKINGS_PER_PAGE);
  const paginated = bookings.slice(
    (page - 1) * BOOKINGS_PER_PAGE,
    page * BOOKINGS_PER_PAGE,
  );

  const getRoom = (roomId: number): Room | undefined =>
    rooms.find((r) => r.id === roomId);

  const handleCancel = async (bookingId: number) => {
    try {
      await cancelBooking(bookingId);
      onToast("Booking cancelled", "error");
    } catch (e) {
      onToast((e as Error).message, "error");
    }
  };

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-end",
          marginBottom: 32,
        }}
      >
        <div>
          <h1
            style={{
              fontFamily: "'DM Serif Display', serif",
              fontSize: 36,
              color: "#1C1B18",
              letterSpacing: "-1px",
              marginBottom: 6,
            }}
          >
            My Bookings
          </h1>
          <p style={{ color: "#6B6860", fontSize: 15 }}>
            {loading
              ? "Loading…"
              : `${bookings.length} reservation${bookings.length !== 1 ? "s" : ""}${filterDate ? ` on ${formatDate(filterDate)}` : ""}`}
          </p>
        </div>
        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          <input
            className="form-input"
            type="date"
            value={filterDate}
            onChange={(e) => {
              setFilterDate(e.target.value);
              setPage(1);
            }}
            style={{ width: 160 }}
          />
          {filterDate && (
            <button
              className="btn-secondary"
              style={{ padding: "10px 14px" }}
              onClick={() => setFilterDate("")}
            >
              Clear
            </button>
          )}
          <button className="btn-primary" onClick={onNew}>
            + New booking
          </button>
        </div>
      </div>

      {error && (
        <div
          style={{
            background: "#FEF2F0",
            border: "1px solid #F5C0BB",
            borderRadius: 10,
            padding: "12px 16px",
            color: "#C0392B",
            fontSize: 14,
            marginBottom: 20,
          }}
        >
          ⚠ {error}
        </div>
      )}

      {!loading && paginated.length === 0 ? (
        <EmptyState hasFilter={!!filterDate} onNew={onNew} />
      ) : (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 12,
            marginBottom: 24,
          }}
        >
          {paginated.map((booking) => (
            <BookingRow
              key={booking.id}
              booking={booking}
              room={getRoom(booking.room)}
              onCancel={handleCancel}
            />
          ))}
        </div>
      )}

      <Pagination page={page} totalPages={totalPages} onChange={setPage} />
    </div>
  );
}

// Sub-components
interface BookingRowProps {
  booking: Booking;
  room: Room | undefined;
  onCancel: (id: number) => void;
}

function BookingRow({ booking, room, onCancel }: BookingRowProps) {
  const past = isBookingPast(booking);
  const date = booking.start_time.slice(0, 10);
  const timeRange = formatTimeRange(booking.start_time, booking.end_time);

  return (
    <div
      style={{
        background: "#fff",
        borderRadius: 14,
        border: "1px solid #E8E5DC",
        padding: "18px 22px",
        display: "flex",
        alignItems: "center",
        gap: 18,
        opacity: past ? 0.6 : 1,
      }}
    >
      <div
        style={{
          width: 4,
          height: 56,
          borderRadius: 2,
          flexShrink: 0,
        }}
      />

      <div style={{ flex: 1, minWidth: 0 }}>
        <div
          style={{
            fontWeight: 600,
            fontSize: 15,
            color: "#1C1B18",
            marginBottom: 2,
          }}
        >
          {room?.name ?? `Room #${booking.room}`}
        </div>
      </div>

      <div style={{ textAlign: "center", flexShrink: 0 }}>
        <div style={{ fontSize: 14, fontWeight: 500, color: "#1C1B18" }}>
          {timeRange}
        </div>
        <div style={{ fontSize: 12, color: "#9B9890" }}>{date}</div>
      </div>

      {past ? (
        <span style={{ fontSize: 12, color: "#C8C5BB", fontWeight: 500 }}>
          Past
        </span>
      ) : (
        <button className="btn-danger" onClick={() => onCancel(booking.id)}>
          Cancel
        </button>
      )}
    </div>
  );
}

interface EmptyStateProps {
  hasFilter: boolean;
  onNew: () => void;
}

function EmptyState({ hasFilter, onNew }: EmptyStateProps) {
  return (
    <div
      style={{
        background: "#fff",
        borderRadius: 16,
        border: "1px solid #E8E5DC",
        padding: "60px 32px",
        textAlign: "center",
      }}
    >
      <div style={{ fontSize: 32, marginBottom: 12, opacity: 0.3 }}>📅</div>
      <div
        style={{
          fontSize: 16,
          fontWeight: 500,
          color: "#1C1B18",
          marginBottom: 6,
        }}
      >
        No bookings found
      </div>
      <div style={{ fontSize: 14, color: "#9B9890", marginBottom: 20 }}>
        {hasFilter
          ? "No bookings on this date."
          : "You haven't made any bookings yet."}
      </div>
      <button className="btn-primary" onClick={onNew}>
        Book a room
      </button>
    </div>
  );
}
