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
      type: String
    },
     description: {
      type: String
    }
  },
  { timestamps: true },
);

module.exports = mongoose.model("product", productSchema);