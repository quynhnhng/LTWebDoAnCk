import { useState } from "react";

export const useCart = () => {
  const [cart, setCart] = useState([]);

  // 1. Thêm tham số quantityToAdd, mặc định là 1 (nếu bấm ở trang chủ)
  const handleAddToCart = (product, quantityToAdd = 1) => {
    // 2. Dùng prevCart (state trước đó) để đảm bảo không bị lỗi bất đồng bộ của React
    setCart((prevCart) => {
      const existingProduct = prevCart.find((item) => item.id === product.id);

      if (existingProduct) {
        return prevCart.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + quantityToAdd } // Cộng dồn số lượng
            : item,
        );
      } else {
        return [...prevCart, { ...product, quantity: quantityToAdd }]; // Thêm mới với số lượng tương ứng
      }
    });
  };

  const removeFromCart = (productId) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== productId));
  };

  const clearCart = async (showToast) => {
    if (cart.length === 0) return;

    const totalPrice = cart.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0,
    );

    try {
      const response = await fetch("http://localhost:5000/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          items: cart,
          totalPrice: totalPrice,
        }),
      });

      if (response.ok) {
        setCart([]);
        if (showToast) showToast("Thanh toán thành công!", "success");
      } else {
        if (showToast) showToast("Có lỗi xảy ra khi lưu đơn hàng!", "error");
      }
    } catch (error) {
      console.error(error);
      if (showToast) showToast("Không thể kết nối đến Backend!", "error");
    }
  };

  return { cart, handleAddToCart, removeFromCart, clearCart };
};
