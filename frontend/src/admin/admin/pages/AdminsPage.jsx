import { useEffect, useState } from "react";
import { Edit, Lock, Shield, Trash2 } from "lucide-react";
import { apiGet, apiSend } from "../adminApi.js";
import { emptyAdmin } from "../helpers.js";
import PageTitle from "../components/PageTitle.jsx";
import Pagination from "../components/Pagination.jsx";
import SimpleModal from "../components/SimpleModal.jsx";

export default function AdminsPage() {
  const [admins, setAdmins] = useState([]);
  const [form, setForm] = useState(emptyAdmin);
  const [editingId, setEditingId] = useState(null);
  const [passwordId, setPasswordId] = useState(null);
  const [newPassword, setNewPassword] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 8;

  const load = async () => setAdmins(await apiGet("/api/admin/admins"));

  useEffect(() => {
    apiGet("/api/admin/admins").then(setAdmins).catch(alert);
  }, []);

  const totalPages = Math.max(1, Math.ceil(admins.length / pageSize));
  const pageItems = admins.slice((page - 1) * pageSize, page * pageSize);

  const submit = async (e) => {
    e.preventDefault();
    if (editingId) await apiSend(`/api/admin/admins/${editingId}`, "PUT", form);
    else await apiSend("/api/admin/admins", "POST", form);
    setForm(emptyAdmin);
    setEditingId(null);
    await load();
  };

  const edit = (admin) => {
    setEditingId(admin.Id);
    setForm({ ...admin, Password: "" });
  };

  const remove = async (id) => {
    if (!window.confirm("Xóa admin này?")) return;
    await apiSend(`/api/admin/admins/${id}`, "DELETE", {});
    await load();
  };

  const changePassword = async () => {
    await apiSend(`/api/admin/admins/${passwordId}/password`, "PUT", { Password: newPassword });
    setPasswordId(null);
    setNewPassword("");
  };

  return (
    <div>
      <PageTitle icon={Shield} title="Quản Lý Tài Khoản Admin" />
      <form onSubmit={submit} className="mb-5 rounded-lg bg-white p-4 shadow-sm">
        <div className="grid gap-3 md:grid-cols-2">
          <input required={!editingId} disabled={!!editingId} placeholder="Username" value={form.Username || ""} onChange={(e) => setForm({ ...form, Username: e.target.value })} className="rounded border px-3 py-2 disabled:bg-gray-100" />
          {!editingId && <input required placeholder="Mật khẩu" value={form.Password} onChange={(e) => setForm({ ...form, Password: e.target.value })} className="rounded border px-3 py-2" />}
          <input required placeholder="Họ tên" value={form.FullName || ""} onChange={(e) => setForm({ ...form, FullName: e.target.value })} className="rounded border px-3 py-2" />
          <input placeholder="Email" value={form.Email || ""} onChange={(e) => setForm({ ...form, Email: e.target.value })} className="rounded border px-3 py-2" />
          <input placeholder="SĐT" value={form.Phone || ""} onChange={(e) => setForm({ ...form, Phone: e.target.value })} className="rounded border px-3 py-2" />
          <select value={form.Status || "active"} onChange={(e) => setForm({ ...form, Status: e.target.value })} className="rounded border px-3 py-2">
            <option value="active">active</option>
            <option value="locked">locked</option>
          </select>
          <input placeholder="Địa chỉ" value={form.Address || ""} onChange={(e) => setForm({ ...form, Address: e.target.value })} className="rounded border px-3 py-2 md:col-span-2" />
        </div>
        <button className="mt-3 rounded bg-primary px-4 py-2 font-medium text-white">{editingId ? "Lưu admin" : "Thêm admin"}</button>
      </form>

      <div className="overflow-x-auto rounded-lg bg-white shadow-sm">
        <table className="w-full min-w-[800px] text-left text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="p-3">ID</th>
              <th className="p-3">Username</th>
              <th className="p-3">Họ tên</th>
              <th className="p-3">Email</th>
              <th className="p-3">Trạng thái</th>
              <th className="p-3">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {pageItems.map((a) => (
              <tr key={a.Id} className="border-t">
                <td className="p-3">{a.Id}</td>
                <td className="p-3">{a.Username}</td>
                <td className="p-3 font-medium">{a.FullName}</td>
                <td className="p-3">{a.Email}</td>
                <td className="p-3">{a.Status}</td>
                <td className="p-3">
                  <button onClick={() => edit(a)} className="mr-2 rounded bg-blue-50 p-2 text-blue-600"><Edit className="h-4 w-4" /></button>
                  <button onClick={() => setPasswordId(a.Id)} className="mr-2 rounded bg-yellow-50 p-2 text-yellow-700"><Lock className="h-4 w-4" /></button>
                  <button onClick={() => remove(a.Id)} className="rounded bg-red-50 p-2 text-red-600"><Trash2 className="h-4 w-4" /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Pagination page={page} totalPages={totalPages} setPage={setPage} />

      {passwordId && (
        <SimpleModal title="Đổi mật khẩu admin" onClose={() => setPasswordId(null)}>
          <input value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="Mật khẩu mới" className="mb-3 w-full rounded border px-3 py-2" />
          <button onClick={() => changePassword().catch(alert)} className="rounded bg-primary px-4 py-2 text-white">Lưu mật khẩu</button>
        </SimpleModal>
      )}
    </div>
  );
}
