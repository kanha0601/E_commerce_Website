import { useState, useEffect } from "react";
import axios from "axios";

const Products = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:8080/api/product/get")
      .then((res) => {
        console.log(res.data);
        setProducts(res.data.product); // must match backend key
      })
      .catch((err) => console.log(err));
  }, []);

  return (
    <div className="bg-gray-50 min-h-screen py-10 px-5">
      <h1 className="text-4xl font-bold text-center mb-10">
        Our Products 🛍️
      </h1>

      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">

        {products.map((product) => (
          <div
            key={product.id}
            className="bg-white rounded-xl shadow hover:shadow-lg transition p-5 text-center"
          >
            <h3 className="text-xl font-semibold mb-2">
              {product.name}
            </h3>

            <p className="text-orange-600 font-bold mb-3">
              ₹{product.price}
            </p>

            <p className="text-orange-600 font-bold mb-3">
              {product.description}
            </p>
            

            <button
              className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600 transition"
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
