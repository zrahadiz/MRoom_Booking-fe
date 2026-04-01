import { useState, useEffect } from "react";
import { getRoomAvailability } from "@/services/rooms";
import type { AvailabilitySlot } from "../types";

interface UseRoomAvailabilityResult {
  slots: AvailabilitySlot[];
  loading: boolean;
  error: string | null;
}

export function useRoomAvailability(
  roomId: number | null,
  date: string | null,
): UseRoomAvailabilityResult {
  const [slots, setSlots] = useState<AvailabilitySlot[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!roomId || !date) {
      setSlots([]);
      return;
    }

    let cancelled = false;
    setLoading(true);
    setError(null);

    getRoomAvailability(roomId, date)
      .then((data) => {
        if (!cancelled) setSlots(data);
      })
      .catch((err: Error) => {
        if (!cancelled) setError(err.message);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [roomId, date]);

  return { slots, loading, error };
}
