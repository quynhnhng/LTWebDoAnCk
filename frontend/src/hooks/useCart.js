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
      alert(
        `Đã tăng số lượng ${product.title} lên ${existingProduct.quantity + 1}`,
      );
    } else {
      setCart([...cart, { ...product, quantity: 1 }]);
      alert(`Đã thêm ${product.title} vào giỏ hàng!`);
    }
  };

  const removeFromCart = (productId) => {
    setCart(cart.filter((item) => item.id !== productId));
  };

  const clearCart = async () => {
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
        alert("Thanh toán thành công!");
      } else {
        alert("Có lỗi xảy ra khi lưu đơn hàng!");
      }
    } catch (error) {
      console.error(error);
      alert("Không thể kết nối đến Backend!");
    }
  };

  return { cart, handleAddToCart, removeFromCart, clearCart };
};
