import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Product from "../components/Product/Product.jsx";

function CategoryPage({ onAddToCart, showToast }) {
  const { categorySlug } = useParams();
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetch(`http://localhost:5000/api/products?category=${categorySlug}`)
      .then((res) => res.json())
      .then((data) => setProducts(data))
      .catch((err) => console.error("Lỗi khi lấy dữ liệu:", err));
  }, [categorySlug]);

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h2 className="text-center capitalize text-primary text-3xl font-bold mb-8">
        Danh mục: {categorySlug}
      </h2>

      {products.length === 0 ? (
        <p className="text-center text-gray-500 text-lg">
          Không có sản phẩm nào trong danh mục này.
        </p>
      ) : (
        <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 justify-center">
          {products.map((prod) => (
            <Product
              key={prod.Id}
              id={prod.Id}
              src={prod.ImageUrl}
              title={prod.Title}
              price={prod.Price}
              onAddToCart={onAddToCart}
              showToast={showToast}
            />
          ))}
        </section>
      )}
    </div>
  );
}

export default CategoryPage;
