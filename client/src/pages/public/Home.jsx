import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const Home = () => {
  const { user } = useAuth();

  return (
    <div className="bg-gray-50 min-h-screen">

      {/* Hero Section */}
      <div className="bg-gradient-to-r from-orange-500 to-pink-500 text-white">
        <div className="max-w-7xl mx-auto px-6 py-24 text-center">

          <h1 className="text-5xl md:text-6xl font-extrabold mb-6">
            Shop Smart. Live Better. 🛒
          </h1>

          <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
            Discover amazing products at unbeatable prices. Fast delivery.
            Trusted quality.
          </p>

          <div className="space-x-4">

            <Link
              to="/products"
              className="bg-white text-orange-600 px-8 py-3 rounded-full font-semibold text-lg hover:bg-gray-100 transition"
            >
              Shop Now
            </Link>

            {user ? (
              <Link
                to="/profile"
                className="border border-white px-8 py-3 rounded-full font-semibold text-lg hover:bg-white hover:text-orange-600 transition"
              >
                My Account
              </Link>
            ) : (
              <Link
                to="/login"
                className="border border-white px-8 py-3 rounded-full font-semibold text-lg hover:bg-white hover:text-orange-600 transition"
              >
                Login
              </Link>
            )}

          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-6 py-20">

        <h2 className="text-4xl font-bold text-center mb-12 text-gray-800">
          Why Choose Us?
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">

          <div className="bg-white p-8 rounded-xl shadow hover:shadow-lg transition">
            <h3 className="text-xl font-bold mb-3">🚚 Fast Delivery</h3>
            <p className="text-gray-600">
              Get your products delivered quickly and safely.
            </p>
          </div>

          <div className="bg-white p-8 rounded-xl shadow hover:shadow-lg transition">
            <h3 className="text-xl font-bold mb-3">💳 Secure Payment</h3>
            <p className="text-gray-600">
              100% safe and secure online transactions.
            </p>
          </div>

          <div className="bg-white p-8 rounded-xl shadow hover:shadow-lg transition">
            <h3 className="text-xl font-bold mb-3">⭐ Best Quality</h3>
            <p className="text-gray-600">
              Only top-quality products from trusted sellers.
            </p>
          </div>

        </div>
      </div>

      {/* Call To Action */}
      <div className="bg-gray-900 text-white py-20 text-center">

        <h2 className="text-4xl font-bold mb-4">
          Ready to Start Shopping?
        </h2>

        <p className="text-lg mb-8 text-gray-300">
          Join thousands of happy customers today.
        </p>

        <Link
          to="/products"
          className="bg-orange-500 px-10 py-3 rounded-full text-lg font-semibold hover:bg-orange-600 transition"
        >
          Explore Products
        </Link>

      </div>

    </div>
  );
};

export default Home;