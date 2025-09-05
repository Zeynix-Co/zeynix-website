const express = require('express');
const router = express.Router();
const {
    getAllOrders,
    getOrder,
    updateOrderStatus
} = require('../controllers/orderController');

// Get all orders with filters and pagination (admin)
router.get('/', getAllOrders);

// Get a specific order by ID (admin)
router.get('/:id', getOrder);

// Update order status (admin only)
router.patch('/:id/status', updateOrderStatus);

module.exports = router;
