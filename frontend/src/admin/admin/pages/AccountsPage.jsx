import { useEffect, useMemo, useState } from "react";
import { Eye, Lock, Search, Unlock, Users } from "lucide-react";
import { apiGet, apiSend } from "../adminApi.js";
import PageTitle from "../components/PageTitle.jsx";
import Pagination from "../components/Pagination.jsx";
import SimpleModal from "../components/SimpleModal.jsx";
import Info from "../components/Info.jsx";

const normalize = (value) => String(value || "").toLowerCase();

export default function AccountsPage() {
  const [accounts, setAccounts] = useState([]);
  const [search, setSearch] = useState("");
  const [role, setRole] = useState("");
  const [selected, setSelected] = useState(null);
  const [page, setPage] = useState(1);
  const pageSize = 8;

  const load = async () => {
    const [users, admins] = await Promise.all([
      apiGet("/api/admin/users"),
      apiGet("/api/admin/admins"),
    ]);

    setAccounts([
      ...users.map((item) => ({ ...item, Role: "user" })),
      ...admins.map((item) => ({ ...item, Role: "admin" })),
    ]);
  };

  useEffect(() => {
    Promise.all([apiGet("/api/admin/users"), apiGet("/api/admin/admins")])
      .then(([users, admins]) => {
        setAccounts([
          ...users.map((item) => ({ ...item, Role: "user" })),
          ...admins.map((item) => ({ ...item, Role: "admin" })),
        ]);
      })
      .catch(alert);
  }, []);

  const filteredAccounts = useMemo(() => {
    const keyword = normalize(search);

    return accounts.filter((account) => {
      const matchesRole = !role || account.Role === role;
      const matchesSearch =
        !keyword ||
        normalize(account.Username).includes(keyword) ||
        normalize(account.FullName).includes(keyword) ||
        normalize(account.Email).includes(keyword) ||
        normalize(account.Phone).includes(keyword);

      return matchesRole && matchesSearch;
    });
  }, [accounts, role, search]);

  const totalPages = Math.max(1, Math.ceil(filteredAccounts.length / pageSize));
  const pageItems = filteredAccounts.slice((page - 1) * pageSize, page * pageSize);

  const updateStatus = async (account) => {
    const nextStatus = account.Status === "locked" ? "active" : "locked";
    await apiSend(`/api/admin/accounts/${account.Id}/status`, "PUT", {
      Role: account.Role,
      Status: nextStatus,
    });
    await load();
  };

  const handleSearchChange = (value) => {
    setSearch(value);
    setPage(1);
  };

  const handleRoleChange = (value) => {
    setRole(value);
    setPage(1);
  };

  return (
    <div>
      <PageTitle icon={Users} title="Quản Lý Tài Khoản" />

      <div className="mb-4 flex flex-col gap-3 rounded-lg bg-white p-4 shadow-sm md:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
          <input
            value={search}
            onChange={(e) => handleSearchChange(e.target.value)}
            placeholder="Tìm theo username, họ tên, email hoặc SĐT"
            className="w-full rounded border py-2 pl-10 pr-3"
          />
        </div>
        <select
          value={role}
          onChange={(e) => handleRoleChange(e.target.value)}
          className="rounded border px-3 py-2"
        >
          <option value="">Tất cả tài khoản</option>
          <option value="user">User</option>
          <option value="admin">Admin</option>
        </select>
      </div>

      <div className="overflow-x-auto rounded-lg bg-white shadow-sm">
        <table className="w-full min-w-[900px] text-left text-sm">
          <thead className="bg-gray-50 text-gray-600">
            <tr>
              <th className="p-3">ID</th>
              <th className="p-3">Vai trò</th>
              <th className="p-3">Tài khoản</th>
              <th className="p-3">Họ tên</th>
              <th className="p-3">Email</th>
              <th className="p-3">SĐT</th>
              <th className="p-3">Trạng thái</th>
              <th className="p-3">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {pageItems.map((account) => (
              <tr key={`${account.Role}-${account.Id}`} className="border-t">
                <td className="p-3">{account.Id}</td>
                <td className="p-3">
                  <span className="rounded bg-gray-100 px-2 py-1 text-xs font-medium uppercase text-gray-700">
                    {account.Role}
                  </span>
                </td>
                <td className="p-3">{account.Username}</td>
                <td className="p-3 font-medium">{account.FullName}</td>
                <td className="p-3">{account.Email}</td>
                <td className="p-3">{account.Phone}</td>
                <td className="p-3">{account.Status}</td>
                <td className="p-3">
                  <button
                    onClick={() => setSelected(account)}
                    className="mr-2 rounded bg-gray-100 p-2 text-gray-700"
                    title="Xem chi tiết"
                  >
                    <Eye className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => updateStatus(account).catch(alert)}
                    className={`rounded p-2 ${
                      account.Status === "locked"
                        ? "bg-green-50 text-green-700"
                        : "bg-yellow-50 text-yellow-700"
                    }`}
                    title={account.Status === "locked" ? "Mở khóa" : "Khóa tài khoản"}
                  >
                    {account.Status === "locked" ? (
                      <Unlock className="h-4 w-4" />
                    ) : (
                      <Lock className="h-4 w-4" />
                    )}
                  </button>
                </td>
              </tr>
            ))}
            {pageItems.length === 0 && (
              <tr>
                <td className="p-3 text-gray-500" colSpan="8">
                  Không có tài khoản phù hợp
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <Pagination page={page} totalPages={totalPages} setPage={setPage} />

      {selected && (
        <SimpleModal title="Chi tiết tài khoản" onClose={() => setSelected(null)}>
          <Info label="Vai trò" value={selected.Role} />
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
