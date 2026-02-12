const { get } = require("mongoose");
const product= require("../model/Product")

const AddProduct = async (req, res) => {
  try {
const newProduct = await product.create(req.body);

    return res.json({
      message: " product is created",
      fromFrontend:req.body,
      product:newProduct,
      status:true,
    });
  } catch (err) {
    return res.json({
      message: "Error while create product",
      status: false,
    });
  }
};

const GetProduct=async(req,res)=>{
    try {

     const products=await product.find()
        
        return res.json({
            message:"lets get contacts",
            product:products,
            status:true
        });
    } catch (err) {
     console.log(err);

        return res.json({

            message:"error while fetch",
            status :false
        });
    }
};
const updateProduct=async(req,res)=>{
    try {
         const updateProduct =await product.findByIdAndUpdate(req.params.id,req.body ,{new:true})

        
        return res.json({
            message:"lets update",
            // id:req.params.id
            status:true,
            updateProduct
        });
    } catch (err) {
    console.log(err);
    

        return res.json({

            message:"error while update",
            status :false
        });
    }
};

const Deleteproduct=async(req,res)=>{
    try {
         const Deleteproduct =await product.findByIdAndDelete(req.params.id)

        
        return res.json({
            message:"delte successfully",
            // id:req.params.id
            status:true,
            Deleteproduct
        });
    } catch (err) {
    console.log(err);
    

        return res.json({

            message:"error while update",
            status :false
        });
    }
};


module.exports = {
 AddProduct,
 GetProduct,
 updateProduct,
 Deleteproduct
};