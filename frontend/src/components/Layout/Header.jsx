import { Link, useNavigate } from "react-router-dom";
import {
  ShoppingCart,
  User,
  Bell,
  LogOut,
  ChevronDown,
  Edit,
  X,
  Phone,
  Mail,
  MapPin,
  CheckCircle,
} from "lucide-react";
import { useState, useRef, useEffect, useCallback } from "react";

// Modal sửa thông tin người dùng
function EditProfileModal({ user, onClose, onSaved, showToast }) {
  const [form, setForm] = useState({
    fullName: user?.FullName || "",
    email: user?.Email || "",
    phone: user?.Phone || "",
    address: user?.Address || "",
  });
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.fullName.trim()) {
      showToast("Họ và tên không được để trống!", "error");
      return;
    }
    setSaving(true);
    try {
      const response = await fetch("http://localhost:5000/api/update-profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: user.Id, ...form }),
      });
      const data = await response.json();
      if (!response.ok) {
        showToast(data.error || "Lỗi khi cập nhật thông tin!", "error");
        return;
      }
      // Cập nhật localStorage với thông tin mới
      localStorage.setItem("pcshop_user", JSON.stringify(data.user));
      window.dispatchEvent(new Event("pcshop_auth_change"));
      showToast("Cập nhật thông tin thành công!", "success");
      onSaved(data.user);
      onClose();
    } catch (err) {
      showToast("Không thể kết nối tới server!", "error");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
      <div className="relative w-full max-w-md bg-white p-6 rounded-xl shadow-2xl mx-4 border border-gray-100">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition"
        >
          <X className="w-5 h-5" />
        </button>

        <h2 className="text-xl font-bold text-gray-800 mb-5 pr-6">
          Chỉnh Sửa Thông Tin Cá Nhân
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Họ và tên <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={form.fullName}
                onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-gray-800 text-sm focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition"
                placeholder="Nhập họ và tên..."
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Địa chỉ Email
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-gray-800 text-sm focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition"
                placeholder="example@gmail.com"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Số điện thoại
            </label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="tel"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-gray-800 text-sm focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition"
                placeholder="Nhập số điện thoại..."
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Địa chỉ nhận hàng
            </label>
            <div className="relative">
              <MapPin className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
              <textarea
                rows="2"
                value={form.address}
                onChange={(e) => setForm({ ...form, address: e.target.value })}
                className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-gray-800 text-sm focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition resize-none"
                placeholder="Số nhà, tên đường, phường/xã, quận/huyện, tỉnh/thành..."
              />
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 rounded-lg border border-gray-300 text-gray-700 font-medium text-sm hover:bg-gray-50 transition"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex-1 py-2.5 rounded-lg bg-primary text-white font-bold text-sm hover:bg-red-700 transition disabled:opacity-60"
            >
              {saving ? "Đang lưu..." : "Lưu thay đổi"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// Modal chi tiết thông báo
function NotificationDetailModal({ notification, onClose, onMarkRead }) {
  const typeColors = {
    success: "text-green-600 bg-green-50 border-green-200",
    error: "text-red-600 bg-red-50 border-red-200",
    info: "text-blue-600 bg-blue-50 border-blue-200",
    warning: "text-yellow-600 bg-yellow-50 border-yellow-200",
  };

  const formatTime = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
      <div className="relative w-full max-w-md bg-white p-6 rounded-xl shadow-2xl mx-4 border border-gray-100">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition"
        >
          <X className="w-5 h-5" />
        </button>

        <h2 className="text-xl font-bold text-gray-800 mb-4 pr-6">
          Chi Tiết Thông Báo
        </h2>

        <div
          className={`rounded-lg border p-4 mb-4 ${typeColors[notification.Type] || typeColors.info}`}
        >
          <h3 className="font-bold text-lg mb-1">{notification.Title}</h3>
        </div>

        <div className="space-y-3">
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-gray-700 leading-relaxed text-sm">
              {notification.Message}
            </p>
          </div>

          <div className="flex items-center justify-between text-xs text-gray-400">
            <span>Thời gian: {formatTime(notification.CreatedAt)}</span>
            <span
              className={`px-2 py-1 rounded-full text-xs font-medium ${
                notification.IsRead
                  ? "bg-gray-100 text-gray-500"
                  : "bg-red-100 text-red-600"
              }`}
            >
              {notification.IsRead ? "Đã đọc" : "Chưa đọc"}
            </span>
          </div>
        </div>

        <div className="flex gap-3 mt-5">
          {!notification.IsRead && (
            <button
              onClick={() => {
                onMarkRead(notification.Id);
                onClose();
              }}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg bg-green-600 text-white font-medium text-sm hover:bg-green-700 transition"
            >
              <CheckCircle className="w-4 h-4" />
              Đánh dấu đã đọc
            </button>
          )}
          <button
            onClick={onClose}
            className="flex-1 py-2.5 rounded-lg border border-gray-300 text-gray-700 font-medium text-sm hover:bg-gray-50 transition"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
}

export default function Header({ cartItemCount, onOpenLogin, showToast }) {
  const navigate = useNavigate();

  const [currentUser, setCurrentUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("pcshop_user")) || null;
    } catch {
      return null;
    }
  });

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [selectedNotif, setSelectedNotif] = useState(null);

  const dropdownRef = useRef(null);
  const notifRef = useRef(null);

  const fetchNotifications = useCallback(async (user) => {
    if (!user) {
      setNotifications([]);
      return;
    }
    try {
      const res = await fetch(
        `http://localhost:5000/api/notifications?userId=${user.Id}`,
      );
      if (res.ok) setNotifications(await res.json());
    } catch {
      /* bỏ qua lỗi mạng */
    }
  }, []);

  const markAllRead = async () => {
    if (!currentUser) return;
    try {
      await fetch(
        `http://localhost:5000/api/notifications/read-all?userId=${currentUser.Id}`,
        { method: "PUT" },
      );
      setNotifications((prev) => prev.map((n) => ({ ...n, IsRead: true })));
    } catch {
      /* bỏ qua */
    }
  };

  const markOneRead = async (notifId) => {
    if (!currentUser) return;
    // Optimistic update
    setNotifications((prev) =>
      prev.map((n) => (n.Id === notifId ? { ...n, IsRead: true } : n)),
    );
    // Then sync all from server
    try {
      await fetch(
        `http://localhost:5000/api/notifications/read-all?userId=${currentUser.Id}`,
        { method: "PUT" },
      );
    } catch {
      /* bỏ qua */
    }
  };

  // Polling mỗi 30 giây
  useEffect(() => {
    fetchNotifications(currentUser);
    const interval = setInterval(() => fetchNotifications(currentUser), 30000);
    return () => clearInterval(interval);
  }, [currentUser, fetchNotifications]);

  // Lắng nghe đăng nhập/đăng xuất
  useEffect(() => {
    const syncUser = () => {
      try {
        const user = JSON.parse(localStorage.getItem("pcshop_user")) || null;
        setCurrentUser(user);
        fetchNotifications(user);
      } catch {
        setCurrentUser(null);
      }
    };
    window.addEventListener("storage", syncUser);
    window.addEventListener("pcshop_auth_change", syncUser);
    return () => {
      window.removeEventListener("storage", syncUser);
      window.removeEventListener("pcshop_auth_change", syncUser);
    };
  }, [fetchNotifications]);

  // Đóng dropdown khi click ra ngoài
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target))
        setIsDropdownOpen(false);
      if (notifRef.current && !notifRef.current.contains(e.target))
        setIsNotifOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("pcshop_user");
    localStorage.removeItem("pcshop_admin"); // Xóa cả admin session để tránh lọt vào /admin
    setCurrentUser(null);
    setNotifications([]);
    setIsDropdownOpen(false);
    window.dispatchEvent(new Event("pcshop_auth_change"));
    navigate("/");
  };

  const getInitial = (name) => {
    if (!name) return "U";
    return name.trim().charAt(0).toUpperCase();
  };

  const formatTime = (dateStr) => {
    const diff = Math.floor((Date.now() - new Date(dateStr)) / 1000);
    if (diff < 60) return "Vừa xong";
    if (diff < 3600) return `${Math.floor(diff / 60)} phút trước`;
    if (diff < 86400) return `${Math.floor(diff / 3600)} giờ trước`;
    return `${Math.floor(diff / 86400)} ngày trước`;
  };

  const unreadCount = notifications.filter((n) => !n.IsRead).length;

  return (
    <>
      <header className="bg-primary text-white py-6 px-8 flex fixed top-0 left-0 w-full z-50 items-center shadow-md">
        <Link to="/" className="flex items-center hover:opacity-80 transition">
          <img src="/pcshoplogo.png" alt="PC Shop Logo" className="w-10 h-10 mr-3" />
          <h1 className="text-3xl font-bold">PC Shop</h1>
        </Link>

        <h2 className="ml-24 text-lg font-semibold hidden md:block">
          Hotline: 032 7239043
        </h2>

        <nav className="ml-auto flex items-center gap-6 text-lg">
          <Link to="/about-us" className="hover:text-gray-200 transition">
            About Us
          </Link>

          {/* Giỏ hàng */}
          <Link
            to="/cart"
            className="hover:text-gray-200 transition relative flex items-center"
          >
            <ShoppingCart className="w-7 h-7" />
            {cartItemCount > 0 && (
              <span className="absolute -top-2 -right-3 bg-yellow-400 text-primary text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                {cartItemCount}
              </span>
            )}
          </Link>

          {/* Thông báo */}
          <div className="relative" ref={notifRef}>
            <button
              onClick={() => {
                setIsNotifOpen(!isNotifOpen);
                setIsDropdownOpen(false);
              }}
              className="hover:text-gray-200 transition relative flex items-center focus:outline-none mt-1"
            >
              <Bell className="w-7 h-7" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1">
                  {unreadCount > 9 ? "9+" : unreadCount}
                </span>
              )}
            </button>

            {isNotifOpen && (
              <div className="absolute right-[-40px] md:right-0 mt-5 w-80 bg-white rounded-xl shadow-2xl text-gray-800 z-50 border border-gray-100 overflow-hidden">
                <div className="px-4 py-3 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                  <h3 className="font-bold text-gray-800 text-base">
                    Thông báo{" "}
                    {unreadCount > 0 && (
                      <span className="text-primary">({unreadCount} mới)</span>
                    )}
                  </h3>
                  {unreadCount > 0 && (
                    <button
                      onClick={markAllRead}
                      className="text-xs text-primary font-medium hover:underline focus:outline-none"
                    >
                      Đánh dấu tất cả đã đọc
                    </button>
                  )}
                </div>

                <div className="max-h-[360px] overflow-y-auto">
                  {notifications.length === 0 ? (
                    <div className="px-4 py-8 text-center text-gray-400 text-sm">
                      {currentUser
                        ? "Chưa có thông báo nào"
                        : "Đăng nhập để xem thông báo"}
                    </div>
                  ) : (
                    notifications.map((notif) => (
                      <button
                        key={notif.Id}
                        onClick={() => {
                          setSelectedNotif(notif);
                          setIsNotifOpen(false);
                          if (!notif.IsRead) markOneRead(notif.Id);
                        }}
                        className={`w-full text-left px-4 py-3 border-b border-gray-50 hover:bg-gray-50 transition duration-150 cursor-pointer ${!notif.IsRead ? "bg-red-50/40" : ""}`}
                      >
                        <div className="flex justify-between items-start gap-2">
                          <h4
                            className={`text-sm font-bold flex-1 ${!notif.IsRead ? "text-gray-900" : "text-gray-600"}`}
                          >
                            {notif.Title}
                          </h4>
                          {!notif.IsRead && (
                            <span className="w-2 h-2 bg-primary rounded-full shrink-0 mt-1"></span>
                          )}
                        </div>
                        <p className="text-sm text-gray-600 mt-1 line-clamp-2 leading-relaxed">
                          {notif.Message}
                        </p>
                        <span className="text-xs text-gray-400 mt-1 block">
                          {formatTime(notif.CreatedAt)}
                        </span>
                        <span className="text-xs text-primary font-medium mt-1 block hover:underline">
                          Xem chi tiết →
                        </span>
                      </button>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Avatar / User menu */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => {
                setIsDropdownOpen(!isDropdownOpen);
                setIsNotifOpen(false);
              }}
              className="focus:outline-none flex items-center gap-2"
            >
              {currentUser ? (
                <>
                  <div className="w-9 h-9 bg-yellow-400 text-primary rounded-full flex items-center justify-center font-bold text-base">
                    {getInitial(currentUser.FullName)}
                  </div>
                  <span className="hidden md:block text-sm font-semibold max-w-[120px] truncate">
                    {currentUser.FullName}
                  </span>
                  <ChevronDown className="w-4 h-4 hidden md:block" />
                </>
              ) : (
                <div className="w-9 h-9 bg-white text-primary rounded-full flex items-center justify-center hover:bg-gray-200 transition">
                  <User className="w-6 h-6" />
                </div>
              )}
            </button>

            {isDropdownOpen && (
              <div className="absolute right-0 mt-3 w-52 bg-white rounded-md shadow-xl py-2 text-gray-800 z-50 border border-gray-100">
                {currentUser ? (
                  <>
                    <div className="px-4 py-2 border-b border-gray-100">
                      <p className="text-xs text-gray-500">Xin chào,</p>
                      <p className="font-bold text-gray-800 truncate">
                        {currentUser.FullName}
                      </p>
                      <p className="text-xs text-gray-400 truncate">
                        {currentUser.Email}
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        setIsDropdownOpen(false);
                        setShowEditProfile(true);
                      }}
                      className="w-full text-left flex items-center gap-2 px-4 py-2 hover:bg-blue-50 hover:text-blue-600 transition font-medium text-sm focus:outline-none"
                    >
                      <Edit className="w-4 h-4" /> Sửa thông tin cá nhân
                    </button>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left flex items-center gap-2 px-4 py-2 hover:bg-red-50 hover:text-primary transition font-medium text-sm focus:outline-none"
                    >
                      <LogOut className="w-4 h-4" /> Đăng xuất
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => {
                      setIsDropdownOpen(false);
                      onOpenLogin();
                    }}
                    className="w-full text-left block px-4 py-2 hover:bg-gray-100 hover:text-primary transition font-medium focus:outline-none"
                  >
                    Đăng nhập
                  </button>
                )}
              </div>
            )}
          </div>
        </nav>
      </header>

      {/* Modal sửa thông tin */}
      {showEditProfile && currentUser && (
        <EditProfileModal
          user={currentUser}
          onClose={() => setShowEditProfile(false)}
          onSaved={(updatedUser) => setCurrentUser(updatedUser)}
          showToast={showToast || (() => {})}
        />
      )}

      {/* Modal chi tiết thông báo */}
      {selectedNotif && (
        <NotificationDetailModal
          notification={selectedNotif}
          onClose={() => setSelectedNotif(null)}
          onMarkRead={markOneRead}
        />
      )}
    </>
  );
}
