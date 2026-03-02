const express = require("express");
const router = express.Router();
const {
  createOrder,
  getMyOrders,
  getAllOrders,
  updateOrderStatus,
} = require("../controller/orderController");
const { protect, adminOnly } = require("../middleware/authMiddleware");

// ── USER ROUTES ──
router.post("/create", protect, createOrder);
router.get("/my-orders", protect, getMyOrders);

// ── ADMIN ROUTES ──
router.get("/get", protect, adminOnly, getAllOrders);
router.put("/status/:id", protect, adminOnly, updateOrderStatus);

module.exports = router;