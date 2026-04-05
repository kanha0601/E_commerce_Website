const express = require('express');
const router = express.Router();
const { registerUser, loginUser, logoutUser, getMe } = require('../controller/authController');
const { protect } = require('../middleware/authMiddleware');

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/logout', logoutUser);
router.get('/me', getMe);

// ✅ TEMPORARY ROUTE - DELETE AFTER USE
router.post("/make-admin", async (req, res) => {
    try {
        const User = require("../model/User");
        const { email, secretKey } = req.body;

        if (secretKey !== "MYADMINKEY123") {
            return res.status(403).json({ message: "Not allowed" });
        }

        const user = await User.findOneAndUpdate(
            { email },
            { role: "admin" },
            { new: true }
        );

        if (!user) return res.status(404).json({ message: "User not found" });

        res.json({ success: true, message: "Admin role assigned", user });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;