const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
    },
    price: {
      type: Number,
    },
    // ✅ FIXED: simple string URL so frontend can use item.image directly
    image: {
      type: String,
      default: "",
    },
    description: {
      type: String,
    },
    category: {
      type: String,
      enum: ["electronics", "clothing", "footwear", "accessories", "home"],
      default: "electronics",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", productSchema);