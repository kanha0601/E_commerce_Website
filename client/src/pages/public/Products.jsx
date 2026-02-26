import { useState, useEffect } from "react";
import axios from "axios";
import { useCart } from "../../context/CartContext";
import api from "../../services/api";

const Products = () => {
  const [products, setProducts] = useState([]);
  const { addToCart } = useCart();


  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await api.get(`/product/get`);
        if (res.data.status) {
          setProducts(res.data.product);
        }
      } catch (err) {
        console.log(err);
      }
    };

    fetchProducts();
  }, []);

  return (
    <div className="bg-gray-50 min-h-screen py-10 px-5">
      <h1 className="text-4xl font-bold text-center mb-10">
        Our Products 🛍️
      </h1>

      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {products.map((product) => (
          <div
            key={product._id}
            className="bg-white rounded-xl shadow hover:shadow-lg transition p-5 flex flex-col"
          >
            {/* PRODUCT IMAGE */}
            <img
              src={product.image}
              alt={product.name}
              className="h-40 w-full object-cover rounded-lg mb-4"
            />

            {/* PRODUCT NAME */}
            <h3 className="text-xl font-semibold mb-1">
              {product.name}
            </h3>

            {/* PRICE */}
            <p className="text-orange-600 font-bold mb-2">
              ₹{product.price}
            </p>

            {/* DESCRIPTION */}
            <p className="text-gray-600 text-sm mb-4 line-clamp-2">
              {product.description}
            </p>

            {/* ADD TO CART */}
            <button
              onClick={() => addToCart(product)}
              className="mt-auto bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600 transition"
            >
              Add to Cart
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Products;
