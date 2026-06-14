import { useState } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
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
import AdminApp from "./admin/admin/AdminApp.jsx";

// 1. Import trang Chi tiết sản phẩm mới tạo vào đây
import ProductDetail from "./pages/ProductDetail.jsx";

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

  if (location.pathname.startsWith("/admin")) {
    return <AdminApp />;
  }

  return (
    <div className="font-sans min-h-screen flex flex-col bg-gray-50">
      <Header
        cartItemCount={cartItemCount}
        onOpenLogin={() => setIsLoginOpen(true)}
      />

      <div className="flex flex-1 mt-[100px]">
        <Sidebar showSidebar={showSidebar} setShowSidebar={setShowSidebar} />
        <main className="flex-1 w-full max-w-7xl mx-auto p-4">
          <Routes>
            <Route
              path="/"
              element={
                <Home onAddToCart={handleAddToCart} showToast={showToast} />
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
                />
              }
            />

            {/* 2. Cấu hình định tuyến động cho trang Chi tiết sản phẩm */}
            <Route
              path="/product/:productId"
              element={
                <ProductDetail
                  onAddToCart={handleAddToCart}
                  showToast={showToast}
                />
              }
            />
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
