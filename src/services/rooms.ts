import type {
  Room,
  AvailabilitySlot,
  GetRoomsParams,
  CreateRoomBody,
  PaginatedResponse,
} from "@/types";
import API from "./api";

export async function getRooms(params: GetRoomsParams = {}): Promise<Room[]> {
  const query: Record<string, string> = {};

  if (params.search) query.search = params.search;
  if (params.ordering) query.ordering = params.ordering;

  const res = await API.get<PaginatedResponse<Room>>("/rooms/", {
    params: query,
  });

  return res.data.results;
}

export async function createRoom(body: CreateRoomBody): Promise<Room> {
  const res = await API.post<Room>("/rooms/", body);
  return res.data;
}

export async function getAvailableRooms(params: {
  start_time: string;
  end_time: string;
}): Promise<Room[]> {
  const res = await API.get<Room[]>("/rooms/available/", { params });
  return res.data;
}

export async function getRoomAvailability(
  roomId: number,
  date: string,
): Promise<AvailabilitySlot[]> {
  const res = await API.get<AvailabilitySlot[]>(
    `/rooms/${roomId}/availability/`,
    { params: { date } },
  );
  return res.data;
}
