import { useState, useEffect } from "react";
import { getRooms } from "@/services/rooms";
import type { Room, GetRoomsParams } from "@/types";

interface UseRoomsResult {
  rooms: Room[];
  loading: boolean;
  error: string | null;
}

export function useRooms(params: GetRoomsParams = {}) {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [count, setCount] = useState(0);
  const [next, setNext] = useState<string | null>(null);
  const [previous, setPrevious] = useState<string | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    setLoading(true);
    setError(null);

    getRooms(params)
      .then((data) => {
        if (!cancelled) {
          setRooms(data.results);
          setCount(data.count);
          setNext(data.next ?? null);
          setPrevious(data.previous ?? null);
        }
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
  }, [params.page, params.search, params.ordering]);

  return { rooms, count, next, previous, loading, error };
}
