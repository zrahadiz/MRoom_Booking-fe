interface Props {
  page: string;
  setPage: (p: string) => void;
}

export default function Header({ page, setPage }: Props) {
  return (
    <header>
      <button onClick={() => setPage("rooms")}>Rooms</button>
      <button onClick={() => setPage("book")}>Book</button>
      <button onClick={() => setPage("bookings")}>My Bookings</button>
    </header>
  );
}
