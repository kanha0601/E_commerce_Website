import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { ShoppingCart } from "lucide-react";
import { useState } from "react";
import CartSidebar from "./CartSidebar";

const Navbar = () => {
  const { user, logout } = useAuth();
  const { cart } = useCart();
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* NAVBAR */}
      <nav className="bg-white shadow-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 h-16 flex justify-between items-center">
          <Link to="/" className="text-xl font-bold text-blue-600">
            GET READY
          </Link>

          <div className="flex items-center space-x-4">
            <Link to="/" className="text-gray-700 hover:text-blue-600">Home</Link>
            <Link to="/about" className="text-gray-700 hover:text-blue-600">About</Link>
            <Link to="/contact" className="text-gray-700 hover:text-blue-600">Contact</Link>
            <Link to="/product" className="text-gray-700 hover:text-blue-600">Product</Link>

            {/* CART ICON */}
            <button onClick={() => setOpen(true)} className="relative">
              <ShoppingCart className="w-6 h-6 text-gray-700 hover:text-blue-600" />
              {cart.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-2 rounded-full">
                  {cart.length}
                </span>
              )}
            </button>

            {user ? (
              <>
                <span className="text-gray-500">Hi, {user.name}</span>

                {/* ✅ ADD THIS */}
                <Link
                  to="/profile"
                  className="text-gray-700 hover:text-blue-600"
                >
                  Profile
                </Link>

                {user.role === "admin" && (
                  <Link to="/admin" className="text-blue-600 font-semibold">
                    Admin Panel
                  </Link>
                )}

                <button
                  onClick={logout}
                  className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-gray-700 hover:text-blue-600">
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* ✅ REUSED SIDEBAR COMPONENT */}
      <CartSidebar showCart={open} setShowCart={setOpen} />
    </>
  );
};

export default Navbar;
