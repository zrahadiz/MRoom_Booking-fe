interface PaginationProps {
  page: number;
  totalPages: number;
  onChange: (page: number) => void;
  hasNext?: boolean;
  hasPrevious?: boolean;
}
export function Pagination({
  page,
  totalPages,
  onChange,
  hasNext,
  hasPrevious,
}: PaginationProps) {
  if (totalPages <= 1) return null;

  const pages = [];

  const start = Math.max(1, page - 2);
  const end = Math.min(totalPages, page + 2);

  for (let i = start; i <= end; i++) {
    pages.push(i);
  }

  return (
    <div
      style={{
        display: "flex",
        gap: 6,
        justifyContent: "center",
        marginTop: 16,
      }}
    >
      {/* PREV */}
      <button
        className="page-btn"
        disabled={!hasPrevious}
        onClick={() => onChange(page - 1)}
      >
        ←
      </button>

      {/* PAGE NUMBERS */}
      {pages.map((p) => (
        <button
          key={p}
          className={`page-btn ${page === p ? "active" : ""}`}
          onClick={() => onChange(p)}
        >
          {p}
        </button>
      ))}

      {/* NEXT */}
      <button
        className="page-btn"
        disabled={!hasNext}
        onClick={() => onChange(page + 1)}
      >
        →
      </button>
    </div>
  );
}
