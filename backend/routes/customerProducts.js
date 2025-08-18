const express = require('express');
const router = express.Router();
const {
    getPublicProducts,
    getPublicProduct,
    getProductsByCategory,
    searchProducts,
    getFeaturedProducts
} = require('../controllers/customerProductController');

// Public routes - no authentication required
router.get('/', getPublicProducts);                    // Get all active products
router.get('/featured', getFeaturedProducts);          // Get featured products
router.get('/category/:category', getProductsByCategory); // Get products by category
router.get('/search', searchProducts);                 // Search products
router.get('/:id', getPublicProduct);                  // Get single product

module.exports = router;
