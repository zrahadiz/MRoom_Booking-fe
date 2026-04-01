import { useState, useEffect } from "react";
import { getRooms } from "@/services/rooms";
import type { Room, GetRoomsParams } from "@/types";

interface UseRoomsResult {
  rooms: Room[];
  loading: boolean;
  error: string | null;
}

export function useRooms(params: GetRoomsParams = {}): UseRoomsResult {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    getRooms(params)
      .then((data) => {
        if (!cancelled) setRooms(data);
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
  }, [params.search, params.ordering]);

  return { rooms, loading, error };
}
