const Product         = require("../model/Product");
const PriceComparison = require("../model/PriceComparison");

const getComparison = async (req, res) => {
  try {
    const myProduct = await Product.findById(req.params.productId);
    if (!myProduct) {
      return res.json({ status: false, message: "Product not found" });
    }
    const comparison = await PriceComparison.findOne({ productId: req.params.productId });
    return res.json({
      status: true,
      data: {
        productName: myProduct.name,
        myPrice:     myProduct.price,
        amazon:      comparison?.amazon   || { price: null, url: "" },
        flipkart:    comparison?.flipkart || { price: null, url: "" },
        updatedAt:   comparison?.updatedAt || null,
      },
    });
  } catch (err) {
    console.log(err);
    return res.json({ status: false, message: "Error fetching comparison" });
  }
};

const updateComparison = async (req, res) => {
  try {
    const { productId, amazon, flipkart } = req.body;
    if (!productId) return res.json({ status: false, message: "productId is required" });
    const updated = await PriceComparison.findOneAndUpdate(
      { productId },
      {
        productId,
        amazon:   { ...(amazon   || {}), updatedAt: new Date() },
        flipkart: { ...(flipkart || {}), updatedAt: new Date() },
      },
      { upsert: true, new: true }
    );
    return res.json({ status: true, message: "Prices updated successfully", data: updated });
  } catch (err) {
    console.log(err);
    return res.json({ status: false, message: "Error updating prices" });
  }
};

const getAllComparisons = async (req, res) => {
  try {
    const list = await PriceComparison.find({}).populate("productId", "name price");
    return res.json({ status: true, data: list });
  } catch (err) {
    console.log(err);
    return res.json({ status: false, message: "Error fetching all comparisons" });
  }
};

module.exports = { getComparison, updateComparison, getAllComparisons };