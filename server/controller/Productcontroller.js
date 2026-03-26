const product = require("../model/Product");
const cloudinary = require("../config/cloudinary");

const AddProduct = async (req, res) => {
    try {
        let imageUrl = "";

        // ✅ If image file is uploaded → upload to Cloudinary
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
            imageUrl = result.secure_url;
        }

        // ✅ If image URL is provided in body
        else if (req.body.image) {
            imageUrl = req.body.image;
        }

        // ❌ If neither file nor URL
        else {
            return res.json({ status: false, message: "Image required" });
        }

        const newProduct = await product.create({
            name: req.body.name,
            price: req.body.price,
            description: req.body.description,
            image: imageUrl,
            category: req.body.category || "electronics", // ✅ category added
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
        // ✅ Filter by category if provided e.g. /product/get?category=clothing
        const { category } = req.query;
        const filter = category ? { category } : {};

        const products = await product.find(filter);

        return res.json({
            message: "products fetched successfully",
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
            category: req.body.category, // ✅ category added
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
        const deletedProduct = await product.findByIdAndDelete(req.params.id);

        return res.json({
            message: "deleted successfully",
            status: true,
            deletedProduct
        });
    } catch (err) {
        console.log(err);
        return res.json({
            message: "error while delete",
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