export interface Room {
  id: number;
  name: string;
  capacity: number;
}

export interface PaginatedResponse<T> {
  count: number;
  next?: string | null;
  previous?: string | null;
  results: T[];
}

export interface AvailabilitySlot {
  start_time: string;
  end_time: string;
  status: "free" | "busy";
}

export interface Booking {
  id: number;
  room: number;
  user: number;
  start_time: string;
  end_time: string;
}

export interface GetRoomsParams {
  search?: string;
  ordering?: "capacity" | "-capacity";
  page?: number;
}

export interface GetBookingsParams {
  user?: number;
  date?: string;
  page?: number;
}

export interface CreateBookingBody {
  room: number;
  user: number;
  start_time: string;
  end_time: string;
}

export interface CheckBookingBody {
  room: number;
  start_time: string;
  end_time: string;
}

export interface CheckBookingResponse {
  available: boolean;
}

export interface CreateRoomBody {
  name: string;
  capacity: number;
}

export type NavPage = "rooms" | "book" | "bookings";

export type ToastType = "success" | "error";

export interface ToastState {
  message: string;
  type: ToastType;
}
