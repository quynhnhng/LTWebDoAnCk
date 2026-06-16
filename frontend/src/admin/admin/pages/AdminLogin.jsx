import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Shield } from "lucide-react";
import { apiSend } from "../adminApi.js";

export default function AdminLogin() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const data = await apiSend("/api/login", "POST", form);
      if (data.user.Role !== "admin") {
        setError("Tài khoản này không có quyền truy cập trang quản trị.");
        return;
      }
      localStorage.removeItem("pcshop_user"); // Xóa user session nếu có
      localStorage.setItem("pcshop_admin", JSON.stringify(data.user));
      navigate("/admin", { replace: true });
    } catch (err) {
      setError(err.message || "Sai tài khoản hoặc mật khẩu.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md rounded-xl bg-white p-8 shadow-lg border border-gray-100"
      >
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 w-16 h-16 bg-red-50 rounded-full flex items-center justify-center">
            <Shield className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-2xl font-bold text-gray-800">Đăng Nhập Admin</h1>
          <p className="mt-1 text-sm text-gray-500">
            Chỉ tài khoản quản trị viên mới được phép truy cập
          </p>
        </div>

        {error && (
          <div className="mb-4 rounded-lg bg-red-50 border border-red-200 p-3 text-sm text-red-600 flex items-start gap-2">
            <span className="mt-0.5">⚠️</span>
            <span>{error}</span>
          </div>
        )}

        <div className="mb-4">
          <label className="mb-1.5 block text-sm font-medium text-gray-700">
            Tên đăng nhập
          </label>
          <input
            required
            value={form.username}
            onChange={(e) => setForm({ ...form, username: e.target.value })}
            placeholder="Nhập tên đăng nhập..."
            className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition"
          />
        </div>

        <div className="mb-6">
          <label className="mb-1.5 block text-sm font-medium text-gray-700">
            Mật khẩu
          </label>
          <input
            required
            type="password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            placeholder="••••••••"
            className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-lg bg-primary py-3 font-bold text-white hover:bg-red-700 transition disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {loading ? "Đang xác thực..." : "Đăng nhập"}
        </button>

        <div className="mt-6 pt-4 border-t border-gray-100 text-center">
          <a
            href="/"
            className="text-sm text-gray-500 hover:text-primary transition"
          >
            ← Quay về trang chủ
          </a>
        </div>
      </form>
    </div>
  );
}
