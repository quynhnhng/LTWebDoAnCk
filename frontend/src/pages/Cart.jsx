import React from "react";
import Product from "../components/Product/Product.jsx";

// 1. Thêm prop showToast vào đây
function Cart({ cartItems, removeFromCart, clearCart, showToast }) {
  const totalPrice = cartItems.reduce((total, item) => {
    return total + item.price * item.quantity;
  }, 0);

  const formatPrice = (price) => {
    return price.toLocaleString("vi-VN") + "đ";
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h2 className="text-4xl font-bold text-center mb-8 text-gray-800">
        Giỏ Hàng Của Bạn
      </h2>

      {cartItems.length === 0 ? (
        <p className="text-center text-gray-500 text-lg">
          Giỏ hàng đang trống. Hãy quay lại trang chủ để mua sắm nhé!
        </p>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 justify-center">
            {cartItems.map((item) => (
              <Product
                key={item.id}
                id={item.id}
                src={item.src}
                title={item.title}
                price={item.price}
                quantity={item.quantity}
                onRemove={removeFromCart}
                buttonText="Xóa"
                showToast={showToast} // 2. Truyền showToast xuống Product để hiện thông báo khi Xóa
              />
            ))}
          </div>

          <div className="mt-12 text-right border-t pt-6">
            <h3 className="text-2xl font-bold text-gray-800 mb-4">
              Tổng cộng:{" "}
              <span className="text-green-600">{formatPrice(totalPrice)}</span>
            </h3>
            <button
              // 3. Truyền showToast vào hàm clearCart để kích hoạt thông báo thanh toán
              onClick={() => clearCart(showToast)}
              className="bg-green-600 hover:bg-green-700 text-white font-semibold text-lg px-8 py-3 rounded-lg shadow transition-colors"
            >
              Thanh Toán
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default Cart;
