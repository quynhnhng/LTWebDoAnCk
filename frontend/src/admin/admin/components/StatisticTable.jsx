import { useMemo, useState } from "react";
import { formatMoney } from "../adminApi.js";
import Pagination from "./Pagination.jsx";

// Bang thong ke 1 khoang thoi gian (ngay/tuan/thang), co phan trang rieng
export default function StatisticTable({ title, rows }) {
  const [page, setPage] = useState(1);
  const pageSize = 8;

  const max = useMemo(() => Math.max(...rows.map((r) => Number(r.Revenue || 0)), 1), [rows]);
  const totalPages = Math.max(1, Math.ceil(rows.length / pageSize));
  const pageItems = rows.slice((page - 1) * pageSize, page * pageSize);

  return (
    <div className="mb-6 rounded-lg bg-white p-4 shadow-sm">
      <h3 className="mb-3 text-lg font-bold">{title}</h3>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[500px] text-left text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="p-3">Mốc thời gian</th>
              <th className="p-3">Số đơn</th>
              <th className="p-3">Doanh thu</th>
              <th className="p-3">Biểu đồ</th>
            </tr>
          </thead>
          <tbody>
            {pageItems.map((row) => (
              <tr key={row.Label} className="border-t">
                <td className="p-3">{row.Label}</td>
                <td className="p-3">{row.OrderCount}</td>
                <td className="p-3">{formatMoney(row.Revenue)}</td>
                <td className="p-3">
                  <div className="h-3 rounded bg-gray-100">
                    <div className="h-3 rounded bg-primary" style={{ width: `${(Number(row.Revenue || 0) / max) * 100}%` }} />
                  </div>
                </td>
              </tr>
            ))}
            {rows.length === 0 && (
              <tr><td className="p-3 text-gray-500" colSpan="4">Chưa có dữ liệu</td></tr>
            )}
          </tbody>
        </table>
      </div>
      {rows.length > 0 && <Pagination page={page} totalPages={totalPages} setPage={setPage} />}
    </div>
  );
}
