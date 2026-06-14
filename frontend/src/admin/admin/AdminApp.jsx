import { Navigate, Route, Routes } from "react-router-dom";
import { getAdmin } from "./helpers.js";
import AdminLogin from "./pages/AdminLogin.jsx";
import AdminLayout from "./components/AdminLayout.jsx";

// File goc cua khu vuc Admin
// - /admin/login: trang dang nhap (neu da dang nhap roi thi chuyen vao /admin)
// - /admin/*: toan bo cac trang con (Dashboard, Products, Orders...) nam trong AdminLayout
export default function AdminApp() {
  const admin = getAdmin();

  return (
    <Routes>
      <Route
        path="/admin/login"
        element={admin?.Role === "admin" ? <Navigate to="/admin" replace /> : <AdminLogin />}
      />
      <Route path="/admin/*" element={<AdminLayout />} />
    </Routes>
  );
}
