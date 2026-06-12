import { useState, useEffect } from "react";
import Product from "../components/Product/Product.jsx";
import { Search } from "lucide-react";

export default function Home({ onAddToCart, showToast }) {
  const [products, setProducts] = useState([]);

  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  useEffect(() => {
    fetch("http://localhost:5000/api/products")
      .then((res) => res.json())
      .then((data) => {
        // Tạm thời bồi thêm dữ liệu PromoPrice và Description giả lập vào để test UI trang chi tiết
        const enrichedData = data.map((prod, index) => ({
          ...prod,
          PromoPrice: index % 2 === 0 ? Math.round(prod.Price * 0.85) : null, // Giảm 15% cho các sản phẩm chẵn
          Description:
            prod.Description ||
            `Đây là dòng sản phẩm ${prod.Title} hiệu năng cao cao cấp, trang bị các linh kiện thế hệ mới tối ưu cho nhu cầu làm việc đồ họa nặng và chiến game AAA mượt mà.`,
        }));
        setProducts(enrichedData);
      })
      .catch((err) => console.error("Lỗi khi lấy dữ liệu:", err));
  }, []);

  const handleFilterChange = (setter, value) => {
    setter(value);
    setCurrentPage(1);
  };

  let processedProducts = products.filter((prod) => {
    const matchSearch = prod.Title.toLowerCase().includes(
      searchTerm.toLowerCase(),
    );
    const price = prod.Price;
    const matchMin = minPrice === "" || price >= Number(minPrice);
    const matchMax = maxPrice === "" || price <= Number(maxPrice);
    return matchSearch && matchMin && matchMax;
  });

  if (sortOrder === "asc") {
    processedProducts.sort((a, b) => a.Price - b.Price);
  } else if (sortOrder === "desc") {
    processedProducts.sort((a, b) => b.Price - a.Price);
  }

  const totalPages = Math.ceil(processedProducts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentProducts = processedProducts.slice(
    startIndex,
    startIndex + itemsPerPage,
  );

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      <section className="bg-[url('https://cdn.hstatic.net/products/200000722513/web__61_of_86__aea66174cf754130b266656c48778519_grande.jpg')] bg-no-repeat bg-center bg-cover p-12 text-white text-center max-w-[600px] mx-auto mt-4 rounded-2xl shadow-lg">
        <h2 className="text-3xl font-bold mb-2">Welcome to our store</h2>
        <p className="text-lg">Best products with best prices</p>
      </section>

      <section className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 my-8 flex flex-col lg:flex-row gap-4 items-center justify-between mx-4">
        <div className="relative w-full lg:w-1/3">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Tìm kiếm sản phẩm..."
            value={searchTerm}
            onChange={(e) => handleFilterChange(setSearchTerm, e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition"
          />
        </div>

        <div className="flex items-center gap-2 w-full lg:w-auto">
          <input
            type="number"
            placeholder="Giá từ (VNĐ)..."
            value={minPrice}
            onChange={(e) => handleFilterChange(setMinPrice, e.target.value)}
            className="w-full lg:w-32 px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary outline-none"
          />
          <span className="text-gray-500 font-medium">-</span>
          <input
            type="number"
            placeholder="Đến (VNĐ)..."
            value={maxPrice}
            onChange={(e) => handleFilterChange(setMaxPrice, e.target.value)}
            className="w-full lg:w-32 px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary outline-none"
          />
        </div>

        <div className="w-full lg:w-auto">
          <select
            value={sortOrder}
            onChange={(e) => handleFilterChange(setSortOrder, e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary outline-none bg-white text-gray-700 cursor-pointer"
          >
            <option value="">Sắp xếp mặc định</option>
            <option value="asc">Giá: Thấp đến Cao</option>
            <option value="desc">Giá: Cao đến Thấp</option>
          </select>
        </div>
      </section>

      {products.length === 0 ? (
        <p className="text-center mt-10 text-gray-500 font-medium">
          Đang tải sản phẩm...
        </p>
      ) : currentProducts.length === 0 ? (
        <p className="text-center mt-10 text-gray-500 text-lg">
          Không tìm thấy sản phẩm nào phù hợp!
        </p>
      ) : (
        <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4 justify-center">
          {currentProducts.map((prod) => (
            <Product
              key={prod.Id}
              id={prod.Id}
              src={prod.ImageUrl}
              title={prod.Title}
              price={prod.Price}
              promoPrice={prod.PromoPrice} // Truyền giá khuyến mại xuống card
              onAddToCart={onAddToCart}
              showToast={showToast}
            />
          ))}
        </section>
      )}

      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 my-10">
          <button
            disabled={currentPage === 1}
            onClick={() => handlePageChange(currentPage - 1)}
            className="px-4 py-2 rounded-lg font-medium transition disabled:opacity-50 disabled:cursor-not-allowed bg-gray-200 hover:bg-gray-300 text-gray-700"
          >
            Trước
          </button>

          {[...Array(totalPages)].map((_, index) => {
            const pageNum = index + 1;
            return (
              <button
                key={pageNum}
                onClick={() => handlePageChange(pageNum)}
                className={`w-10 h-10 rounded-lg font-bold transition-colors ${
                  currentPage === pageNum
                    ? "bg-primary text-white shadow-md"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {pageNum}
              </button>
            );
          })}

          <button
            disabled={currentPage === totalPages}
            onClick={() => handlePageChange(currentPage + 1)}
            className="px-4 py-2 rounded-lg font-medium transition disabled:opacity-50 disabled:cursor-not-allowed bg-gray-200 hover:bg-gray-300 text-gray-700"
          >
            Sau
          </button>
        </div>
      )}
    </>
  );
}
