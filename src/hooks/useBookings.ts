import { useState, useEffect, useCallback } from "react";
import { getBookings, deleteBooking } from "@/services/bookings";
import { CURRENT_USER_ID } from "@/utils/constants";
import type { Booking } from "@/types";

interface UseBookingsResult {
  bookings: Booking[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
  cancelBooking: (bookingId: number) => Promise<void>;
}

export function useBookings(date: string | null = null): UseBookingsResult {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBookings = useCallback(() => {
    setLoading(true);
    setError(null);

    getBookings({ user: CURRENT_USER_ID, ...(date ? { date } : {}) })
      .then(setBookings)
      .catch((err: Error) => setError(err.message))
      .finally(() => setLoading(false));
  }, [date]);

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  const cancelBooking = useCallback(
    async (bookingId: number): Promise<void> => {
      await deleteBooking(bookingId);
      setBookings((prev) => prev.filter((b) => b.id !== bookingId));
    },
    [],
  );

  return { bookings, loading, error, refetch: fetchBookings, cancelBooking };
}
