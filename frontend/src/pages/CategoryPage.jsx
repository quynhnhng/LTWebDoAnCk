import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Product from "../components/Product/Product.jsx";
import { Search } from "lucide-react";

function CategoryPage({ onAddToCart, showToast, onOpenLogin }) {
  const { categorySlug } = useParams();
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  useEffect(() => {
    fetch(`http://localhost:5000/api/products?category=${categorySlug}`)
      .then((res) => res.json())
      .then((data) => {
        setProducts(data);
        setSearchTerm("");
        setSortOrder("");
        setMinPrice("");
        setMaxPrice("");
        setCurrentPage(1);
      })
      .catch((err) => console.error("Lỗi khi lấy dữ liệu:", err));
  }, [categorySlug]);

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

  if (sortOrder === "asc") processedProducts.sort((a, b) => a.Price - b.Price);
  else if (sortOrder === "desc")
    processedProducts.sort((a, b) => b.Price - a.Price);

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
    <div className="p-6 max-w-6xl mx-auto">
      <h2 className="text-center capitalize text-primary text-3xl font-bold mb-8">
        Danh mục: {categorySlug}
      </h2>

      {products.length > 0 && (
        <section className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-8 flex flex-col lg:flex-row gap-4 items-center justify-between">
          <div className="relative w-full lg:w-1/3">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Tìm trong danh mục này..."
              value={searchTerm}
              onChange={(e) =>
                handleFilterChange(setSearchTerm, e.target.value)
              }
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition"
            />
          </div>
          <div className="flex items-center gap-2 w-full lg:w-auto">
            <input
              type="number"
              placeholder="Giá từ..."
              value={minPrice}
              onChange={(e) => handleFilterChange(setMinPrice, e.target.value)}
              className="w-full lg:w-32 px-3 py-2 border border-gray-300 rounded-lg outline-none"
            />
            <span>-</span>
            <input
              type="number"
              placeholder="Đến..."
              value={maxPrice}
              onChange={(e) => handleFilterChange(setMaxPrice, e.target.value)}
              className="w-full lg:w-32 px-3 py-2 border border-gray-300 rounded-lg outline-none"
            />
          </div>
          <div className="w-full lg:w-auto">
            <select
              value={sortOrder}
              onChange={(e) => handleFilterChange(setSortOrder, e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none cursor-pointer"
            >
              <option value="">Sắp xếp mặc định</option>
              <option value="asc">Giá: Thấp đến Cao</option>
              <option value="desc">Giá: Cao đến Thấp</option>
            </select>
          </div>
        </section>
      )}

      {products.length === 0 ? (
        <p className="text-center text-gray-500 text-lg">Đang tải...</p>
      ) : currentProducts.length === 0 ? (
        <p className="text-center mt-10 text-gray-500 text-lg">
          Không có sản phẩm nào phù hợp tiêu chí lọc.
        </p>
      ) : (
        <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 justify-center">
          {currentProducts.map((prod) => (
            <Product
              key={prod.Id}
              id={prod.Id}
              src={prod.ImageUrl}
              title={prod.Title}
              price={prod.Price}
              promoPrice={prod.PromoPrice}
              onAddToCart={onAddToCart}
              showToast={showToast}
              onOpenLogin={onOpenLogin}
            />
          ))}
        </section>
      )}

      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 mt-12 mb-6">
          <button
            disabled={currentPage === 1}
            onClick={() => handlePageChange(currentPage - 1)}
            className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Trước
          </button>
          {[...Array(totalPages)].map((_, index) => (
            <button
              key={index + 1}
              onClick={() => handlePageChange(index + 1)}
              className={`w-10 h-10 rounded-lg font-bold ${currentPage === index + 1 ? "bg-primary text-white" : "bg-gray-100 hover:bg-gray-200"}`}
            >
              {index + 1}
            </button>
          ))}
          <button
            disabled={currentPage === totalPages}
            onClick={() => handlePageChange(currentPage + 1)}
            className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Sau
          </button>
        </div>
      )}
    </div>
  );
}

export default CategoryPage;
