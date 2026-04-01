import { useState, useCallback } from "react";
import { RoomsPage } from "@/pages/rooms";
import { BookingFormPage } from "@/pages/bookingForm";
import { BookingsPage } from "@/pages/myBooking";
import { Toast, useToast } from "@/components/Toast";
import { useBookings } from "@/hooks/useBookings";
import { useRooms } from "@/hooks/useRooms";
import { TODAY } from "@/utils/datetime";
import type { Booking, NavPage, Room } from "@/types";

export default function App() {
  const [page, setPage] = useState<NavPage>("rooms");
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);

  const { toast, showToast, clearToast } = useToast();
  const { rooms } = useRooms();
  const { bookings: todayBookings, refetch: refetchTodayBookings } =
    useBookings(TODAY);

  const handleBookRoom = useCallback((room: Room) => {
    setSelectedRoom(room);
    setPage("book");
  }, []);

  const handleBookingSuccess = useCallback(
    (_booking: Booking) => {
      showToast("Room booked successfully!");
      refetchTodayBookings();
      setPage("bookings");
    },
    [showToast, refetchTodayBookings],
  );

  const handleCancelForm = useCallback(() => {
    setSelectedRoom(null);
    setPage("rooms");
  }, []);

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#F7F5F0",
        fontFamily: "'DM Sans', 'Helvetica Neue', sans-serif",
      }}
    >
      <GlobalStyles />

      <header
        style={{
          background: "#fff",
          borderBottom: "1px solid #E8E5DC",
          padding: "0 32px",
          position: "sticky",
          top: 0,
          zIndex: 100,
        }}
      >
        <div
          style={{
            maxWidth: 1100,
            margin: "0 auto",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            height: 60,
          }}
        >
          <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
            <span
              style={{
                fontFamily: "'DM Serif Display', serif",
                fontSize: 22,
                color: "#1C1B18",
                letterSpacing: "-0.5px",
              }}
            >
              Roomly
            </span>
            <span style={{ fontSize: 12, color: "#C8A97E", fontWeight: 500 }}>
              workspace
            </span>
          </div>
          <nav style={{ display: "flex", gap: 4 }}>
            <NavButton
              active={page === "rooms"}
              onClick={() => setPage("rooms")}
            >
              Browse Rooms
            </NavButton>
            <NavButton active={page === "book"} onClick={() => setPage("book")}>
              New Booking
            </NavButton>
            <NavButton
              active={page === "bookings"}
              onClick={() => setPage("bookings")}
            >
              My Bookings
            </NavButton>
          </nav>
        </div>
      </header>

      <main style={{ maxWidth: 1100, margin: "0 auto", padding: "36px 32px" }}>
        {page === "rooms" && (
          <RoomsPage onBook={handleBookRoom} todayBookings={todayBookings} />
        )}
        {page === "book" && (
          <BookingFormPage
            selectedRoom={selectedRoom}
            onSuccess={handleBookingSuccess}
            onCancel={handleCancelForm}
          />
        )}
        {page === "bookings" && (
          <BookingsPage
            rooms={rooms}
            onNew={() => setPage("book")}
            onToast={showToast}
          />
        )}
      </main>

      {toast && (
        <Toast message={toast.message} type={toast.type} onDone={clearToast} />
      )}
    </div>
  );
}

interface NavButtonProps {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}

function NavButton({ active, onClick, children }: NavButtonProps) {
  return (
    <button className={`nav-btn ${active ? "active" : ""}`} onClick={onClick}>
      {children}
    </button>
  );
}

function GlobalStyles() {
  return (
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=DM+Serif+Display&display=swap');
      * { box-sizing: border-box; margin: 0; padding: 0; }
      input, select { font-family: inherit; }
      .nav-btn { background: none; border: none; cursor: pointer; padding: 8px 18px; border-radius: 100px; font-size: 14px; font-weight: 500; transition: all 0.18s; color: #6B6860; }
      .nav-btn:hover { background: #EDEBE4; color: #1C1B18; }
      .nav-btn.active { background: #1C1B18; color: #F7F5F0; }
      .room-card { background: #fff; border-radius: 16px; border: 1px solid #E8E5DC; padding: 20px; transition: all 0.2s; cursor: pointer; }
      .room-card:hover { border-color: #C8A97E; box-shadow: 0 4px 24px rgba(0,0,0,0.06); transform: translateY(-1px); }
      .btn-primary { background: #1C1B18; color: #F7F5F0; border: none; border-radius: 10px; padding: 12px 24px; font-size: 14px; font-weight: 500; cursor: pointer; transition: all 0.18s; font-family: inherit; }
      .btn-primary:hover { background: #333; }
      .btn-primary:disabled { background: #C8C5BB; cursor: not-allowed; }
      .btn-secondary { background: none; color: #6B6860; border: 1px solid #E8E5DC; border-radius: 10px; padding: 10px 20px; font-size: 14px; cursor: pointer; transition: all 0.18s; font-family: inherit; }
      .btn-secondary:hover { border-color: #1C1B18; color: #1C1B18; }
      .btn-secondary:disabled { opacity: 0.4; cursor: not-allowed; }
      .btn-danger { background: none; color: #C0392B; border: 1px solid #F5C0BB; border-radius: 8px; padding: 6px 14px; font-size: 13px; cursor: pointer; transition: all 0.18s; font-family: inherit; }
      .btn-danger:hover { background: #FEF2F0; }
      .form-input { width: 100%; background: #F7F5F0; border: 1px solid #E0DDD4; border-radius: 10px; padding: 11px 14px; font-size: 14px; color: #1C1B18; outline: none; transition: border 0.15s; font-family: inherit; }
      .form-input:focus { border-color: #C8A97E; background: #fff; }
      .page-btn { background: none; border: 1px solid #E8E5DC; border-radius: 8px; padding: 6px 12px; font-size: 13px; cursor: pointer; color: #6B6860; transition: all 0.15s; }
      .page-btn:hover { border-color: #1C1B18; color: #1C1B18; }
      .page-btn.active { background: #1C1B18; color: #fff; border-color: #1C1B18; }
      .availability-slot { height: 28px; border-radius: 6px; display: flex; align-items: center; justify-content: center; font-size: 11px; font-weight: 500; }
      .slot-free { background: #D1FAE5; color: #065F46; }
      .slot-busy { background: #FEE2E2; color: #991B1B; }
      .slot-selected { background: #1C1B18; color: #fff; }
      .tag { display: inline-flex; align-items: center; gap: 4px; padding: 3px 10px; border-radius: 100px; font-size: 12px; font-weight: 500; }
      @keyframes slideUp { from { opacity: 0; transform: translateX(-50%) translateY(12px); } to { opacity: 1; transform: translateX(-50%) translateY(0); } }
    `}</style>
  );
}
