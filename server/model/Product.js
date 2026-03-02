const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
    },
    price: {
      type: Number,
    },
    image: {
      type: String,
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