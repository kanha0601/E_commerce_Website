const Order = require("../model/Order");

exports.createOrder = async (req, res) => {
    try {
        const { products, totalAmount } = req.body;

        if (!products || products.length === 0) {
            return res.status(400).json({ message: "Cart is empty" });
        }

        const order = await Order.create({
            user: req.user.id,
            products,
            totalAmount,
            status: "pending", // ✅ explicit
        });

        res.status(201).json({
            success: true,
            message: "Order placed successfully",
            order,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: "Order failed" });
    }
};

exports.getMyOrders = async (req, res) => {
    try {
        const orders = await Order.find({ user: req.user._id })
            .populate("products.product", "name price")
            .sort({ createdAt: -1 });

        res.json({
            success: true,
            orders,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message,
        });
    }
};


exports.getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find()
            .populate("user", "name email")
            .populate("products.product", "name price");

        res.json({ success: true, orders });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

exports.updateOrderStatus = async (req, res) => {
    try {
        const { status } = req.body;

        const order = await Order.findById(req.params.id);
        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }

        order.status = status;
        await order.save();

        res.json({
            success: true,
            message: "Order status updated",
            order,
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

