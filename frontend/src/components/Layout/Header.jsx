import { Link } from "react-router-dom";

export default function Header({ cartItemCount }) {
  return (
    <header className="bg-primary text-white py-6 px-8 flex fixed top-0 left-0 w-full z-50 items-center shadow-md">
      <h1 className="text-3xl font-bold">PC Shop</h1>
      <h2 className="ml-24 text-lg font-semibold hidden md:block">
        Hotline: 123-456-7890
      </h2>
      <nav className="ml-auto flex gap-6 text-lg">
        <Link to="/about-us" className="hover:text-gray-200 transition">
          About Us
        </Link>
        <Link to="/cart" className="hover:text-gray-200 transition">
          Cart ({cartItemCount})
        </Link>
        <Link to="/" className="hover:text-gray-200 transition">
          Home
        </Link>
      </nav>
    </header>
  );
}
