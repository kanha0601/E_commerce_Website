const product = require("../model/Product");
const cloudinary = require("../config/cloudinary");

// ================= ADD PRODUCT =================
const AddProduct = async (req, res) => {
    try {
        let imageUrl = "";

        // ✅ Upload single image to Cloudinary
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

        if (!imageUrl) {
            return res.json({ status: false, message: "Image required" });
        }

        const newProduct = await product.create({
            name: req.body.name,
            price: req.body.price,
            description: req.body.description,
            image: imageUrl, // ✅ single string
            category: req.body.category || "electronics",
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

// ================= GET PRODUCT =================
const GetProduct = async (req, res) => {
    try {
        const { category } = req.query;
        const filter = category ? { category } : {};

        const products = await product.find(filter).sort({ createdAt: -1 });

        return res.json({
            message: "products fetched successfully",
            product: products,
            status: true,
        });
    } catch (err) {
        console.log(err);
        return res.json({ message: "error while fetch", status: false });
    }
};

// ================= UPDATE PRODUCT =================
const updateProduct = async (req, res) => {
    try {
        let updateData = {
            name: req.body.name,
            price: req.body.price,
            description: req.body.description,
            category: req.body.category,
        };

        // ✅ Update image if new one uploaded
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

// ================= DELETE PRODUCT =================
const Deleteproduct = async (req, res) => {
    try {
        const deletedProduct = await product.findByIdAndDelete(req.params.id);

        return res.json({
            message: "deleted successfully",
            status: true,
            deletedProduct,
        });
    } catch (err) {
        console.log(err);
        return res.json({ message: "error while delete", status: false });
    }
};

module.exports = { AddProduct, GetProduct, updateProduct, Deleteproduct };