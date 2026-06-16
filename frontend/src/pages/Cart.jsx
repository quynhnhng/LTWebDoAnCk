import React, { useState, useEffect } from "react";
import {
  Trash2,
  ShoppingBag,
  CreditCard,
  User,
  Phone,
  MapPin,
  FileText,
} from "lucide-react";

function Cart({ cartItems = [], removeFromCart, clearCart, showToast }) {
  // Lấy thông tin người dùng từ localStorage
  const getCurrentUser = () => {
    try {
      return JSON.parse(localStorage.getItem("pcshop_user")) || null;
    } catch {
      return null;
    }
  };

  const [currentUser, setCurrentUser] = useState(getCurrentUser);

  // Khởi tạo State cho Form - tự động điền từ thông tin người dùng
  const [customerName, setCustomerName] = useState(currentUser?.FullName || "");
  const [customerPhone, setCustomerPhone] = useState(currentUser?.Phone || "");
  const [customerAddress, setCustomerAddress] = useState(
    currentUser?.Address || "",
  );
  const [customerNotes, setCustomerNotes] = useState("");

  // Lắng nghe thay đổi đăng nhập/đăng xuất
  useEffect(() => {
    const syncUser = () => {
      const user = getCurrentUser();
      setCurrentUser(user);
      if (user) {
        setCustomerName(user.FullName || "");
        setCustomerPhone(user.Phone || "");
        setCustomerAddress(user.Address || "");
      } else {
        setCustomerName("");
        setCustomerPhone("");
        setCustomerAddress("");
        setCustomerNotes("");
      }
    };

    window.addEventListener("storage", syncUser);
    window.addEventListener("pcshop_auth_change", syncUser);
    return () => {
      window.removeEventListener("storage", syncUser);
      window.removeEventListener("pcshop_auth_change", syncUser);
    };
  }, []);

  // Cập nhật form khi currentUser thay đổi
  useEffect(() => {
    if (currentUser) {
      setCustomerName(currentUser.FullName || "");
      setCustomerPhone(currentUser.Phone || "");
      setCustomerAddress(currentUser.Address || "");
    }
  }, [currentUser]);

  const totalPrice = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0,
  );

  const formatPrice = (price) => {
    return price.toLocaleString("vi-VN") + "₫";
  };

  const handleSubmitOrder = async (e) => {
    e.preventDefault();

    if (
      !customerName.trim() ||
      !customerPhone.trim() ||
      !customerAddress.trim()
    ) {
      if (showToast)
        showToast(
          "Vui lòng nhập đầy đủ Tên, Số điện thoại và Địa chỉ nhận hàng!",
          "error",
        );
      return;
    }

    const payload = {
      items: cartItems,
      totalPrice: totalPrice,
      receiverName: customerName,
      receiverPhone: customerPhone,
      shippingAddress: customerAddress,
      userId: currentUser?.Id || null,
    };

    try {
      const response = await fetch("http://localhost:5000/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        if (showToast) showToast("Xác nhận đặt hàng thành công!", "success");

        if (clearCart) {
          clearCart();
          if (!currentUser) {
            setCustomerName("");
            setCustomerPhone("");
            setCustomerAddress("");
            setCustomerNotes("");
          }
        }
      } else {
        const errorData = await response.json();
        if (showToast)
          showToast(errorData.error || "Lỗi khi đặt hàng!", "error");
      }
    } catch (error) {
      console.error("Lỗi khi kết nối tới Server:", error);
      if (showToast) showToast("Không thể kết nối tới Server!", "error");
    }
  };

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto animate-fade-in">
      <h2 className="text-3xl font-extrabold mb-8 text-gray-800 flex items-center gap-3 border-b pb-4">
        <ShoppingBag className="w-8 h-8 text-primary" />
        Giỏ Hàng Của Bạn
      </h2>

      {cartItems.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl shadow-sm border border-gray-100">
          <ShoppingBag className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 text-lg mb-6 font-medium">
            Giỏ hàng của bạn đang trống rỗng.
          </p>
          <a
            href="/"
            className="bg-primary hover:bg-red-700 text-white font-bold px-6 py-3 rounded-xl transition-all shadow-md inline-block"
          >
            Quay lại mua sắm ngay
          </a>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* CỘT TRÁI: DANH SÁCH SẢN PHẨM */}
          <div className="lg:col-span-7 space-y-4">
            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex justify-between items-center">
              <span className="text-sm font-semibold text-gray-600">
                Sản phẩm (
                {cartItems.reduce((acc, item) => acc + item.quantity, 0)})
              </span>
              <button
                onClick={() => {
                  if (
                    window.confirm(
                      "Bạn có chắc chắn muốn xóa sạch giỏ hàng không?",
                    )
                  ) {
                    cartItems.forEach((item) => removeFromCart(item.id));
                    if (showToast)
                      showToast("Đã làm trống giỏ hàng!", "success");
                  }
                }}
                className="text-sm text-red-500 hover:text-red-700 font-medium transition-colors"
              >
                Xóa tất cả
              </button>
            </div>

            {cartItems.map((item) => (
              <div
                key={item.id}
                className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4 hover:shadow-md transition-shadow"
              >
                <div className="w-20 h-20 bg-gray-50 rounded-lg p-1 border flex items-center justify-center shrink-0">
                  <img
                    src={item.src}
                    alt={item.title}
                    className="max-w-full max-h-full object-contain rounded"
                  />
                </div>

                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-gray-800 text-base truncate mb-1">
                    {item.title}
                  </h4>
                  <div className="flex items-center gap-4 text-sm">
                    <span className="text-primary font-bold text-base">
                      {formatPrice(item.price)}
                    </span>
                    <span className="text-gray-400 font-medium">
                      Số lượng:{" "}
                      <strong className="text-gray-700">{item.quantity}</strong>
                    </span>
                  </div>
                </div>

                <div className="text-right shrink-0 flex flex-col items-end gap-2">
                  <span className="font-extrabold text-gray-800 text-base">
                    {formatPrice(item.price * item.quantity)}
                  </span>
                  <button
                    onClick={() => {
                      removeFromCart(item.id);
                      if (showToast)
                        showToast("Đã xóa sản phẩm khỏi giỏ hàng", "success");
                    }}
                    className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                    title="Xóa sản phẩm"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* CỘT PHẢI: FORM THÔNG TIN NHẬN HÀNG & BILL */}
          <div className="lg:col-span-5 bg-white p-6 rounded-2xl shadow-md border border-gray-100 sticky top-28">
            <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2 border-b pb-3">
              <CreditCard className="w-5 h-5 text-gray-600" />
              Thông Tin Đặt Hàng & Thanh Toán
            </h3>

            {/* Trạng thái đăng nhập */}
            <div className="mb-4 text-xs flex items-center bg-gray-50 p-2.5 rounded-lg border border-gray-200">
              <span className="text-gray-600 font-medium">
                Trạng thái:{" "}
                {currentUser ? (
                  <strong className="text-green-600">
                    Đã đăng nhập (Đã tự điền)
                  </strong>
                ) : (
                  <strong className="text-yellow-600">Khách vãng lai</strong>
                )}
              </span>
            </div>

            <form onSubmit={handleSubmitOrder} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                  Họ và tên <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-gray-800 text-sm focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition"
                    placeholder="Nhập họ và tên người nhận..."
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                  Số điện thoại <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-gray-800 text-sm focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition"
                    placeholder="Nhập số điện thoại liên hệ..."
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                  Địa chỉ nhận hàng <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                  <textarea
                    rows="2"
                    value={customerAddress}
                    onChange={(e) => setCustomerAddress(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-gray-800 text-sm focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition resize-none"
                    placeholder="Số nhà, tên đường, thôn/xóm, xã/phường, quận/huyện, tỉnh..."
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                  Ghi chú đơn hàng (Không bắt buộc)
                </label>
                <div className="relative">
                  <FileText className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                  <textarea
                    rows="2"
                    value={customerNotes}
                    onChange={(e) => setCustomerNotes(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-gray-800 text-sm focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition resize-none"
                    placeholder="Chỉ dẫn giao hàng, thời gian nhận hàng..."
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-dashed border-gray-200 space-y-2">
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Tạm tính:</span>
                  <span className="font-medium">{formatPrice(totalPrice)}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Phí vận chuyển:</span>
                  <span className="text-green-600 font-medium">Miễn phí</span>
                </div>
                <div className="flex justify-between items-center pt-2 text-gray-800">
                  <span className="text-base font-bold">Tổng cộng:</span>
                  <span className="text-2xl font-extrabold text-primary">
                    {formatPrice(totalPrice)}
                  </span>
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-primary hover:bg-red-700 text-white font-bold text-lg py-3.5 rounded-xl shadow-lg shadow-red-100 transition-all flex items-center justify-center gap-2 mt-4"
              >
                XÁC NHẬN ĐẶT HÀNG
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Cart;
