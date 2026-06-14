import { useState } from "react";
import { X, Lock, User, Mail } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function LoginModal({ isOpen, onClose, showToast }) {
  const navigate = useNavigate();
  // Giao diện: "login", "register", "forgot"
  const [view, setView] = useState("login");

  // State Input Đăng nhập
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  // State Input Đăng ký
  const [regUsername, setRegUsername] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [regConfirmPassword, setRegConfirmPassword] = useState("");

  // State Input Quên mật khẩu
  const [forgotEmail, setForgotEmail] = useState("");

  // NẾU MODAL ĐÓNG, KHÔNG RENDER GÌ CẢ
  if (!isOpen) return null;

  // HÀM XỬ LÝ ĐÓNG MODAL & RESET DỮ LIỆU CÙNG LÚC (Thay thế cho useEffect)
  const handleCloseModal = () => {
    // 1. Dọn dẹp sạch sẽ dữ liệu
    setView("login");
    setUsername("");
    setPassword("");
    setRegUsername("");
    setRegEmail("");
    setRegPassword("");
    setRegConfirmPassword("");
    setForgotEmail("");

    // 2. Gọi hàm đóng Modal của App.jsx
    onClose();
  };

  // Xử lý sự kiện Đăng nhập
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    if (!username || !password) {
      showToast("Vui lòng điền đầy đủ thông tin đăng nhập!", "error");
      return;
    }
    try {
      const response = await fetch("http://localhost:5000/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });
      const data = await response.json();

      if (!response.ok) {
        showToast(data.error || "Đăng nhập thất bại!", "error");
        return;
      }

      if (data.user.Role === "admin") {
        localStorage.setItem("pcshop_admin", JSON.stringify(data.user));
        showToast("Đăng nhập admin thành công!", "success");
        handleCloseModal();
        navigate("/admin");
        return;
      }

      localStorage.setItem("pcshop_user", JSON.stringify(data.user));
      showToast("Đăng nhập thành công!", "success");
      handleCloseModal(); // Đăng nhập xong thì dọn dẹp và đóng Modal
    } catch (error) {
      console.error("Lỗi đăng nhập:", error);
      showToast("Không thể kết nối tới server!", "error");
    }
  };

  // Xử lý sự kiện Đăng ký
  const handleRegisterSubmit = (e) => {
    e.preventDefault();
    if (!regUsername || !regEmail || !regPassword || !regConfirmPassword) {
      showToast("Vui lòng nhập đầy đủ tất cả các trường!", "error");
      return;
    }
    if (regPassword !== regConfirmPassword) {
      showToast("Mật khẩu xác nhận không trùng khớp!", "error");
      return;
    }
    showToast("Đăng ký tài khoản thành công!", "success");

    // Reset form đăng ký và tự động chuyển sang form Đăng nhập
    setRegUsername("");
    setRegEmail("");
    setRegPassword("");
    setRegConfirmPassword("");
    setView("login");
  };

  // Xử lý sự kiện Quên mật khẩu
  const handleForgotSubmit = (e) => {
    e.preventDefault();
    if (!forgotEmail) {
      showToast("Vui lòng nhập địa chỉ Email khôi phục!", "error");
      return;
    }
    showToast(
      "Yêu cầu đã được gửi! Vui lòng kiểm tra hộp thư Email.",
      "success",
    );

    // Reset và chuyển về form Đăng nhập
    setForgotEmail("");
    setView("login");
  };

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-md bg-white p-8 rounded-xl shadow-2xl mx-4 transform transition-all border border-gray-100">
        {/* Nút đóng góc phải - Gọi handleCloseModal thay vì onClose */}
        <button
          onClick={handleCloseModal}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition"
        >
          <X className="w-6 h-6" />
        </button>

        {/* ========================================== */}
        {/* THỦ TỤC 1: GIAO DIỆN ĐĂNG NHẬP             */}
        {/* ========================================== */}
        {view === "login" && (
          <div>
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">
                ĐĂNG NHẬP HỆ THỐNG
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                Chào mừng bạn quay trở lại với PC Shop
              </p>
            </div>

            <form onSubmit={handleLoginSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tài khoản hoặc Email
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg text-gray-800 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition"
                    placeholder="Nhập tài khoản..."
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Mật khẩu
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg text-gray-800 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              <div className="text-right">
                <button
                  type="button"
                  onClick={() => setView("forgot")}
                  className="text-sm text-primary hover:underline font-medium focus:outline-none"
                >
                  Quên mật khẩu?
                </button>
              </div>

              <button
                type="submit"
                className="w-full bg-primary text-white py-3 rounded-lg font-bold hover:bg-red-700 transition shadow-lg shadow-red-200"
              >
                ĐĂNG NHẬP
              </button>
            </form>

            <div className="text-center mt-6 text-sm text-gray-600">
              Chưa có tài khoản?{" "}
              <button
                type="button"
                onClick={() => setView("register")}
                className="text-primary hover:underline font-bold focus:outline-none"
              >
                Đăng ký ngay
              </button>
            </div>
          </div>
        )}

        {/* ========================================== */}
        {/* THỦ TỤC 2: GIAO DIỆN ĐĂNG KÝ               */}
        {/* ========================================== */}
        {view === "register" && (
          <div>
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">
                TẠO TÀI KHOẢN MỚI
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                Đăng ký thành viên để nhận nhiều ưu đãi từ PC Shop
              </p>
            </div>

            <form onSubmit={handleRegisterSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tên tài khoản
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    value={regUsername}
                    onChange={(e) => setRegUsername(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-gray-800 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition"
                    placeholder="Nhập tên tài khoản mới..."
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Địa chỉ Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="email"
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-gray-800 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition"
                    placeholder="example@gmail.com"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Mật khẩu
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="password"
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-gray-800 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition"
                    placeholder="Tối thiểu 6 ký tự..."
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Xác nhận mật khẩu
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="password"
                    value={regConfirmPassword}
                    onChange={(e) => setRegConfirmPassword(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-gray-800 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition"
                    placeholder="Nhập lại mật khẩu..."
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-primary text-white py-2.5 rounded-lg font-bold hover:bg-red-700 transition shadow-lg shadow-red-200 mt-2"
              >
                ĐĂNG KÝ
              </button>
            </form>

            <div className="text-center mt-6 text-sm text-gray-600">
              Đã có tài khoản?{" "}
              <button
                type="button"
                onClick={() => setView("login")}
                className="text-primary hover:underline font-bold focus:outline-none"
              >
                Đăng nhập ngay
              </button>
            </div>
          </div>
        )}

        {/* ========================================== */}
        {/* THỦ TỤC 3: GIAO DIỆN QUÊN MẬT KHẨU          */}
        {/* ========================================== */}
        {view === "forgot" && (
          <div>
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">
                KHÔI PHỤC MẬT KHẨU
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                Vui lòng nhập email của bạn để lấy lại mật khẩu
              </p>
            </div>

            <form onSubmit={handleForgotSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Địa chỉ Email đã đăng ký
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="email"
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg text-gray-800 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition"
                    placeholder="example@gmail.com"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-primary text-white py-3 rounded-lg font-bold hover:bg-red-700 transition shadow-lg shadow-red-200"
              >
                GỬI YÊU CẦU
              </button>
            </form>

            <div className="text-center mt-6 text-sm text-gray-600">
              Quay lại màn hình{" "}
              <button
                type="button"
                onClick={() => setView("login")}
                className="text-primary hover:underline font-bold focus:outline-none"
              >
                Đăng nhập
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
