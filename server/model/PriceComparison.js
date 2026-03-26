const mongoose = require("mongoose");

const priceComparisonSchema = new mongoose.Schema(
  {
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
      unique: true,
    },
    amazon: {
      price: { type: Number, default: null },
      url:   { type: String, default: "" },
      updatedAt: { type: Date, default: null },
    },
    flipkart: {
      price: { type: Number, default: null },
      url:   { type: String, default: "" },
      updatedAt: { type: Date, default: null },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("PriceComparison", priceComparisonSchema);