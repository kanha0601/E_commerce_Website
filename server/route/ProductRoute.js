const express = require("express");
const { AddProduct, GetProduct, GetSingleProduct, AddReview, ToggleWishlist, updateProduct, Deleteproduct } = require("../controller/Productcontroller");
const upload = require("../middleware/multerMiddleware");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();
console.log("✅ ProductRoute loaded");


router.post("/add", upload.array("images", 5), AddProduct);
router.get("/get", GetProduct);
router.get("/get/:id", GetSingleProduct);
router.put("/edit/:id", upload.array("images", 5), updateProduct);
router.delete("/delete/:id", Deleteproduct);

// ✅ Reviews & Wishlist (protected)
router.post("/:id/review", protect, AddReview);
router.post("/:id/wishlist", protect, ToggleWishlist);

module.exports = router;