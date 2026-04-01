import { useState } from "react";
import { useRooms } from "@/hooks/useRooms";
import { RoomCard } from "@/components/RoomCard";
import { Pagination } from "@/components/Pagination";
import { ROOMS_PER_PAGE } from "@/utils/constants";
import type { Booking, Room } from "@/types";

interface RoomsPageProps {
  onBook: (room: Room) => void;
  todayBookings: Booking[];
}

export function RoomsPage({ onBook, todayBookings }: RoomsPageProps) {
  console.log("RoomsPage rendered with todayBookings:", todayBookings);
  const [page, setPage] = useState(1);
  const { rooms, loading, error } = useRooms();

  const totalPages = Math.ceil(rooms.length / ROOMS_PER_PAGE);
  const paginated = rooms.slice(
    (page - 1) * ROOMS_PER_PAGE,
    page * ROOMS_PER_PAGE,
  );

  const getBookingCount = (roomId: number): number => {
    const count = todayBookings.filter((b) => b.room === roomId).length;
    console.log(count);
    return count;
  };

  const totalCapacity = rooms.reduce((sum, r) => sum + r.capacity, 0);
  const bookedRoomIds = new Set(todayBookings.map((b) => b.room));

  const stats = [
    { label: "Total rooms", value: rooms.length },
    { label: "Booked today", value: bookedRoomIds.size },
    { label: "Available now", value: rooms.length - bookedRoomIds.size },
    { label: "Total capacity", value: `${totalCapacity} seats` },
  ];

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
          Meeting Spaces
        </h1>
        <p style={{ color: "#6B6860", fontSize: 15 }}>
          {loading ? "Loading rooms…" : `${rooms.length} rooms available`}
        </p>
      </div>

      {!loading && (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: 12,
            marginBottom: 32,
          }}
        >
          {stats.map((s) => (
            <div
              key={s.label}
              style={{
                background: "#fff",
                border: "1px solid #E8E5DC",
                borderRadius: 12,
                padding: "16px 20px",
              }}
            >
              <div
                style={{
                  fontSize: 12,
                  color: "#9B9890",
                  marginBottom: 4,
                  fontWeight: 500,
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                }}
              >
                {s.label}
              </div>
              <div
                style={{
                  fontSize: 26,
                  fontWeight: 600,
                  color: "#1C1B18",
                  fontFamily: "'DM Serif Display', serif",
                }}
              >
                {s.value}
              </div>
            </div>
          ))}
        </div>
      )}

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

      {loading ? (
        <div
          style={{ textAlign: "center", padding: "60px 0", color: "#9B9890" }}
        >
          Loading rooms…
        </div>
      ) : (
        <>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(2, 1fr)",
              gap: 16,
              marginBottom: 24,
            }}
          >
            {paginated.map((room) => (
              <RoomCard
                key={room.id}
                room={room}
                bookingCount={getBookingCount(room.id)}
                onBook={() => onBook(room)}
              />
            ))}
          </div>
          <Pagination page={page} totalPages={totalPages} onChange={setPage} />
        </>
      )}
    </div>
  );
}
