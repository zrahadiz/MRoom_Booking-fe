import type { Room } from "../types";

interface RoomCardProps {
  room: Room;
  bookingCount?: number;
  onBook: () => void;
}

export function RoomCard({ room, bookingCount = 0, onBook }: RoomCardProps) {
  return (
    <div className="room-card" onClick={onBook}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          marginBottom: 14,
        }}
      >
        <div>
          <div
            style={{
              fontSize: 18,
              fontWeight: 600,
              color: "#1C1B18",
              fontFamily: "'DM Serif Display', serif",
              marginBottom: 2,
            }}
          >
            {room.name}
          </div>
          <div style={{ fontSize: 13, color: "#9B9890" }}>
            {room.capacity} seats
          </div>
        </div>
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div style={{ fontSize: 13, color: "#9B9890" }}>
          {bookingCount === 0
            ? "Free all day"
            : `${bookingCount} booking${bookingCount > 1 ? "s" : ""} today`}
        </div>
        <button
          className="btn-primary"
          style={{ padding: "8px 18px", fontSize: 13 }}
          onClick={(e) => {
            e.stopPropagation();
            onBook();
          }}
        >
          Book →
        </button>
      </div>
    </div>
  );
}
