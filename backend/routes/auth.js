const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const {
    register,
    login,
    logout,
    getMe,
    forgotPassword
} = require('../controllers/authController');

// Public routes
router.post('/register', register);
router.post('/login', login);
router.post('/forgot-password', forgotPassword);

// Protected routes
router.post('/logout', protect, logout);
router.get('/me', protect, getMe);

module.exports = router;
