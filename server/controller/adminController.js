const User = require("../model/User");
const Order = require("../model/Order");

// 🔹 Get all users
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json({ success: true, users });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 🔹 Get orders of a specific user
exports.getUserOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.params.id })
      .populate("products.product", "name price")
      .sort({ createdAt: -1 });

    res.json({ success: true, orders });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
