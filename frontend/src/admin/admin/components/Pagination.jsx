// Component phan trang dung chung cho cac trang danh sach (Trước / Sau)
export default function Pagination({ page, totalPages, setPage }) {
  return (
    <div className="mt-4 flex justify-center gap-2">
      <button disabled={page === 1} onClick={() => setPage(page - 1)} className="rounded bg-white px-3 py-2 shadow-sm disabled:opacity-50">
        Trước
      </button>
      <span className="rounded bg-white px-4 py-2 shadow-sm">{page}/{totalPages}</span>
      <button disabled={page === totalPages} onClick={() => setPage(page + 1)} className="rounded bg-white px-3 py-2 shadow-sm disabled:opacity-50">
        Sau
      </button>
    </div>
  );
}
