import React, { useEffect, useState } from "react";
import axios from "axios";
import { Trash2, Pencil, Eye } from "lucide-react";
import ProductForm from "../../components/admin/productForm";
import ViewProductModal from "../../components/admin/ViewProductModal";

function AdminProduct() {
    const url = import.meta.env.VITE_BACKEND_URL;

    const [product, setProduct] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [editData, setEditData] = useState(null);
    const [viewData, setViewData] = useState(null);

    const fetchProduct = async () => {
        try {
            const res = await axios.get(`${url}/product/get`);
            console.log(res?.data?.product)
            if (res.data.status) {
                setProduct(res.data.product);
            }
        } catch (err) {
            console.log(err);
        }
    };

    useEffect(() => {
        fetchProduct();
    }, []);

    // DELETE
    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete?")) return;

        try {
            const res = await axios.delete(`${url}/product/delete/${id}`);
            alert(res.data.message);
            fetchProduct();
        } catch (err) {
            console.log(err);
        }
    };

    return (
        <div className="p-8 bg-slate-100 min-h-screen">
            <div className="max-w-6xl mx-auto bg-white p-6 rounded-2xl shadow-xl">

                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-3xl font-bold">Product Management</h2>
                    <button
                        onClick={() => {
                            setEditData(null);
                            setShowForm(true);
                        }}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg"
                    >
                        Add Product
                    </button>
                </div>

                {showForm && (
                    <ProductForm
                        fetchProduct={fetchProduct}
                        setShowForm={setShowForm}
                        editData={editData}
                        url={url}
                    />
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {product?.map((ele) => (
                        <div
                            key={ele._id}
                            className="bg-white rounded-xl shadow-md hover:shadow-xl transition p-4 flex flex-col"
                        >
                            <img
                                src={ele.image}
                                alt={ele.name}
                                className="h-40 w-full object-cover rounded-lg mb-3"
                            />

                            <h3 className="text-lg font-semibold mb-1">{ele.name}</h3>

                            <p className="text-blue-600 font-bold mb-2">₹ {ele.price}</p>

                            <p className="text-gray-600 text-sm line-clamp-2 mb-4">
                                {ele.description}
                            </p>

                            <div className="flex justify-between mt-auto">
                                <Eye
                                    className="cursor-pointer text-green-600 hover:scale-110 transition"
                                    onClick={() => setViewData(ele)}
                                />

                                <Pencil
                                    className="cursor-pointer text-blue-600 hover:scale-110 transition"
                                    onClick={() => {
                                        setEditData(ele);
                                        setShowForm(true);
                                    }}
                                />

                                <Trash2
                                    className="cursor-pointer text-red-600 hover:scale-110 transition"
                                    onClick={() => handleDelete(ele._id)}
                                />
                            </div>
                        </div>
                    ))}
                </div>


                {/* VIEW MODAL */}
                {viewData && (
                    <ViewProductModal
                        viewData={viewData}
                        setViewData={setViewData}
                    />
                )}
            </div>
        </div>
    );
}

export default AdminProduct;
