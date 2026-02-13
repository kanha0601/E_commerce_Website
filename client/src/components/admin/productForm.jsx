import React, { useState } from "react";
import axios from "axios";

export default function AddProduct({ fetchProduct,setShowForm }) {

  const [product, setProduct] = useState({
    name: "",
    price: "",
    description: "",
    image: ""
  });

  const handleChange = (e) => {
    setProduct({
      ...product,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(
        "http://localhost:8080/api/product/add",
        product
      );

      alert(res.data.message);
      fetchProduct()
      setShowForm(false)
    } catch (error) {
      console.log(error);
      alert("Error adding product");
    }
  };

  return (
    <div className="p-5">
      <h2 className="text-xl font-bold mb-4">Add New Product</h2>

      <form onSubmit={handleSubmit} className="flex flex-col gap-3">

        <input
          type="text"
          name="name"
          placeholder="Product Name"
          onChange={handleChange}
          required
          className="border p-2"
        />

        <input
          type="number"
          name="price"
          placeholder="Product Price"
          onChange={handleChange}
          required
          className="border p-2"
        />

        <textarea
          name="description"
          placeholder="Description"
          onChange={handleChange}
          className="border p-2"
        />

        <input
          type="text"
          name="image"
          placeholder="Image URL"
          onChange={handleChange}
          className="border p-2"
        />

        <button
          type="submit"
          className="bg-yellow-500 text-white p-2"
        >
          Add Product
        </button>

      </form>
    </div>
  );
}
