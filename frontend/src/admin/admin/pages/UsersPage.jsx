import { useEffect, useState } from "react";
import { Eye, Users } from "lucide-react";
import { apiGet } from "../adminApi.js";
import PageTitle from "../components/PageTitle.jsx";
import Pagination from "../components/Pagination.jsx";
import SimpleModal from "../components/SimpleModal.jsx";
import Info from "../components/Info.jsx";

export default function UsersPage() {
  const [users, setUsers] = useState([]);
  const [selected, setSelected] = useState(null);
  const [page, setPage] = useState(1);
  const pageSize = 8;

  useEffect(() => {
    apiGet("/api/admin/users").then(setUsers).catch(alert);
  }, []);

  const totalPages = Math.max(1, Math.ceil(users.length / pageSize));
  const pageItems = users.slice((page - 1) * pageSize, page * pageSize);

  return (
    <div>
      <PageTitle icon={Users} title="Quản Lý Khách Hàng" />
      <div className="overflow-x-auto rounded-lg bg-white shadow-sm">
        <table className="w-full min-w-[700px] text-left text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="p-3">ID</th>
              <th className="p-3">Tài khoản</th>
              <th className="p-3">Họ tên</th>
              <th className="p-3">Email</th>
              <th className="p-3">SĐT</th>
              <th className="p-3">Chi tiết</th>
            </tr>
          </thead>
          <tbody>
            {pageItems.map((u) => (
              <tr key={u.Id} className="border-t">
                <td className="p-3">{u.Id}</td>
                <td className="p-3">{u.Username}</td>
                <td className="p-3 font-medium">{u.FullName}</td>
                <td className="p-3">{u.Email}</td>
                <td className="p-3">{u.Phone}</td>
                <td className="p-3">
                  <button onClick={() => setSelected(u)} className="rounded bg-gray-100 p-2 text-gray-700"><Eye className="h-4 w-4" /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Pagination page={page} totalPages={totalPages} setPage={setPage} />

      {selected && (
        <SimpleModal title="Chi tiết khách hàng" onClose={() => setSelected(null)}>
          <Info label="Tài khoản" value={selected.Username} />
          <Info label="Họ tên" value={selected.FullName} />
          <Info label="Email" value={selected.Email} />
          <Info label="Số điện thoại" value={selected.Phone} />
          <Info label="Địa chỉ" value={selected.Address} />
          <Info label="Trạng thái" value={selected.Status} />
        </SimpleModal>
      )}
    </div>
  );
}
