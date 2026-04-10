const Order = require("../model/Order");

exports.createOrder = async (req, res) => {
    try {
        const { products, totalAmount, shippingAddress, paymentMethod } = req.body;

        if (!products || products.length === 0) {
            return res.status(400).json({ message: "Cart is empty" });
        }
        if (!shippingAddress) {
            return res.status(400).json({ message: "Shipping address required" });
        }
        if (!paymentMethod) {
            return res.status(400).json({ message: "Payment method required" });
        }

        // ✅ Transform cart items to match schema: { product: ObjectId, quantity, price }
        const formattedProducts = products.map(item => ({
            product: item._id || item.product,
            quantity: item.quantity || 1,
            price: item.price,
        }));

        // ✅ Ensure state field exists (required in schema)
        const formattedAddress = {
            ...shippingAddress,
            state: shippingAddress.state || "N/A",
        };

        // ✅ Lowercase paymentMethod — schema enum is "cod" / "online"
        const formattedPaymentMethod = paymentMethod.toLowerCase();

        const order = await Order.create({
            user: req.user.id,
            products: formattedProducts,
            totalAmount,
            shippingAddress: formattedAddress,
            paymentMethod: formattedPaymentMethod,
            paymentStatus: formattedPaymentMethod === "cod" ? "pending" : "completed",
            status: "pending",
        });

        res.status(201).json({
            success: true,
            message: "Order placed successfully",
            order,
        });

    } catch (error) {
        console.log("CREATE ORDER ERROR:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.getMyOrders = async (req, res) => {
    try {
        const orders = await Order.find({ user: req.user._id })
            .populate("products.product", "name price images")
            .sort({ createdAt: -1 });

        res.json({ success: true, orders });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

exports.getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find()
            .populate("user", "name email")
            .populate("products.product", "name price images");

        res.json({ success: true, orders });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

exports.updateOrderStatus = async (req, res) => {
    try {
        const { status } = req.body;

        // ✅ Validate status value
        const validStatuses = ['pending', 'paid', 'shipped', 'delivered', 'cancelled'];
        if (!status || !validStatuses.includes(status)) {
            return res.status(400).json({ success: false, message: "Invalid status value" });
        }

        const order = await Order.findByIdAndUpdate(
            req.params.id,
            { status },
            { new: true }
        );

        if (!order) {
            return res.status(404).json({ success: false, message: "Order not found" });
        }

        res.json({ success: true, message: "Order status updated", order });

    } catch (error) {
        console.log("UPDATE STATUS ERROR:", error); // ← check Render logs for exact error
        res.status(500).json({ success: false, message: error.message });
    }
};