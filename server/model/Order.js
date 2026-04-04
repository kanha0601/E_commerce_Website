const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
{
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },

    products: [
        {
            product: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Product",
                required: true,
            },
            quantity: {
                type: Number,
                required: true,
            },
            price: {
                type: Number,
                required: true,
            },
        },
    ],

    // ✅ NEW: Address (ADDED safely)
    shippingAddress: {
        fullName: { type: String, required: true },
        phone: { type: String, required: true },
        address: { type: String, required: true },
        city: { type: String, required: true },
        state: { type: String, required: true },
        pincode: { type: String, required: true },
    },

    // ✅ NEW: Payment
    paymentMethod: {
        type: String,
        enum: ["cod", "online"],
        required: true,
    },

    paymentStatus: {
        type: String,
        enum: ["pending", "completed"],
        default: "pending",
    },

    totalAmount: {
        type: Number,
        required: true,
    },

    status: {
        type: String,
        enum: ["pending", "paid", "shipped", "delivered", "cancelled"],
        default: "pending",
    },
},
{ timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);