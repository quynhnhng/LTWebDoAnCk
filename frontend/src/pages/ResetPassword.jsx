import { useState, useEffect } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { Lock, CheckCircle, XCircle, Loader } from "lucide-react";

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get("token");

  const [status, setStatus] = useState("verifying"); // verifying | valid | invalid | success
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Kiểm tra token khi vào trang
  useEffect(() => {
    if (!token) {
      setStatus("invalid");
      return;
    }

    fetch(`http://localhost:5000/api/verify-reset-token?token=${token}`)
      .then((res) => res.json())
      .then((data) => {
        setStatus(data.valid ? "valid" : "invalid");
      })
      .catch(() => setStatus("invalid"));
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (newPassword.length < 6) {
      setError("Mật khẩu phải có ít nhất 6 ký tự!");
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("Mật khẩu xác nhận không khớp!");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("http://localhost:5000/api/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, newPassword }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Có lỗi xảy ra, vui lòng thử lại.");
        return;
      }

      setStatus("success");
      // Tự động về trang chủ sau 3 giây
      setTimeout(() => navigate("/"), 3000);
    } catch {
      setError("Không thể kết nối đến server. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
        {/* Header */}
        <div className="bg-primary px-6 py-8 text-center">
          <h1 className="text-2xl font-bold text-white">PC Shop</h1>
          <p className="text-red-200 text-sm mt-1">Đặt lại mật khẩu</p>
        </div>

        <div className="p-8">
          {/* Đang kiểm tra token */}
          {status === "verifying" && (
            <div className="text-center py-8">
              <Loader className="w-12 h-12 text-primary animate-spin mx-auto mb-4" />
              <p className="text-gray-600 font-medium">Đang xác thực link...</p>
            </div>
          )}

          {/* Token không hợp lệ */}
          {status === "invalid" && (
            <div className="text-center py-6">
              <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <XCircle className="w-9 h-9 text-red-500" />
              </div>
              <h2 className="text-xl font-bold text-gray-800 mb-2">
                Link không hợp lệ
              </h2>
              <p className="text-gray-500 text-sm mb-6 leading-relaxed">
                Link đặt lại mật khẩu đã hết hạn hoặc không hợp lệ.
                <br />
                Link chỉ có hiệu lực trong <strong>30 phút</strong> kể từ khi
                gửi.
              </p>
              <Link
                to="/"
                className="inline-block bg-primary text-white font-bold px-6 py-2.5 rounded-lg hover:bg-red-700 transition text-sm"
              >
                Về trang chủ để yêu cầu lại
              </Link>
            </div>
          )}

          {/* Form đặt lại mật khẩu */}
          {status === "valid" && (
            <div>
              <div className="text-center mb-6">
                <div className="w-14 h-14 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Lock className="w-7 h-7 text-primary" />
                </div>
                <h2 className="text-xl font-bold text-gray-800">
                  Tạo mật khẩu mới
                </h2>
                <p className="text-gray-500 text-sm mt-1">
                  Nhập mật khẩu mới cho tài khoản của bạn
                </p>
              </div>

              {error && (
                <div className="mb-4 rounded-lg bg-red-50 border border-red-200 p-3 text-sm text-red-600">
                  ⚠️ {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Mật khẩu mới <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg text-gray-800 text-sm focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition"
                      placeholder="Tối thiểu 6 ký tự..."
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Xác nhận mật khẩu <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg text-gray-800 text-sm focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition"
                      placeholder="Nhập lại mật khẩu..."
                      required
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-primary text-white font-bold py-3 rounded-lg hover:bg-red-700 transition disabled:opacity-60 disabled:cursor-not-allowed mt-2"
                >
                  {loading ? "Đang xử lý..." : "Đặt lại mật khẩu"}
                </button>
              </form>
            </div>
          )}

          {/* Thành công */}
          {status === "success" && (
            <div className="text-center py-6">
              <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-9 h-9 text-green-500" />
              </div>
              <h2 className="text-xl font-bold text-gray-800 mb-2">
                Đặt lại thành công!
              </h2>
              <p className="text-gray-500 text-sm mb-1 leading-relaxed">
                Mật khẩu của bạn đã được cập nhật.
              </p>
              <p className="text-gray-400 text-xs mb-6">
                Tự động chuyển về trang chủ sau 3 giây...
              </p>
              <Link
                to="/"
                className="inline-block bg-primary text-white font-bold px-6 py-2.5 rounded-lg hover:bg-red-700 transition text-sm"
              >
                Về trang chủ ngay
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
