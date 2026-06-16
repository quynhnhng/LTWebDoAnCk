import { useEffect } from "react";
import {
  Link,
  Navigate,
  Route,
  Routes,
  useLocation,
  useNavigate,
} from "react-router-dom";
import {
  BarChart3,
  Boxes,
  ClipboardList,
  FolderTree,
  LayoutDashboard,
  LogOut,
  Users,
} from "lucide-react";
import Dashboard from "../pages/Dashboard.jsx";
import ProductsPage from "../pages/ProductsPage.jsx";
import CategoriesPage from "../pages/CategoriesPage.jsx";
import OrdersPage from "../pages/OrdersPage.jsx";
import AccountsPage from "../pages/AccountsPage.jsx";
import StatisticsPage from "../pages/StatisticsPage.jsx";

const menus = [
  { to: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { to: "/admin/products", label: "Sản phẩm", icon: Boxes },
  { to: "/admin/categories", label: "Danh mục", icon: FolderTree },
  { to: "/admin/orders", label: "Đơn hàng", icon: ClipboardList },
  { to: "/admin/accounts", label: "Tài khoản", icon: Users },
  { to: "/admin/statistics", label: "Thống kê", icon: BarChart3 },
];

function getAdmin() {
  try {
    return JSON.parse(localStorage.getItem("pcshop_admin"));
  } catch {
    return null;
  }
}

export default function AdminLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const admin = getAdmin();

  // Safety net: nếu không phải admin thì về trang chủ
  useEffect(() => {
    if (!admin || admin.Role !== "admin") {
      navigate("/", { replace: true });
    }
  }, [admin, navigate]);

  if (!admin || admin.Role !== "admin") return null;

  const logout = () => {
    localStorage.removeItem("pcshop_admin");
    localStorage.removeItem("pcshop_user");
    navigate("/", { replace: true });
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 hidden h-screen w-64 bg-gray-900 text-white md:block">
        <div className="border-b border-gray-700 p-5">
          <h1 className="text-xl font-bold">PC Shop Admin</h1>
          <p className="mt-1 text-sm text-gray-400">{admin.FullName}</p>
        </div>
        <nav className="p-3">
          {menus.map((item) => {
            const Icon = item.icon;
            const active = location.pathname === item.to;
            return (
              <Link
                key={item.to}
                to={item.to}
                className={`mb-1 flex items-center gap-3 rounded px-3 py-2 text-sm font-medium ${
                  active
                    ? "bg-primary text-white"
                    : "text-gray-300 hover:bg-gray-800"
                }`}
              >
                <Icon className="h-5 w-5" />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Main content */}
      <div className="md:ml-64">
        <header className="sticky top-0 z-20 flex items-center justify-between bg-white px-4 py-3 shadow-sm">
          {/* Mobile menu */}
          <div className="flex flex-wrap gap-2 md:hidden">
            {menus.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className="rounded bg-gray-100 px-2 py-1 text-xs"
              >
                {item.label}
              </Link>
            ))}
          </div>
          <Link
            to="/"
            className="text-sm font-medium text-primary hover:underline"
          >
            Về trang shop
          </Link>
          <button
            onClick={logout}
            className="flex items-center gap-2 rounded bg-gray-900 px-3 py-2 text-sm text-white hover:bg-gray-700 transition"
          >
            <LogOut className="h-4 w-4" /> Đăng xuất
          </button>
        </header>

        <main className="p-4 md:p-6">
          <Routes>
            <Route index element={<Dashboard />} />
            <Route path="products" element={<ProductsPage />} />
            <Route path="categories" element={<CategoriesPage />} />
            <Route path="orders" element={<OrdersPage />} />
            <Route path="accounts" element={<AccountsPage />} />
            <Route
              path="users"
              element={<Navigate to="/admin/accounts" replace />}
            />
            <Route
              path="admins"
              element={<Navigate to="/admin/accounts" replace />}
            />
            <Route path="statistics" element={<StatisticsPage />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}
