import { useState } from "react";

export const useCart = () => {
  const [cart, setCart] = useState([]);

  const handleAddToCart = (product) => {
    const existingProduct = cart.find((item) => item.id === product.id);

    if (existingProduct) {
      setCart(
        cart.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item,
        ),
      );
      // Đã xóa alert cũ ở đây
    } else {
      setCart([...cart, { ...product, quantity: 1 }]);
      // Đã xóa alert cũ ở đây
    }
  };

  const removeFromCart = (productId) => {
    setCart(cart.filter((item) => item.id !== productId));
  };

  // Mình cho phép nhận hàm showToast để thay thế cho alert ở trang Giỏ Hàng
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
