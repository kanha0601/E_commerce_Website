const express = require("express");
const { AddProduct } = require("../controller/Productcontroller");
const router = express.Router();

router.post("/add", AddProduct);
// router.get("/get", GetContact);
// router.put("/edit/:id", updateContact);
// router.delete("/delete/:id", DeleteContact);

module.exports = router;