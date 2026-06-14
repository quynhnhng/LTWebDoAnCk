import { Link } from "react-router-dom";
// ĐÃ THÊM: Import icon Bell (Cái chuông)
import { ShoppingCart, User, Bell } from "lucide-react";
import { useState, useRef, useEffect } from "react";

export default function Header({ cartItemCount, onOpenLogin }) {
  // State quản lý Dropdown của Avatar
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // State quản lý Dropdown của Thông báo
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const notifRef = useRef(null);

  // Dữ liệu giả lập cho Thông báo
  const mockNotifications = [
    {
      id: 1,
      title: "🎉 Đặt hàng thành công",
      message:
        "Đơn hàng #PC1024 của bạn đã được xác nhận và đang trong quá trình đóng gói.",
      time: "2 giờ trước",
      unread: true,
    },
    {
      id: 2,
      title: "⚠️ Hệ thống cảnh báo",
      message:
        "Tài khoản của bạn đã bị cấm bình luận 3 ngày do vi phạm tiêu chuẩn cộng đồng (Spam).",
      time: "1 ngày trước",
      unread: true,
    },
    {
      id: 3,
      title: "🔥 Khuyến mãi sốc",
      message:
        "Giảm ngay 15% cho tất cả Laptop Gaming áp dụng từ hôm nay. Mua ngay kẻo lỡ!",
      time: "3 ngày trước",
      unread: false,
    },
  ];

  // Đóng dropdown khi click ra ngoài vùng menu (Áp dụng cho cả Avatar và Notification)
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(event.target)) {
        setIsNotifOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <header className="bg-primary text-white py-6 px-8 flex fixed top-0 left-0 w-full z-50 items-center shadow-md">
      {/* Logo PC Shop nhấn vào sẽ về trang chủ */}
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

        {/* 1. Giỏ hàng */}
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

        {/* 2. Nút Thông báo (Cái chuông) */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => {
              setIsNotifOpen(!isNotifOpen);
              setIsDropdownOpen(false); // Tự động đóng menu Avatar nếu đang mở
            }}
            className="hover:text-gray-200 transition relative flex items-center focus:outline-none mt-1"
          >
            <Bell className="w-7 h-7" />
            {/* Chấm đỏ báo có thông báo chưa đọc */}
            {mockNotifications.some((n) => n.unread) && (
              <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-primary"></span>
            )}
          </button>

          {/* Bảng danh sách Thông báo thả xuống */}
          {isNotifOpen && (
            <div className="absolute right-[-40px] md:right-0 mt-5 w-80 bg-white rounded-xl shadow-2xl text-gray-800 z-50 border border-gray-100 overflow-hidden cursor-default">
              <div className="px-4 py-3 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                <h3 className="font-bold text-gray-800 text-base">
                  Thông báo mới
                </h3>
                <button className="text-xs text-primary font-medium hover:underline focus:outline-none">
                  Đánh dấu đã đọc
                </button>
              </div>

              <div className="max-h-[320px] overflow-y-auto">
                {mockNotifications.map((notif) => (
                  <div
                    key={notif.id}
                    className={`px-4 py-3 border-b border-gray-50 hover:bg-gray-100 transition duration-150 ${notif.unread ? "bg-red-50/30" : ""}`}
                  >
                    <h4
                      className={`text-sm font-bold ${notif.unread ? "text-gray-900" : "text-gray-700"}`}
                    >
                      {notif.title}
                    </h4>
                    <p className="text-sm text-gray-600 mt-1 line-clamp-2 leading-relaxed">
                      {notif.message}
                    </p>
                    <span className="text-xs text-gray-400 mt-2 block font-medium">
                      {notif.time}
                    </span>
                  </div>
                ))}
              </div>

              <div className="px-4 py-3 text-center border-t border-gray-100 bg-gray-50 hover:bg-gray-100 transition cursor-pointer">
                <span className="text-sm text-primary font-bold">
                  Xem tất cả
                </span>
              </div>
            </div>
          )}
        </div>

        {/* 3. Avatar và Dropdown Đăng nhập */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => {
              setIsDropdownOpen(!isDropdownOpen);
              setIsNotifOpen(false); // Tự động đóng menu Thông báo nếu đang mở
            }}
            className="focus:outline-none flex items-center"
          >
            <div className="w-9 h-9 bg-white text-primary rounded-full flex items-center justify-center hover:bg-gray-200 transition">
              <User className="w-6 h-6" />
            </div>
          </button>

          {/* Menu thả xuống chỉ chứa Đăng nhập */}
          {isDropdownOpen && (
            <div className="absolute right-0 mt-3 w-40 bg-white rounded-md shadow-xl py-2 text-gray-800 z-50 border border-gray-100">
              <button
                onClick={() => {
                  setIsDropdownOpen(false);
                  onOpenLogin();
                }}
                className="w-full text-left block px-4 py-2 hover:bg-gray-100 hover:text-primary transition font-medium focus:outline-none"
              >
                Đăng nhập
              </button>
            </div>
          )}
        </div>
      </nav>
    </header>
  );
}
