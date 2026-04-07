const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    name: { type: String, required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, required: true },
}, { timestamps: true });

const productSchema = new mongoose.Schema(
  {
    name: { type: String },
    price: { type: Number },
    image: { type: String, default: "" },
    images: [{ type: String }],
    description: { type: String },
    category: {
      type: String,
      enum: ["electronics", "clothing", "footwear", "accessories", "home"],
      default: "electronics",
    },
    reviews: [reviewSchema],
    wishlist: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    rating: { type: Number, default: 0 },
    numReviews: { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", productSchema);