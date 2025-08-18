const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Middleware to protect routes (require authentication)
const protect = async (req, res, next) => {
    try {
        let token;

        // Check for token in headers
        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1];
        }
        // Check for token in cookies (for remember me functionality)
        else if (req.cookies && req.cookies.token) {
            token = req.cookies.token;
        }

        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'Access denied. No token provided.'
            });
        }

        try {
            // Verify token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // Get user from token
            const user = await User.findById(decoded.id).select('-password');

            if (!user) {
                return res.status(401).json({
                    success: false,
                    message: 'Token is not valid. User not found.'
                });
            }

            if (!user.isActive) {
                return res.status(401).json({
                    success: false,
                    message: 'User account is deactivated.'
                });
            }

            req.user = user;
            next();
        } catch (error) {
            return res.status(401).json({
                success: false,
                message: 'Token is not valid.'
            });
        }
    } catch (error) {
        console.error('Auth middleware error:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error in authentication.'
        });
    }
};

// Middleware to check if user is admin
const admin = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        return res.status(403).json({
            success: false,
            message: 'Access denied. Admin role required.'
        });
    }
};

// Middleware to check if user is customer
const customer = (req, res, next) => {
    if (req.user && req.user.role === 'user') {
        next();
    } else {
        return res.status(403).json({
            success: false,
            message: 'Access denied. Customer role required.'
        });
    }
};

// Optional authentication (user can be logged in or not)
const optionalAuth = async (req, res, next) => {
    try {
        let token;

        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1];
        } else if (req.cookies && req.cookies.token) {
            token = req.cookies.token;
        }

        if (token) {
            try {
                const decoded = jwt.verify(token, process.env.JWT_SECRET);
                const user = await User.findById(decoded.id).select('-password');

                if (user && user.isActive) {
                    req.user = user;
                }
            } catch (error) {
                // Token is invalid, but we continue without user
            }
        }

        next();
    } catch (error) {
        next();
    }
};

module.exports = {
    protect,
    admin,
    customer,
    optionalAuth
};
