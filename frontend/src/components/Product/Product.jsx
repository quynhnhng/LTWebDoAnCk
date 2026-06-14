import { Link } from "react-router-dom";

const Product = ({
  id,
  src,
  title,
  price,
  promoPrice,
  onAddToCart,
  onRemove,
  quantity,
  buttonText = "Thêm vào giỏ",
  showToast,
  onOpenLogin,
}) => {
  const hasPromo = promoPrice && promoPrice > 0;
  const finalPrice = hasPromo ? promoPrice : price;

  const handleCartClick = () => {
    if (onRemove) {
      onRemove(id);
      if (showToast) showToast("Đã xóa sản phẩm khỏi giỏ hàng", "success");
      return;
    }

    // Kiểm tra đăng nhập
    const user = (() => {
      try {
        return JSON.parse(localStorage.getItem("pcshop_user"));
      } catch {
        return null;
      }
    })();

    if (!user) {
      if (showToast)
        showToast("Vui lòng đăng nhập để thêm vào giỏ hàng!", "error");
      if (onOpenLogin) onOpenLogin();
      return;
    }

    if (onAddToCart) {
      onAddToCart({ id, src, title, price: finalPrice });
      if (showToast)
        showToast("Đã thêm sản phẩm vào giỏ hàng thành công!", "success");
    }
  };

  return (
    <div className="border border-gray-200 p-4 w-full max-w-[250px] mx-auto rounded-xl bg-white shadow-sm hover:shadow-md transition-shadow flex flex-col">
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

      <Link
        to={`/product/${id}`}
        className="hover:text-primary transition-colors block mb-1"
      >
        <h3 className="text-lg font-semibold text-gray-800 truncate">
          {title}
        </h3>
      </Link>

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
          onClick={handleCartClick}
        >
          {buttonText}
        </button>
      </div>
    </div>
  );
};

export default Product;
