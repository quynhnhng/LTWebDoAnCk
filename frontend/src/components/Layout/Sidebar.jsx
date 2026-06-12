import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import MenuIcon from "../MenuIcon/MenuIcon.jsx";

export default function Sidebar({ showSidebar, setShowSidebar }) {
  const [categories, setCategories] = useState([]);

  // Gọi API lấy danh mục khi component được render
  useEffect(() => {
    fetch("http://localhost:5000/api/categories")
      .then((res) => res.json())
      .then((data) => setCategories(data))
      .catch((err) => console.error("Lỗi tải danh mục:", err));
  }, []);

  return (
    <>
      {/* Nút bấm để mở/đóng Sidebar */}
      {/* Đã hạ z-[1000] xuống z-40 ở dòng dưới */}
      <div
        className="fixed top-[100px] left-5 z-40 flex items-center gap-2 cursor-pointer text-gray-800 bg-white p-3 rounded-md shadow-md hover:bg-gray-100 transition-colors border border-gray-200"
        onClick={() => setShowSidebar(!showSidebar)}
      >
        <MenuIcon />
        <span className="font-semibold select-none hidden sm:block">
          Danh Mục
        </span>
      </div>

      {/* Nội dung Menu Sidebar */}
      {/* Đã hạ z-[999] xuống z-40 ở dòng dưới */}
      <div
        className={`fixed top-[160px] left-5 bg-white p-4 w-[250px] rounded-lg shadow-2xl border border-gray-200 z-40 transition-all duration-300 ${
          showSidebar
            ? "opacity-100 visible translate-y-0"
            : "opacity-0 invisible -translate-y-4"
        }`}
      >
        <aside>
          <ul className="space-y-1">
            <li>
              <Link
                to="/"
                onClick={() => setShowSidebar(false)}
                className="block p-2 text-primary font-bold hover:bg-gray-100 rounded transition-colors"
              >
                Tất cả sản phẩm
              </Link>
            </li>

            <hr className="my-2 border-gray-200" />

            {categories.length > 0 ? (
              categories.map((cat, index) => (
                <li key={index}>
                  <Link
                    to={`/category/${cat}`}
                    onClick={() => setShowSidebar(false)}
                    className="block p-2 text-gray-700 hover:text-primary hover:bg-gray-100 rounded transition-colors capitalize font-medium"
                  >
                    {cat.replace(/-/g, " ")}
                  </Link>
                </li>
              ))
            ) : (
              <li className="p-2 text-gray-500 italic text-sm">Đang tải...</li>
            )}
          </ul>
        </aside>
      </div>
    </>
  );
}
