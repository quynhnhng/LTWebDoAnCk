import { useEffect, useState } from "react";
import { ClipboardList, Eye } from "lucide-react";
import { apiGet, apiSend, formatMoney } from "../adminApi.js";
import { orderStatuses } from "../helpers.js";
import PageTitle from "../components/PageTitle.jsx";
import Pagination from "../components/Pagination.jsx";
import SimpleModal from "../components/SimpleModal.jsx";
import Info from "../components/Info.jsx";

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [detail, setDetail] = useState(null);
  const [page, setPage] = useState(1);
  const pageSize = 8;

  const load = async () => {
    const query = `?search=${encodeURIComponent(search)}&status=${encodeURIComponent(status)}`;
    setOrders(await apiGet(`/api/admin/orders${query}`));
  };

  useEffect(() => {
    apiGet("/api/admin/orders?search=&status=").then(setOrders).catch(alert);
  }, []);

  const totalPages = Math.max(1, Math.ceil(orders.length / pageSize));
  const pageItems = orders.slice((page - 1) * pageSize, page * pageSize);

  const openDetail = async (id) => {
    setDetail(await apiGet(`/api/admin/orders/${id}`));
  };

  const updateStatus = async (id, Status) => {
    await apiSend(`/api/admin/orders/${id}/status`, "PUT", { Status });
    await load();
  };

  return (
    <div>
      <PageTitle icon={ClipboardList} title="Quản Lý Đơn Hàng" />
      <div className="mb-4 flex flex-col gap-3 rounded-lg bg-white p-4 shadow-sm md:flex-row">
        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Tìm theo tên hoặc số điện thoại" className="flex-1 rounded border px-3 py-2" />
        <select value={status} onChange={(e) => setStatus(e.target.value)} className="rounded border px-3 py-2">
          <option value="">Tất cả trạng thái</option>
          {orderStatuses.map((s) => <option key={s}>{s}</option>)}
        </select>
        <button onClick={() => { setPage(1); load().catch(alert); }} className="rounded bg-gray-900 px-4 py-2 text-white">Lọc</button>
      </div>

      <div className="overflow-x-auto rounded-lg bg-white shadow-sm">
        <table className="w-full min-w-[900px] text-left text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="p-3">Mã đơn</th>
              <th className="p-3">Khách nhận</th>
              <th className="p-3">SĐT</th>
              <th className="p-3">Tổng tiền</th>
              <th className="p-3">Trạng thái</th>
              <th className="p-3">Chi tiết</th>
            </tr>
          </thead>
          <tbody>
            {pageItems.map((o) => (
              <tr key={o.Id} className="border-t">
                <td className="p-3">#{o.Id}</td>
                <td className="p-3 font-medium">{o.ReceiverName}</td>
                <td className="p-3">{o.ReceiverPhone}</td>
                <td className="p-3">{formatMoney(o.TotalPrice)}</td>
                <td className="p-3">
                  <select value={o.Status} onChange={(e) => updateStatus(o.Id, e.target.value).catch(alert)} className="rounded border px-2 py-1">
                    {orderStatuses.map((s) => <option key={s}>{s}</option>)}
                  </select>
                </td>
                <td className="p-3">
                  <button onClick={() => openDetail(o.Id).catch(alert)} className="rounded bg-gray-100 p-2"><Eye className="h-4 w-4" /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Pagination page={page} totalPages={totalPages} setPage={setPage} />

      {detail && (
        <SimpleModal title={`Chi tiết đơn #${detail.order?.Id}`} onClose={() => setDetail(null)}>
          <Info label="Người nhận" value={detail.order?.ReceiverName} />
          <Info label="SĐT" value={detail.order?.ReceiverPhone} />
          <Info label="Địa chỉ" value={detail.order?.ShippingAddress} />
          <Info label="Tổng tiền" value={formatMoney(detail.order?.TotalPrice)} />
          <div className="mt-4">
            <h4 className="mb-2 font-bold">Sản phẩm</h4>
            {detail.items.map((item) => (
              <div key={item.Id} className="flex justify-between border-b py-2 text-sm">
                <span>{item.Title} x {item.Quantity}</span>
                <span>{formatMoney(item.Price)}</span>
              </div>
            ))}
          </div>
        </SimpleModal>
      )}
    </div>
  );
}
