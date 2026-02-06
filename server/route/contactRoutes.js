const express = require("express");
const { AddContact ,GetContact,updateContact,DeleteContact} = require("../controller/contactControler");
const router = express.Router();

router.post("/add", AddContact);
router.get("/get", GetContact);
router.put("/edit/:id", updateContact);
router.delete("/delete/:id", DeleteContact);

module.exports = router;