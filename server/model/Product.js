const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
    },
   
  },
  { timestamps: true },
);

module.exports = mongoose.model("product", productSchema);