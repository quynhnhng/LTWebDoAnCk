const Product = ({
  id,
  src,
  title,
  price,
  onAddToCart,
  onRemove,
  quantity,
  buttonText = "Thêm vào giỏ",
  showToast, // <-- Nhận prop showToast truyền từ Home.jsx / CategoryPage.jsx xuống
}) => {
  const displayPrice = price.toLocaleString("vi-VN") + "₫";

  return (
    <div className="border border-gray-200 p-4 w-full max-w-[250px] mx-auto rounded-xl bg-white shadow-sm hover:shadow-md transition-shadow flex flex-col">
      <img
        className="w-full h-auto object-cover rounded-md mb-4"
        src={src}
        alt={title}
      />
      <h3 className="text-lg font-semibold text-gray-800 truncate mb-1">
        {title}
      </h3>
      <p className="text-primary font-bold mb-2">{displayPrice}</p>

      {quantity > 0 && (
        <p className="text-sm text-gray-600 mb-3 font-medium">
          Số lượng: {quantity}
        </p>
      )}

      <div className="mt-auto pt-2">
        <button
          className={`w-full py-2.5 rounded-lg font-medium text-white transition-colors ${
            onRemove
              ? "bg-red-500 hover:bg-red-600"
              : "bg-blue-600 hover:bg-blue-700"
          }`}
          onClick={() => {
            if (onRemove) {
              onRemove(id);
              // Kích hoạt thông báo khi xóa
              if (showToast)
                showToast("Đã xóa sản phẩm khỏi giỏ hàng", "success");
            } else if (onAddToCart) {
              onAddToCart({ id, src, title, price });
              // Kích hoạt thông báo khi thêm thành công
              if (showToast)
                showToast(
                  "Đã thêm sản phẩm vào giỏ hàng thành công!",
                  "success",
                );
            }
          }}
        >
          {buttonText}
        </button>
      </div>
    </div>
  );
};

export default Product;
