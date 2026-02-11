const product= require("../model/Product")

const AddProduct = async (req, res) => {
  try {
const contact = await product.create(req.body);

    return res.json({
      message: "lets create product",
      fromFrontend:req.body,
      contact:product,
      status:true,
    });
  } catch (err) {
    return res.json({
      message: "Error while create product",
      status: false,
    });
  }
};

module.exports = {
 AddProduct
};