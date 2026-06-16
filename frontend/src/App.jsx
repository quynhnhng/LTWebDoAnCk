import { useState } from "react";
import { Routes, Route, useLocation, Navigate } from "react-router-dom";
import Header from "./components/Layout/Header.jsx";
import Sidebar from "./components/Layout/Sidebar.jsx";
import Footer from "./components/Layout/Footer.jsx";
import Home from "./pages/Home.jsx";
import AboutUs from "./pages/AboutUs.jsx";
import Cart from "./pages/Cart.jsx";
import CategoryPage from "./pages/CategoryPage.jsx";
import { useCart } from "./hooks/useCart.js";
import LoginModal from "./components/Layout/LoginModal.jsx";
import Toast from "./components/Layout/Toast.jsx";
import ProductDetail from "./pages/ProductDetail.jsx";
import ResetPassword from "./pages/ResetPassword.jsx";

// Admin pages
import AdminLogin from "./admin/admin/pages/AdminLogin.jsx";
import AdminLayout from "./admin/admin/components/AdminLayout.jsx";

function getAdmin() {
  try {
    return JSON.parse(localStorage.getItem("pcshop_admin"));
  } catch {
    return null;
  }
}

// Guard: chỉ admin mới vào được, còn lại về trang chủ
function AdminGuard() {
  const admin = getAdmin();
  if (!admin || admin.Role !== "admin") {
    return <Navigate to="/" replace />;
  }
  return <AdminLayout />;
}

function App() {
  const location = useLocation();
  const [showSidebar, setShowSidebar] = useState(false);
  const { cart, handleAddToCart, removeFromCart, clearCart } = useCart();
  const cartItemCount = cart.reduce((total, item) => total + item.quantity, 0);

  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [toast, setToast] = useState({
    isVisible: false,
    message: "",
    type: "success",
  });

  const showToast = (message, type = "success") => {
    setToast({ isVisible: true, message, type });
  };

  const handleCloseToast = () => {
    setToast((prev) => ({ ...prev, isVisible: false }));
  };

  // Trang admin không có Header/Footer của shop
  const isAdminRoute = location.pathname.startsWith("/admin");

  if (isAdminRoute) {
    return (
      <Routes>
        {/* Trang đăng nhập admin: ai cũng vào được để đăng nhập
            Nếu đã là admin rồi thì redirect vào /admin */}
        <Route
          path="/admin/login"
          element={
            getAdmin()?.Role === "admin" ? (
              <Navigate to="/admin" replace />
            ) : (
              <AdminLogin />
            )
          }
        />
        {/* Tất cả route /admin/* còn lại: qua AdminGuard kiểm tra */}
        <Route path="/admin/*" element={<AdminGuard />} />
      </Routes>
    );
  }

  return (
    <div className="font-sans min-h-screen flex flex-col bg-gray-50">
      <Header
        cartItemCount={cartItemCount}
        onOpenLogin={() => setIsLoginOpen(true)}
        showToast={showToast}
      />

      <div className="flex flex-1 mt-[100px]">
        <Sidebar showSidebar={showSidebar} setShowSidebar={setShowSidebar} />
        <main className="flex-1 w-full max-w-7xl mx-auto p-4">
          <Routes>
            <Route
              path="/"
              element={
                <Home
                  onAddToCart={handleAddToCart}
                  showToast={showToast}
                  onOpenLogin={() => setIsLoginOpen(true)}
                />
              }
            />
            <Route path="/about-us" element={<AboutUs />} />
            <Route
              path="/cart"
              element={
                <Cart
                  cartItems={cart}
                  removeFromCart={removeFromCart}
                  clearCart={clearCart}
                  showToast={showToast}
                />
              }
            />
            <Route
              path="/category/:categorySlug"
              element={
                <CategoryPage
                  onAddToCart={handleAddToCart}
                  showToast={showToast}
                  onOpenLogin={() => setIsLoginOpen(true)}
                />
              }
            />
            <Route
              path="/product/:productId"
              element={
                <ProductDetail
                  onAddToCart={handleAddToCart}
                  showToast={showToast}
                  onOpenLogin={() => setIsLoginOpen(true)}
                />
              }
            />
            <Route path="/reset-password" element={<ResetPassword />} />
          </Routes>
        </main>
      </div>
      <Footer />

      <LoginModal
        isOpen={isLoginOpen}
        onClose={() => setIsLoginOpen(false)}
        showToast={showToast}
      />

      {toast.isVisible && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={handleCloseToast}
        />
      )}
    </div>
  );
}

export default App;
