import { Link } from "react-router-dom";
import { ShoppingCart, User } from "lucide-react";
import { useState, useRef, useEffect } from "react";

export default function Header({ cartItemCount, onOpenLogin }) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Đóng dropdown menu khi click ra ngoài vùng menu
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
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

        {/* Giỏ hàng với Icon từ lucide-react */}
        <Link
          to="/cart"
          className="hover:text-gray-200 transition relative flex items-center"
        >
          <ShoppingCart className="w-7 h-7" />
          {/* Hiển thị số lượng nhỏ ở góc phải icon giỏ hàng */}
          {cartItemCount > 0 && (
            <span className="absolute -top-2 -right-3 bg-yellow-400 text-primary text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
              {cartItemCount}
            </span>
          )}
        </Link>

        {/* Avatar và Dropdown Đăng nhập */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
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
                  onOpenLogin(); // Gọi hàm mở Modal đăng nhập
                }}
                className="w-full text-left block px-4 py-2 hover:bg-gray-100 hover:text-primary transition font-medium"
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
