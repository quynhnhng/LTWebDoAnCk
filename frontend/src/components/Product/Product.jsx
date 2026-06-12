import { Link } from "react-router-dom";

const Product = ({
  id,
  src,
  title,
  price,
  promoPrice, // Thêm prop nhận giá khuyến mãi
  onAddToCart,
  onRemove,
  quantity,
  buttonText = "Thêm vào giỏ",
  showToast,
}) => {
  // Nếu có giá khuyến mãi thì lấy giá khuyến mãi làm giá bán chính, giá gốc làm gạch ngang
  const hasPromo = promoPrice && promoPrice > 0;
  const finalPrice = hasPromo ? promoPrice : price;

  return (
    <div className="border border-gray-200 p-4 w-full max-w-[250px] mx-auto rounded-xl bg-white shadow-sm hover:shadow-md transition-shadow flex flex-col">
      {/* Click vào hình ảnh chuyển hướng về trang chi tiết */}
      <Link
        to={`/product/${id}`}
        className="hover:opacity-90 transition-opacity mb-4 block"
      >
        <img
          className="w-full h-auto object-cover rounded-md aspect-square"
          src={src}
          alt={title}
        />
      </Link>

      {/* Click vào tên sản phẩm chuyển hướng về trang chi tiết */}
      <Link
        to={`/product/${id}`}
        className="hover:text-primary transition-colors block mb-1"
      >
        <h3 className="text-lg font-semibold text-gray-800 truncate">
          {title}
        </h3>
      </Link>

      {/* Logic hiển thị hai dòng giá như hình của GearVN */}
      <div className="mb-2 h-12 flex flex-col justify-end">
        {hasPromo ? (
          <>
            <span className="text-sm text-gray-400 line-through">
              {price.toLocaleString("vi-VN")}₫
            </span>
            <span className="text-primary font-bold text-lg">
              {promoPrice.toLocaleString("vi-VN")}₫
            </span>
          </>
        ) : (
          <span className="text-primary font-bold text-lg">
            {price.toLocaleString("vi-VN")}₫
          </span>
        )}
      </div>

      {quantity > 0 && (
        <p className="text-sm text-gray-600 mb-3 font-medium">
          Số lượng trong giỏ: {quantity}
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
              if (showToast)
                showToast("Đã xóa sản phẩm khỏi giỏ hàng", "success");
            } else if (onAddToCart) {
              // Khi thêm vào giỏ hàng, ta dùng finalPrice để tính tiền chính xác (nếu đang giảm giá)
              onAddToCart({ id, src, title, price: finalPrice });
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
