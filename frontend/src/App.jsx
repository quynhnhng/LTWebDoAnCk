import { useState } from "react";
import { Routes, Route } from "react-router-dom";
import Header from "./components/Layout/Header.jsx";
import Sidebar from "./components/Layout/Sidebar.jsx";
import Footer from "./components/Layout/Footer.jsx";
import Home from "./pages/Home.jsx";
import AboutUs from "./pages/AboutUs.jsx";
import Cart from "./pages/Cart.jsx";
import CategoryPage from "./pages/CategoryPage.jsx";
import { useCart } from "./hooks/useCart.js";

function App() {
  const [showSidebar, setShowSidebar] = useState(false);
  const { cart, handleAddToCart, removeFromCart, clearCart } = useCart();
  const cartItemCount = cart.reduce((total, item) => total + item.quantity, 0);

  return (
    <div className="font-sans min-h-screen flex flex-col bg-gray-50">
      <Header cartItemCount={cartItemCount} />
      <div className="flex flex-1 mt-[100px]">
        <Sidebar showSidebar={showSidebar} setShowSidebar={setShowSidebar} />
        <main className="flex-1 w-full max-w-7xl mx-auto p-4">
          <Routes>
            <Route path="/" element={<Home onAddToCart={handleAddToCart} />} />
            <Route path="/about-us" element={<AboutUs />} />
            <Route
              path="/cart"
              element={
                <Cart
                  cartItems={cart}
                  removeFromCart={removeFromCart}
                  clearCart={clearCart}
                />
              }
            />
            <Route
              path="/category/:categorySlug"
              element={<CategoryPage onAddToCart={handleAddToCart} />}
            />
          </Routes>
        </main>
      </div>
      <Footer />
    </div>
  );
}

export default App;
