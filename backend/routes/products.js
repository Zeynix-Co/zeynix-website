const express = require('express');
const router = express.Router();
const {
    createProduct,
    getAllProducts,
    getProduct,
    updateProduct,
    deleteProduct,
    toggleProductStatus
} = require('../controllers/productController');

// All routes require admin authentication via userId in body/query
router.post('/', createProduct);                    // Create new product
router.get('/', getAllProducts);                    // Get all products
router.get('/:id', getProduct);                    // Get single product
router.put('/:id', updateProduct);                 // Update product
router.delete('/:id', deleteProduct);              // Delete product
router.patch('/:id/toggle-status', toggleProductStatus); // Toggle product status

module.exports = router;
