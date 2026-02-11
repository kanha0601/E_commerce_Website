import { useState } from "react";

const Products = () => {
  // Sample products (for now – later from database)
  const [products] = useState([
    {
      id: 1,
      name: "Smart Phone",
      price: 20000,
      image: "",
    },
    {
      id: 2,
      name: "Laptop",
      price: 50000,
      image: "",
    },
    {
      id: 3,
      name: "Headphones",
      price: 2000,
      image: "",
    },
    {
      id: 4,
      name: "Smart Watch",
      price: 3500,
      image: "",
    },
    {
        id: 5,
        name: "Bluetooth Speaker",
        price: 2500,
        image: "",
      },
      {
        id: 6,
        name: "Keyboard",
        price: 1200,
        image: "",
      },
      {
        id: 7,
        name: "Mouse",
        price: 800,
        image: "",
      },
      {
        id: 8,
        name: "Power Bank",
        price: 1800,
        image: "",
      },
      {
        id: 9,
        name: "Tablet",
        price: 22000,
        image: "",
      },
      {
        id: 10,
        name: "Camera",
        price: 32000,
        image: "",
      },
    ]);

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
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-40 object-cover mb-4 rounded"
            />

            <h3 className="text-xl font-semibold mb-2">
              {product.name}
            </h3>

            <p className="text-orange-600 font-bold mb-3">
              ₹{product.price}
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