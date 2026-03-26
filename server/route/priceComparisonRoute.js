const express = require("express");
const { getComparison, updateComparison, getAllComparisons } = require("../controller/PriceComparisonController");
const { protect, adminOnly } = require("../middleware/authMiddleware");

const router = express.Router();

// Specific routes MUST come before /:productId
router.post("/update",     protect, adminOnly, updateComparison);
router.get("/admin/all",   protect, adminOnly, getAllComparisons);

// Wildcard param route LAST
router.get("/:productId",  getComparison);

module.exports = router;