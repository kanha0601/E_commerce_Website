const product = require("../model/Product");
const cloudinary = require("../config/cloudinary");

const uploadToCloudinary = (buffer) => {
    return new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream(
            { folder: "products" },
            (error, result) => {
                if (error) reject(error);
                else resolve(result.secure_url);
            }
        ).end(buffer);
    });
};

// ================= ADD PRODUCT =================
const AddProduct = async (req, res) => {
    try {
        let imageUrl = "";
        let imageUrls = [];

        // ✅ Handle multiple file uploads
        if (req.files && req.files.length > 0) {
            for (const file of req.files) {
                const url = await uploadToCloudinary(file.buffer);
                imageUrls.push(url);
            }
            imageUrl = imageUrls[0]; // first image is primary
        }

        // ✅ Handle single file upload
        if (req.file) {
            imageUrl = await uploadToCloudinary(req.file.buffer);
            imageUrls = [imageUrl];
        }

        // ✅ Handle image URLs from body
        if (req.body.imageUrls) {
            const urls = JSON.parse(req.body.imageUrls);
            imageUrls = [...imageUrls, ...urls];
            if (!imageUrl) imageUrl = imageUrls[0];
        }

        // ✅ Handle single image URL
        if (!imageUrl && req.body.image) {
            imageUrl = req.body.image;
            imageUrls = [imageUrl];
        }

        if (!imageUrl) {
            return res.json({ status: false, message: "At least one image required" });
        }

        const newProduct = await product.create({
            name: req.body.name,
            price: req.body.price,
            description: req.body.description,
            image: imageUrl,
            images: imageUrls,
            category: req.body.category || "electronics",
        });

        return res.json({ status: true, message: "Product created", product: newProduct });
    } catch (err) {
        console.log(err);
        return res.json({ status: false, message: "Upload failed: " + err.message });
    }
};

// ================= GET PRODUCT =================
const GetProduct = async (req, res) => {
    try {
        const { category } = req.query;
        const filter = category ? { category } : {};
        const products = await product.find(filter).sort({ createdAt: -1 });
        return res.json({ message: "products fetched successfully", product: products, status: true });
    } catch (err) {
        console.log(err);
        return res.json({ message: "error while fetch", status: false });
    }
};

// ================= GET SINGLE PRODUCT =================
const GetSingleProduct = async (req, res) => {
    try {
        const p = await product.findById(req.params.id)
            .populate("reviews.user", "name");
        if (!p) return res.status(404).json({ status: false, message: "Product not found" });
        return res.json({ status: true, product: p });
    } catch (err) {
        console.log(err);
        return res.json({ status: false, message: "Error fetching product" });
    }
};

// ================= ADD REVIEW =================
const AddReview = async (req, res) => {
    try {
        const { rating, comment } = req.body;
        const p = await product.findById(req.params.id);
        if (!p) return res.status(404).json({ message: "Product not found" });

        // Check if user already reviewed
        const alreadyReviewed = p.reviews.find(r => r.user.toString() === req.user.id);
        if (alreadyReviewed) {
            return res.status(400).json({ message: "You already reviewed this product" });
        }

        const review = {
            user: req.user.id,
            name: req.user.name,
            rating: Number(rating),
            comment,
        };

        p.reviews.push(review);
        p.numReviews = p.reviews.length;
        p.rating = p.reviews.reduce((acc, r) => acc + r.rating, 0) / p.reviews.length;
        await p.save();

        return res.json({ status: true, message: "Review added", product: p });
    } catch (err) {
        console.log(err);
        return res.json({ status: false, message: "Error adding review" });
    }
};

// ================= TOGGLE WISHLIST =================
const ToggleWishlist = async (req, res) => {
    try {
        const p = await product.findById(req.params.id);
        if (!p) return res.status(404).json({ message: "Product not found" });

        const userId = req.user.id;
        const idx = p.wishlist.indexOf(userId);

        if (idx === -1) {
            p.wishlist.push(userId);
        } else {
            p.wishlist.splice(idx, 1);
        }

        await p.save();
        const wishlisted = p.wishlist.includes(userId);
        return res.json({ status: true, wishlisted, wishlistCount: p.wishlist.length });
    } catch (err) {
        console.log(err);
        return res.json({ status: false, message: "Error updating wishlist" });
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

        let imageUrls = [];

        if (req.files && req.files.length > 0) {
            for (const file of req.files) {
                const url = await uploadToCloudinary(file.buffer);
                imageUrls.push(url);
            }
            updateData.image = imageUrls[0];
            updateData.images = imageUrls;
        }

        if (req.file) {
            const url = await uploadToCloudinary(req.file.buffer);
            updateData.image = url;
            updateData.images = [url];
        }

        if (!req.file && !req.files && req.body.image) {
            updateData.image = req.body.image;
            updateData.images = [req.body.image];
        }

        const updated = await product.findByIdAndUpdate(req.params.id, updateData, { new: true });
        return res.json({ status: true, message: "Product updated", updateProduct: updated });
    } catch (err) {
        console.log(err);
        return res.json({ status: false });
    }
};

// ================= DELETE PRODUCT =================
const Deleteproduct = async (req, res) => {
    try {
        const deletedProduct = await product.findByIdAndDelete(req.params.id);
        return res.json({ message: "deleted successfully", status: true, deletedProduct });
    } catch (err) {
        console.log(err);
        return res.json({ message: "error while delete", status: false });
    }
};

module.exports = { AddProduct, GetProduct, GetSingleProduct, AddReview, ToggleWishlist, updateProduct, Deleteproduct };