import { Link, useNavigate } from "react-router-dom";
import { ShoppingCart, User, Bell, LogOut, ChevronDown } from "lucide-react";
import { useState, useRef, useEffect, useCallback } from "react";

export default function Header({ cartItemCount, onOpenLogin }) {
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

  const dropdownRef = useRef(null);
  const notifRef = useRef(null);

  // Lấy thông báo từ API
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

  // Đánh dấu tất cả đã đọc
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
    <header className="bg-primary text-white py-6 px-8 flex fixed top-0 left-0 w-full z-50 items-center shadow-md">
      <Link to="/" className="hover:opacity-80 transition">
        <h1 className="text-3xl font-bold">PC Shop</h1>
      </Link>

      <h2 className="ml-24 text-lg font-semibold hidden md:block">
        Hotline: 123-456-7890
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
                    Đánh dấu đã đọc
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
                    <div
                      key={notif.Id}
                      className={`px-4 py-3 border-b border-gray-50 hover:bg-gray-50 transition duration-150 ${!notif.IsRead ? "bg-red-50/40" : ""}`}
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
                    </div>
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
            <div className="absolute right-0 mt-3 w-48 bg-white rounded-md shadow-xl py-2 text-gray-800 z-50 border border-gray-100">
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
  );
}
