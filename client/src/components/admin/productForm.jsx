import React, { useEffect, useState } from "react";
import axios from "axios";

export default function ProductForm({
  fetchProduct,
  setShowForm,
  editData,
  url,
}) {
  const [product, setProduct] = useState({
    name: "",
    price: "",
    description: "",
    image: "",
  });

  useEffect(() => {
    if (editData) {
      setProduct(editData);
    }
  }, [editData]);

  const handleChange = (e) => {
    setProduct({
      ...product,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("name", product.name);
    formData.append("price", product.price);
    formData.append("description", product.description);
    formData.append("image", product.image);

    try {
      if (editData) {
        await axios.put(`${url}/product/edit/${editData._id}`, formData);
        alert("Product updated");
      } else {
        await axios.post(`${url}/product/add`, formData);
        alert("Product added");
      }

      fetchProduct();
      setShowForm(false);
    } catch (err) {
      console.log(err);
      alert("Error");
    }
  };

  return (
    <div className="bg-slate-100 p-6 rounded-xl mb-6">
      <h3 className="text-xl font-bold mb-4">
        {editData ? "Edit Product" : "Add Product"}
      </h3>

      <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
        <input
          type="text"
          name="name"
          value={product.name}
          onChange={handleChange}
          placeholder="Product Name"
          required
          className="border p-2 rounded"
        />

        <input
          type="number"
          name="price"
          value={product.price}
          onChange={handleChange}
          placeholder="Price"
          required
          className="border p-2 rounded"
        />

        <textarea
          name="description"
          value={product.description}
          onChange={handleChange}
          placeholder="Description"
          className="border p-2 rounded col-span-2"
        />

        <input
          type="file"
          name="image"
          onChange={(e) =>
            setProduct({ ...product, image: e.target.files[0] })
          }
          className="border p-2 rounded col-span-2"
        />
        <button
          type="submit"
          className="bg-blue-600 text-white p-2 rounded col-span-2"
        >
          {editData ? "Update Product" : "Add Product"}
        </button>
      </form>
    </div>
  );
}
