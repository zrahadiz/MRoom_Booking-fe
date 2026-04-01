interface PaginationProps {
  page: number;
  totalPages: number;
  onChange: (page: number) => void;
}

export function Pagination({ page, totalPages, onChange }: PaginationProps) {
  if (totalPages <= 1) return null;
  return (
    <div
      style={{
        display: "flex",
        gap: 6,
        justifyContent: "center",
        marginTop: 16,
      }}
    >
      {Array.from({ length: totalPages }, (_, i) => (
        <button
          key={i}
          className={`page-btn ${page === i + 1 ? "active" : ""}`}
          onClick={() => onChange(i + 1)}
        >
          {i + 1}
        </button>
      ))}
    </div>
  );
}
