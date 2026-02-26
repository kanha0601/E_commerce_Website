import React from "react";

function ViewProductModal({ viewData, setViewData }) {
    if (!viewData) return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-xl w-96 relative">

                <h3 className="text-xl font-bold mb-3">{viewData.name}</h3>

                <img
                    src={viewData.image}
                    alt={viewData.name}
                    className="w-full h-40 object-cover rounded-md mb-3"
                />

                <p className="mb-2">
                    <span className="font-semibold">Price:</span> ₹ {viewData.price}
                </p>

                <p className="mb-4">
                    <span className="font-semibold">Description:</span>{" "}
                    {viewData.description}
                </p>

                <button
                    onClick={() => setViewData(null)}
                    className="bg-red-500 text-white px-4 py-2 rounded w-full"
                >
                    Close
                </button>

            </div>
        </div>
    );
}

export default ViewProductModal;
