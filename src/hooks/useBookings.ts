import { useState, useEffect, useCallback } from "react";
import { getBookings, deleteBooking } from "@/services/bookings";
import { CURRENT_USER_ID } from "@/utils/constants";
import type { Booking } from "@/types";

export function useBookings(date: string | null = null, page: number = 1) {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [count, setCount] = useState(0);
  const [next, setNext] = useState<string | null>(null);
  const [previous, setPrevious] = useState<string | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBookings = useCallback(() => {
    setLoading(true);
    setError(null);

    getBookings({
      user: CURRENT_USER_ID,
      ...(date ? { date } : {}),
      page,
    })
      .then((data) => {
        setBookings(data.results);
        setCount(data.count);
        setNext(data.next ?? null);
        setPrevious(data.previous ?? null);
      })
      .catch((err: Error) => setError(err.message))
      .finally(() => setLoading(false));
  }, [date, page]);

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  const cancelBooking = useCallback(
    async (bookingId: number) => {
      await deleteBooking(bookingId);
      fetchBookings();
    },
    [fetchBookings],
  );

  return {
    bookings,
    count,
    next,
    previous,
    loading,
    error,
    refetch: fetchBookings,
    cancelBooking,
  };
}
