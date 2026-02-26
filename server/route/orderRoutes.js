const express = require("express");
const router = express.Router();
const { createOrder, getMyOrders } = require("../controller/orderController");
const { protect } = require("../middleware/authMiddleware");

router.post("/create", protect, createOrder);
router.get("/my-orders", protect, getMyOrders);

module.exports = router;
