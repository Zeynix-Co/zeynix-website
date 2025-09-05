const User = require('../models/User');
const Product = require('../models/Product');
const Order = require('../models/Order');
const jwt = require('jsonwebtoken');

// Generate JWT Token
const generateToken = (id, rememberMe = false) => {
    const expiresIn = rememberMe ? '30d' : '24h';
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn });
};

// Set token cookie
const setTokenCookie = (res, token, rememberMe = false) => {
    const options = {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: rememberMe ? 30 * 24 * 60 * 60 * 1000 : 24 * 60 * 60 * 1000 // 30 days or 24 hours
    };

    res.cookie('token', token, options);
};

// @desc    Admin login
// @route   POST /api/admin/login
// @access  Public
const adminLogin = async (req, res) => {
    try {
        const { email, password, rememberMe } = req.body;

        // Validation
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Please provide email and password'
            });
        }

        // Find user and include password for comparison
        const user = await User.findOne({ email }).select('+password');

        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Invalid credentials'
            });
        }

        if (!user.isActive) {
            return res.status(401).json({
                success: false,
                message: 'Account is deactivated. Please contact support.'
            });
        }

        if (user.role !== 'admin') {
            return res.status(403).json({
                success: false,
                message: 'Access denied. Admin role required.'
            });
        }

        // Check password
        const isPasswordValid = await user.comparePassword(password);
        if (!isPasswordValid) {
            return res.status(401).json({
                success: false,
                message: 'Invalid credentials'
            });
        }

        // Generate token
        const token = generateToken(user._id, rememberMe);

        // Set cookie
        setTokenCookie(res, token, rememberMe);

        res.status(200).json({
            success: true,
            message: 'Admin login successful',
            data: {
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    phone: user.phone,
                    role: user.role
                },
                token
            }
        });

    } catch (error) {
        console.error('Admin login error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error during admin login'
        });
    }
};

// @desc    Get admin dashboard data
// @route   POST /api/admin/dashboard
// @access  Private (Admin only)
const getDashboardData = async (req, res) => {
    try {
        const { userId } = req.body;

        // Simple authentication - check if user exists and is admin
        const user = await User.findById(userId);
        if (!user || user.role !== 'admin') {
            return res.status(401).json({
                success: false,
                message: 'Access denied. Admin role required.'
            });
        }

        // Get counts
        const totalProducts = await Product.countDocuments({ isActive: true });
        const totalOrders = await Order.countDocuments({ isActive: true });
        const totalUsers = await User.countDocuments({ role: 'user', isActive: true });
        const pendingOrders = await Order.countDocuments({ status: 'pending', isActive: true });

        // Get recent orders
        const recentOrders = await Order.find({ isActive: true })
            .populate('user', 'name email')
            .sort({ createdAt: -1 })
            .limit(5);

        // Get low stock products
        const lowStockProducts = await Product.find({
            'sizes.stock': { $lte: 5 },
            isActive: true
        }).select('title sizes');

        res.status(200).json({
            success: true,
            data: {
                counts: {
                    totalProducts,
                    totalOrders,
                    totalUsers,
                    pendingOrders
                },
                recentOrders,
                lowStockProducts
            }
        });

    } catch (error) {
        console.error('Dashboard data error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error getting dashboard data'
        });
    }
};

// @desc    Create first admin user (one-time setup)
// @route   POST /api/admin/setup
// @access  Public (only for first admin)
const setupFirstAdmin = async (req, res) => {
    try {
        // Check if any admin exists
        const existingAdmin = await User.findOne({ role: 'admin' });

        if (existingAdmin) {
            return res.status(400).json({
                success: false,
                message: 'Admin already exists. Cannot create another admin account.'
            });
        }

        const { name, email, phone, password } = req.body;

        // Validation
        if (!name || !email || !phone || !password) {
            return res.status(400).json({
                success: false,
                message: 'Please provide all required fields'
            });
        }

        if (password.length < 6) {
            return res.status(400).json({
                success: false,
                message: 'Password must be at least 6 characters long'
            });
        }

        // Check if user already exists
        const existingUser = await User.findOne({
            $or: [{ email }, { phone }]
        });

        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: existingUser.email === email ? 'Email already registered' : 'Phone number already registered'
            });
        }

        // Create admin user
        const adminUser = await User.create({
            name,
            email,
            phone,
            password,
            role: 'admin'
        });

        // Generate token (default to rememberMe for admin setup)
        const token = generateToken(adminUser._id, true);

        // Set cookie
        setTokenCookie(res, token, true);

        res.status(201).json({
            success: true,
            message: 'First admin account created successfully',
            data: {
                user: {
                    id: adminUser._id,
                    name: adminUser.name,
                    email: adminUser.email,
                    phone: adminUser.phone,
                    role: adminUser.role
                },
                token
            }
        });

    } catch (error) {
        console.error('Admin setup error:', error);

        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map(err => err.message);
            return res.status(400).json({
                success: false,
                message: 'Validation error',
                errors: messages
            });
        }

        res.status(500).json({
            success: false,
            message: 'Internal server error during admin setup'
        });
    }
};

module.exports = {
    adminLogin,
    getDashboardData,
    setupFirstAdmin
};
