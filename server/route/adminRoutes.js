const express = require("express");
const router = express.Router();
const { protect, adminOnly } = require("../middleware/authMiddleware");
const { getAllUsers, getUserOrders } = require("../controller/adminController");

router.get("/users", protect, adminOnly, getAllUsers);
router.get("/users/:id/orders", protect, adminOnly, getUserOrders);

module.exports = router;
