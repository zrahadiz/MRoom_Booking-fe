import type {
  Booking,
  GetBookingsParams,
  CreateBookingBody,
  CheckBookingBody,
  CheckBookingResponse,
  PaginatedResponse,
} from "../types";
import API from "./api";

export async function getBookings(
  params: GetBookingsParams = {},
): Promise<PaginatedResponse<Booking>> {
  const query: Record<string, string> = {};
  if (params.user !== undefined) query.user = String(params.user);
  if (params.date) query.date = params.date;
  if (params.page) query.page = String(params.page);

  const res = await API.get<PaginatedResponse<Booking>>("/bookings/", {
    params: query,
  });
  return res.data;
}

export async function createBooking(body: CreateBookingBody): Promise<Booking> {
  try {
    const res = await API.post<Booking>("/bookings/", body);
    return res.data;
  } catch (err: any) {
    const detail = err.response?.data?.non_field_errors?.[0] || err.message;
    console.log(err.response);
    throw new Error(detail ?? "Failed to create booking");
  }
}

export async function deleteBooking(bookingId: number): Promise<void> {
  await API.delete(`/bookings/${bookingId}/`);
}

export async function checkBooking(
  body: CheckBookingBody,
): Promise<CheckBookingResponse> {
  const res = await API.post<CheckBookingResponse>("/bookings/check/", body);
  return res.data;
}
