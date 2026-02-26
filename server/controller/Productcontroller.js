const { get } = require("mongoose");
const product = require("../model/Product")
const cloudinary = require("../config/cloudinary");


const AddProduct = async (req, res) => {
    try {
        if (!req.file) {
            return res.json({ status: false, message: "Image required" });
        }

        const uploadToCloudinary = () => {
            return new Promise((resolve, reject) => {
                cloudinary.uploader.upload_stream(
                    { folder: "products" },
                    (error, result) => {
                        if (error) reject(error);
                        else resolve(result);
                    }
                ).end(req.file.buffer);
            });
        };

        const result = await uploadToCloudinary();

        const newProduct = await product.create({
            name: req.body.name,
            price: req.body.price,
            description: req.body.description,
            image: result.secure_url,
        });

        return res.json({
            status: true,
            message: "Product created",
            product: newProduct,
        });

    } catch (err) {
        console.log(err);
        return res.json({ status: false, message: "Upload failed" });
    }
};


const GetProduct = async (req, res) => {
    try {

        const products = await product.find()

        return res.json({
            message: "lets get contacts",
            product: products,
            status: true
        });
    } catch (err) {
        console.log(err);

        return res.json({

            message: "error while fetch",
            status: false
        });
    }
};
const updateProduct = async (req, res) => {
    try {
        let updateData = {
            name: req.body.name,
            price: req.body.price,
            description: req.body.description,
        };

        if (req.file) {
            const uploadToCloudinary = () => {
                return new Promise((resolve, reject) => {
                    cloudinary.uploader.upload_stream(
                        { folder: "products" },
                        (error, result) => {
                            if (error) reject(error);
                            else resolve(result);
                        }
                    ).end(req.file.buffer);
                });
            };

            const result = await uploadToCloudinary();
            updateData.image = result.secure_url;
        }

        const updated = await product.findByIdAndUpdate(
            req.params.id,
            updateData,
            { new: true }
        );

        return res.json({
            status: true,
            message: "Product updated",
            updateProduct: updated,
        });

    } catch (err) {
        console.log(err);
        return res.json({ status: false });
    }
};

const Deleteproduct = async (req, res) => {
    try {
        const Deleteproduct = await product.findByIdAndDelete(req.params.id)


        return res.json({
            message: "delte successfully",
            // id:req.params.id
            status: true,
            Deleteproduct
        });
    } catch (err) {
        console.log(err);


        return res.json({

            message: "error while update",
            status: false
        });
    }
};


module.exports = {
    AddProduct,
    GetProduct,
    updateProduct,
    Deleteproduct
};