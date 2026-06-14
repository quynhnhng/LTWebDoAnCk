import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Shield } from "lucide-react";
import { apiSend } from "../adminApi.js";

export default function AdminLogin() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: "admin1", password: "123456" });
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const data = await apiSend("/api/login", "POST", form);
      if (data.user.Role !== "admin") {
        setError("Tài khoản này không có quyền admin");
        return;
      }
      localStorage.setItem("pcshop_admin", JSON.stringify(data.user));
      navigate("/admin", { replace: true });
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <form onSubmit={handleSubmit} className="w-full max-w-md rounded-lg bg-white p-6 shadow-md">
        <div className="mb-6 text-center">
          <Shield className="mx-auto mb-3 h-12 w-12 text-primary" />
          <h1 className="text-2xl font-bold text-gray-800">Đăng Nhập Admin</h1>
          <p className="mt-1 text-sm text-gray-500">Tài khoản mẫu: admin1 / 123456</p>
        </div>

        {error && <p className="mb-4 rounded bg-red-50 p-3 text-sm text-red-600">{error}</p>}

        <label className="mb-1 block text-sm font-medium text-gray-700">Tên đăng nhập</label>
        <input
          value={form.username}
          onChange={(e) => setForm({ ...form, username: e.target.value })}
          className="mb-4 w-full rounded border px-3 py-2 outline-none focus:ring-2 focus:ring-primary"
        />

        <label className="mb-1 block text-sm font-medium text-gray-700">Mật khẩu</label>
        <input
          type="password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          className="mb-5 w-full rounded border px-3 py-2 outline-none focus:ring-2 focus:ring-primary"
        />

        <button className="w-full rounded bg-primary py-2.5 font-bold text-white hover:bg-red-700">
          Đăng nhập
        </button>
      </form>
    </div>
  );
}
