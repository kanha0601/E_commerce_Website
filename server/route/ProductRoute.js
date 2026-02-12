const express = require("express");
const { AddProduct, GetProduct, updateProduct, Deleteproduct } = require("../controller/Productcontroller");
const router = express.Router();

router.post("/add", AddProduct);
router.get("/get", GetProduct);
router.put("/edit/:id", updateProduct);
router.delete("/delete/:id", Deleteproduct);

module.exports = router;