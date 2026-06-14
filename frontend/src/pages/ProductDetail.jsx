import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { ShoppingCart, ArrowLeft, Minus, Plus } from "lucide-react";

export default function ProductDetail({ onAddToCart, showToast, onOpenLogin }) {
  const { productId } = useParams();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);

  const [prevId, setPrevId] = useState(productId);
  if (productId !== prevId) {
    setPrevId(productId);
    setLoading(true);
    setProduct(null);
    setQuantity(1);
  }

  useEffect(() => {
    fetch("http://localhost:5000/api/products")
      .then((res) => res.json())
      .then((data) => {
        const foundProduct = data.find(
          (item) => String(item.Id) === String(productId),
        );
        if (foundProduct) setProduct(foundProduct);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Lỗi lấy chi tiết sản phẩm:", err);
        setLoading(false);
      });
  }, [productId]);

  if (loading)
    return (
      <p className="text-center mt-20 text-gray-500 font-medium">
        Đang tải chi tiết sản phẩm...
      </p>
    );
  if (!product)
    return (
      <div className="text-center mt-20">
        <p className="text-gray-500 text-lg mb-4">
          Không tìm thấy sản phẩm yêu cầu!
        </p>
        <Link
          to="/"
          className="text-primary hover:underline font-bold inline-flex items-center gap-2"
        >
          <ArrowLeft className="w-5 h-5" /> Quay lại trang chủ
        </Link>
      </div>
    );

  const hasPromo = product.PromoPrice && product.PromoPrice > 0;
  const finalPrice = hasPromo ? product.PromoPrice : product.Price;
  const discountPercent = hasPromo
    ? Math.round((1 - product.PromoPrice / product.Price) * 100)
    : 0;

  const handleIncrease = () => setQuantity((prev) => prev + 1);
  const handleDecrease = () => setQuantity((prev) => (prev > 1 ? prev - 1 : 1));

  const handleAddClick = () => {
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
      onAddToCart(
        {
          id: product.Id,
          src: product.ImageUrl,
          title: product.Title,
          price: finalPrice,
        },
        quantity,
      );
      if (showToast)
        showToast(
          `Đã thêm thành công ${quantity} sản phẩm vào giỏ hàng!`,
          "success",
        );
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-8 animate-fade-in">
      <Link
        to="/"
        className="inline-flex items-center gap-2 text-gray-600 hover:text-primary transition-colors font-medium mb-6"
      >
        <ArrowLeft className="w-5 h-5" /> Quay lại danh sách
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-white p-6 md:p-10 rounded-2xl shadow-sm border border-gray-100">
        {/* Ảnh */}
        <div className="flex items-center justify-center bg-gray-50 rounded-xl p-4 border border-gray-100 h-[350px] md:h-[450px]">
          <img
            src={product.ImageUrl}
            alt={product.Title}
            className="max-w-full max-h-full object-contain rounded-lg shadow-sm"
          />
        </div>

        {/* Thông tin */}
        <div className="flex flex-col justify-between">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800 leading-tight mb-4">
              {product.Title}
            </h2>

            <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 mb-6 flex flex-col gap-1">
              {hasPromo ? (
                <>
                  <div className="flex items-center gap-3">
                    <span className="text-gray-400 line-through text-base md:text-lg">
                      {product.Price.toLocaleString("vi-VN")}₫
                    </span>
                    <span className="bg-red-100 text-primary text-xs font-bold px-2 py-0.5 rounded">
                      Tiết kiệm {discountPercent}%
                    </span>
                  </div>
                  <span className="text-primary font-extrabold text-3xl">
                    {product.PromoPrice.toLocaleString("vi-VN")}₫
                  </span>
                </>
              ) : (
                <span className="text-primary font-extrabold text-3xl">
                  {product.Price.toLocaleString("vi-VN")}₫
                </span>
              )}
            </div>

            <div className="mb-6">
              <h4 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-2">
                Mô tả sản phẩm
              </h4>
              <p className="text-gray-600 leading-relaxed text-sm md:text-base">
                {product.Description}
              </p>
            </div>
          </div>

          <div className="space-y-4 pt-4 border-t border-gray-100">
            <div className="flex items-center gap-4">
              <span className="text-sm font-bold text-gray-700">
                Chọn số lượng:
              </span>
              <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden bg-white shadow-sm">
                <button
                  onClick={handleDecrease}
                  className="px-3 py-2 bg-gray-50 hover:bg-gray-200 transition-colors text-gray-600 focus:outline-none"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <input
                  type="text"
                  readOnly
                  value={quantity}
                  className="w-12 text-center font-bold text-gray-800 select-none outline-none text-sm"
                />
                <button
                  onClick={handleIncrease}
                  className="px-3 py-2 bg-gray-50 hover:bg-gray-200 transition-colors text-gray-600 focus:outline-none"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            <button
              onClick={handleAddClick}
              className="w-full bg-primary hover:bg-red-700 text-white font-bold py-4 rounded-xl shadow-lg shadow-red-100 transition-all flex items-center justify-center gap-3 text-lg group"
            >
              <ShoppingCart className="w-6 h-6 group-hover:scale-110 transition-transform" />
              THÊM VÀO GIỎ HÀNG
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
