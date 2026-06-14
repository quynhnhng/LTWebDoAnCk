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

  // ĐÃ SỬA: Xóa bỏ việc gọi API ở đây, chỉ đơn giản là làm rỗng mảng giỏ hàng
  const clearCart = () => {
    setCart([]);
  };

  return { cart, handleAddToCart, removeFromCart, clearCart };
};
