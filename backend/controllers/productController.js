const Product = require('../models/Product');
const User = require('../models/User');

// @desc    Create new product
// @route   POST /api/admin/products
// @access  Private (Admin only)
const createProduct = async (req, res) => {
    try {
        const { userId, ...productData } = req.body;

        // Verify admin user
        const user = await User.findById(userId);
        if (!user || user.role !== 'admin') {
            return res.status(401).json({
                success: false,
                message: 'Access denied. Admin role required.'
            });
        }

        // Validate required fields
        const requiredFields = ['title', 'category', 'actualPrice', 'discountPrice'];
        for (const field of requiredFields) {
            if (!productData[field]) {
                return res.status(400).json({
                    success: false,
                    message: `${field} is required`
                });
            }
        }

        // Map frontend fields to backend model fields
        const mappedProductData = {
            title: productData.title,
            brand: productData.brand || 'Zeynix',
            description: productData.description || '',
            images: productData.images,
            category: productData.category,
            actualPrice: productData.actualPrice,
            discountPrice: productData.discountPrice,
            discount: productData.discount || 0,
            rating: productData.rating || 5,
            featured: productData.featured || false,
            isActive: productData.isActive !== undefined ? productData.isActive : true,
            sizes: productData.sizes.map(sizeData => ({
                size: sizeData.size,
                stock: sizeData.inStock ? 10 : 0, // Default stock value
                inStock: sizeData.inStock
            }))
        };

        // Validate sizes array
        if (!productData.sizes || !Array.isArray(productData.sizes) || productData.sizes.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'At least one size must be selected'
            });
        }

        // Validate images array
        if (!productData.images || !Array.isArray(productData.images) || productData.images.length < 2) {
            return res.status(400).json({
                success: false,
                message: 'At least 2 images are required'
            });
        }

        // Calculate discount percentage
        const discountPercentage = Math.round(((productData.actualPrice - productData.discountPrice) / productData.actualPrice) * 100);

        // Create product
        const product = await Product.create(mappedProductData);

        res.status(201).json({
            success: true,
            message: 'Product created successfully',
            data: product
        });

    } catch (error) {
        console.error('Create product error:', error);

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
            message: 'Internal server error during product creation'
        });
    }
};

// @desc    Get all products (admin)
// @route   GET /api/admin/products
// @access  Private (Admin only)
const getAllProducts = async (req, res) => {
    try {
        const { userId } = req.query;

        // Verify admin user
        const user = await User.findById(userId);
        if (!user || user.role !== 'admin') {
            return res.status(401).json({
                success: false,
                message: 'Access denied. Admin role required.'
            });
        }

        // Get products with pagination and filters
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const category = req.query.category;
        const status = req.query.status;
        const search = req.query.search;

        // Build filter
        const filter = { isActive: true };
        if (category && category !== 'all') filter.category = category;
        if (status && status !== 'all') filter.status = status;
        if (search) {
            filter.$or = [
                { title: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } }
            ];
        }

        // Execute query
        const products = await Product.find(filter)
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(limit);

        // Get total count
        const total = await Product.countDocuments(filter);

        res.status(200).json({
            success: true,
            data: {
                products,
                pagination: {
                    page,
                    limit,
                    total,
                    pages: Math.ceil(total / limit)
                }
            }
        });

    } catch (error) {
        console.error('Get products error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error getting products'
        });
    }
};

// @desc    Get single product (admin)
// @route   GET /api/admin/products/:id
// @access  Private (Admin only)
const getProduct = async (req, res) => {
    try {
        const { userId } = req.query;
        const { id } = req.params;

        // Verify admin user
        const user = await User.findById(userId);
        if (!user || user.role !== 'admin') {
            return res.status(401).json({
                success: false,
                message: 'Access denied. Admin role required.'
            });
        }

        const product = await Product.findById(id);
        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found'
            });
        }

        res.status(200).json({
            success: true,
            data: product
        });

    } catch (error) {
        console.error('Get product error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error getting product'
        });
    }
};

// @desc    Update product
// @route   PUT /api/admin/products/:id
// @access  Private (Admin only)
const updateProduct = async (req, res) => {
    try {
        const { userId, ...updateData } = req.body;
        const { id } = req.params;

        // Verify admin user
        const user = await User.findById(userId);
        if (!user || user.role !== 'admin') {
            return res.status(401).json({
                success: false,
                message: 'Access denied. Admin role required.'
            });
        }

        // Check if product exists
        const existingProduct = await Product.findById(id);
        if (!existingProduct) {
            return res.status(404).json({
                success: false,
                message: 'Product not found'
            });
        }

        // Validate required fields if updating
        if (updateData.title !== undefined && !updateData.title) {
            return res.status(400).json({
                success: false,
                message: 'Title is required'
            });
        }

        // Calculate discount percentage if prices are updated
        if (updateData.actualPrice !== undefined || updateData.discountPrice !== undefined) {
            const actualPrice = updateData.actualPrice || existingProduct.actualPrice;
            const discountPrice = updateData.discountPrice || existingProduct.discountPrice;
            updateData.discountPercentage = Math.round(((actualPrice - discountPrice) / actualPrice) * 100);
        }

        // Update product
        const updatedProduct = await Product.findByIdAndUpdate(
            id,
            updateData,
            { new: true, runValidators: true }
        );

        res.status(200).json({
            success: true,
            message: 'Product updated successfully',
            data: updatedProduct
        });

    } catch (error) {
        console.error('Update product error:', error);

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
            message: 'Internal server error during product update'
        });
    }
};

// @desc    Delete product (soft delete)
// @route   DELETE /api/admin/products/:id
// @access  Private (Admin only)
const deleteProduct = async (req, res) => {
    try {
        const { userId } = req.query;
        const { id } = req.params;

        // Verify admin user
        const user = await User.findById(userId);
        if (!user || user.role !== 'admin') {
            return res.status(401).json({
                success: false,
                message: 'Access denied. Admin role required.'
            });
        }

        // Check if product exists
        const product = await Product.findById(id);
        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found'
            });
        }

        // Soft delete - mark as inactive
        await Product.findByIdAndUpdate(id, {
            isActive: false,
            status: 'archived'
        });

        res.status(200).json({
            success: true,
            message: 'Product deleted successfully'
        });

    } catch (error) {
        console.error('Delete product error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error during product deletion'
        });
    }
};

// @desc    Toggle product status
// @route   PATCH /api/admin/products/:id/toggle-status
// @access  Private (Admin only)
const toggleProductStatus = async (req, res) => {
    try {
        const { userId, status } = req.body;
        const { id } = req.params;

        // Verify admin user
        const user = await User.findById(userId);
        if (!user || user.role !== 'admin') {
            return res.status(401).json({
                success: false,
                message: 'Access denied. Admin role required.'
            });
        }

        // Validate status
        const validStatuses = ['draft', 'published', 'archived'];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid status. Must be draft, published, or archived'
            });
        }

        // Update product status
        const updatedProduct = await Product.findByIdAndUpdate(
            id,
            { status },
            { new: true }
        );

        if (!updatedProduct) {
            return res.status(404).json({
                success: false,
                message: 'Product not found'
            });
        }

        res.status(200).json({
            success: true,
            message: `Product status updated to ${status}`,
            data: updatedProduct
        });

    } catch (error) {
        console.error('Toggle product status error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error during status update'
        });
    }
};

module.exports = {
    createProduct,
    getAllProducts,
    getProduct,
    updateProduct,
    deleteProduct,
    toggleProductStatus
};
