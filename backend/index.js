const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
require('dotenv').config();
const connectDB = require('./config/database');
const { protect } = require('./middleware/auth');

const app = express();

// CORS configuration
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true, // Allow cookies to be sent
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// Middleware
app.use(express.json());
app.use(cookieParser());

// Connect to MongoDB
connectDB();

// Import routes
const authRoutes = require('./routes/auth');
const adminRoutes = require('./routes/admin');
const productRoutes = require('./routes/products');
const orderRoutes = require('./routes/orders');
const uploadRoutes = require('./routes/upload');
const customerProductRoutes = require('./routes/customerProducts');
const customerOrderRoutes = require('./routes/customerOrders');

// Basic route for testing
app.get('/', (req, res) => {
    res.json({ message: 'Zeynix Backend API is running!' });
});

// Health check route
app.get('/api/health', (req, res) => {
    res.json({ status: 'OK', message: 'Backend is healthy' });
});

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/admin/products', productRoutes);
app.use('/api/admin/orders', protect, orderRoutes); // Admin orders with auth
app.use('/api/admin/upload', uploadRoutes);
app.use('/api/customer/products', customerProductRoutes);

// Customer orders route (protected)
app.use('/api/orders', protect, customerOrderRoutes);

// Start server
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
    console.log(`🚀 Backend server running on port ${PORT}`);
});
