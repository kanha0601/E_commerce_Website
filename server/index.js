const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');
dotenv.config();

connectDB();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
  origin: ['http://localhost:5173', 'https://e-commerce-website-lovat-beta.vercel.app'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.options('/(.*)', cors()); // Handle preflight for all routes
app.use(express.json());

// Routes
const authRoutes = require('./route/authRoutes');
const contactRoutes = require('./route/contactRoutes');
const productRoutes = require('./route/ProductRoute');
const orderRoutes = require('./route/orderRoutes');
const adminRoutes = require("./route/adminRoutes");

// Mount Routes
app.use('/api/auth', authRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/product', productRoutes);
app.use('/api/order', orderRoutes);
app.use("/api/admin", adminRoutes);

app.get('/', (req, res) => {
  res.send('API is running...');
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});