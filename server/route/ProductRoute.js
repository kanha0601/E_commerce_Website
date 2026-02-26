const express = require("express");
const { AddProduct, GetProduct, updateProduct, Deleteproduct } = require("../controller/Productcontroller");
const upload = require("../middleware/multerMiddleware");

const router = express.Router();

router.post("/add", upload.single("image"), AddProduct);
router.get("/get", GetProduct);
router.put("/edit/:id", upload.single("image"), updateProduct);
router.delete("/delete/:id", Deleteproduct);

module.exports = router;
