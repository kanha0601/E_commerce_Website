const express = require("express");
const router = express.Router();
const { protect, adminOnly } = require("../middleware/authMiddleware");
const { getAllUsers, getUserOrders } = require("../controller/adminController");

router.get("/users", getAllUsers);
router.get("/users/:id/orders", getUserOrders);

module.exports = router;
