const express = require('express');
const router = express.Router();
const {
    adminLogin,
    getDashboardData,
    setupFirstAdmin
} = require('../controllers/adminController');

// Public routes (no authentication required)
router.post('/login', adminLogin);
router.post('/setup', setupFirstAdmin);

// Protected routes (simple user ID check)
router.post('/dashboard', getDashboardData);

module.exports = router;
