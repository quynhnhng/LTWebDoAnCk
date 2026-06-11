import { useState, useEffect } from "react";
import Product from "../components/Product/Product.jsx";

export default function Home({ onAddToCart }) {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/api/products")
      .then((res) => res.json())
      .then((data) => setProducts(data))
      .catch((err) => console.error("Lỗi khi lấy dữ liệu:", err));
  }, []);

  return (
    <>
      <section className="bg-[url('https://cdn.hstatic.net/products/200000722513/web__61_of_86__aea66174cf754130b266656c48778519_grande.jpg')] bg-no-repeat bg-center bg-cover p-12 text-white text-center max-w-[600px] mx-auto mt-4 rounded-2xl shadow-lg">
        <h2 className="text-3xl font-bold mb-2">Welcome to our store</h2>
        <p className="text-lg">Best products with best prices</p>
      </section>

      {products.length === 0 ? (
        <p className="text-center mt-10 text-gray-500">Đang tải sản phẩm...</p>
      ) : (
        <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-6 justify-center">
          {products.map((prod) => (
            <Product
              key={prod.Id}
              id={prod.Id}
              src={prod.ImageUrl}
              title={prod.Title}
              price={prod.Price}
              onAddToCart={onAddToCart}
            />
          ))}
        </section>
      )}
    </>
  );
}
