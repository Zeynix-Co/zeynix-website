const Product = require('../models/Product');

// @desc    Get all active products (public)
// @route   GET /api/customer/products
// @access  Public
const getPublicProducts = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;
        const category = req.query.category;
        const sortBy = req.query.sortBy || 'createdAt';
        const sortOrder = req.query.sortOrder === 'asc' ? 1 : -1;

        // Build filter - only active and published products
        const filter = {
            isActive: true,
            status: 'published'
        };

        if (category && category !== 'all') {
            filter.category = category;
        }

        // Build sort object
        let sort = {};
        switch (sortBy) {
            case 'price':
                sort = { actualPrice: sortOrder };
                break;
            case 'rating':
                sort = { rating: sortOrder };
                break;
            case 'featured':
                sort = { featured: -1, createdAt: -1 };
                break;
            case 'newest':
                sort = { createdAt: -1 };
                break;
            default:
                sort = { createdAt: -1 };
        }

        // Execute query
        const products = await Product.find(filter)
            .sort(sort)
            .skip((page - 1) * limit)
            .limit(limit)
            .select('-__v'); // Exclude version key

        // Get total count
        const total = await Product.countDocuments(filter);

        // Transform products for frontend
        const transformedProducts = products.map(product => ({
            id: product._id,
            name: product.title,
            brand: product.brand || 'Zeynix',
            price: product.discountPrice || product.actualPrice,
            originalPrice: product.actualPrice,
            rating: product.rating || 0,
            image: product.images && product.images.length > 0 ? product.images[0] : '/images/products/placeholder.jpg',
            images: product.images || [],
            category: product.category || 'casual',
            size: product.sizes && product.sizes.length > 0 ? product.sizes.map(s => s.size) : ['M', 'L', 'XL'],
            label: product.productFit || 'CASUAL FIT',
            description: product.description || '',
            inStock: product.sizes && product.sizes.length > 0 ? product.sizes.some(s => s.inStock) : true,
            featured: product.featured || false,
            discount: product.discount || 0
        }));

        res.status(200).json({
            success: true,
            data: {
                products: transformedProducts,
                pagination: {
                    page,
                    limit,
                    total,
                    pages: Math.ceil(total / limit)
                }
            }
        });

    } catch (error) {
        console.error('Get public products error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error getting products'
        });
    }
};

// @desc    Get featured products (public)
// @route   GET /api/customer/products/featured
// @access  Public
const getFeaturedProducts = async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 8;

        const products = await Product.find({
            isActive: true,
            status: 'published',
            featured: true
        })
            .sort({ createdAt: -1 })
            .limit(limit)
            .select('-__v');

        const transformedProducts = products.map(product => ({
            id: product._id,
            name: product.title,
            brand: product.brand,
            price: product.discountPrice || product.actualPrice,
            originalPrice: product.actualPrice,
            rating: product.rating,
            image: product.images[0] || '',
            images: product.images,
            category: product.category,
            size: product.sizes.map(s => s.size),
            label: product.productFit || 'CASUAL FIT',
            description: product.description,
            inStock: product.sizes.some(s => s.inStock),
            featured: product.featured,
            discount: product.discount || 0
        }));

        res.status(200).json({
            success: true,
            data: transformedProducts
        });

    } catch (error) {
        console.error('Get featured products error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error getting featured products'
        });
    }
};

// @desc    Get products by category (public)
// @route   GET /api/customer/products/category/:category
// @access  Public
const getProductsByCategory = async (req, res) => {
    try {
        const { category } = req.params;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;
        const sortBy = req.query.sortBy || 'createdAt';
        const sortOrder = req.query.sortOrder === 'asc' ? 1 : -1;

        // Build filter
        const filter = {
            isActive: true,
            status: 'published',
            category: category.toLowerCase()
        };

        // Build sort object
        let sort = {};
        switch (sortBy) {
            case 'price':
                sort = { actualPrice: sortOrder };
                break;
            case 'rating':
                sort = { rating: sortOrder };
                break;
            case 'featured':
                sort = { featured: -1, createdAt: -1 };
                break;
            case 'newest':
                sort = { createdAt: -1 };
                break;
            default:
                sort = { createdAt: -1 };
        }

        const products = await Product.find(filter)
            .sort(sort)
            .skip((page - 1) * limit)
            .limit(limit)
            .select('-__v');

        const total = await Product.countDocuments(filter);

        const transformedProducts = products.map(product => ({
            id: product._id,
            name: product.title,
            brand: product.brand,
            price: product.discountPrice || product.actualPrice,
            originalPrice: product.actualPrice,
            rating: product.rating,
            image: product.images[0] || '',
            images: product.images,
            category: product.category,
            size: product.sizes.map(s => s.size),
            label: product.productFit || 'CASUAL FIT',
            description: product.description,
            inStock: product.sizes.some(s => s.inStock),
            featured: product.featured,
            discount: product.discount || 0
        }));

        res.status(200).json({
            success: true,
            data: {
                products: transformedProducts,
                pagination: {
                    page,
                    limit,
                    total,
                    pages: Math.ceil(total / limit)
                }
            }
        });

    } catch (error) {
        console.error('Get products by category error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error getting products by category'
        });
    }
};

// @desc    Search products (public)
// @route   GET /api/customer/products/search
// @access  Public
const searchProducts = async (req, res) => {
    try {
        const { q: query, category, minPrice, maxPrice, size } = req.query;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;

        // Build filter
        const filter = {
            isActive: true,
            status: 'published'
        };

        // Search query
        if (query) {
            filter.$or = [
                { title: { $regex: query, $options: 'i' } },
                { description: { $regex: query, $options: 'i' } },
                { brand: { $regex: query, $options: 'i' } }
            ];
        }

        // Category filter
        if (category && category !== 'all') {
            filter.category = category;
        }

        // Price filter
        if (minPrice || maxPrice) {
            filter.actualPrice = {};
            if (minPrice) filter.actualPrice.$gte = parseFloat(minPrice);
            if (maxPrice) filter.actualPrice.$lte = parseFloat(maxPrice);
        }

        // Size filter
        if (size) {
            filter['sizes.size'] = size;
        }

        const products = await Product.find(filter)
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(limit)
            .select('-__v');

        const total = await Product.countDocuments(filter);

        const transformedProducts = products.map(product => ({
            id: product._id,
            name: product.title,
            brand: product.brand,
            price: product.discountPrice || product.actualPrice,
            originalPrice: product.actualPrice,
            rating: product.rating,
            image: product.images[0] || '',
            images: product.images,
            category: product.category,
            size: product.sizes.map(s => s.size),
            label: product.productFit || 'CASUAL FIT',
            description: product.description,
            inStock: product.sizes.some(s => s.inStock),
            featured: product.featured,
            discount: product.discount || 0
        }));

        res.status(200).json({
            success: true,
            data: {
                products: transformedProducts,
                pagination: {
                    page,
                    limit,
                    total,
                    pages: Math.ceil(total / limit)
                }
            }
        });

    } catch (error) {
        console.error('Search products error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error searching products'
        });
    }
};

// @desc    Get single product (public)
// @route   GET /api/customer/products/:id
// @access  Public
const getPublicProduct = async (req, res) => {
    try {
        const { id } = req.params;

        const product = await Product.findOne({
            _id: id,
            isActive: true,
            status: 'published'
        }).select('-__v');

        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found'
            });
        }

        const transformedProduct = {
            id: product._id,
            name: product.title,
            brand: product.brand || 'Zeynix',
            price: product.discountPrice || product.actualPrice,
            originalPrice: product.actualPrice,
            rating: product.rating || 0,
            image: product.images && product.images.length > 0 ? product.images[0] : '/images/products/placeholder.jpg',
            images: product.images || [],
            category: product.category || 'casual',
            size: product.sizes && product.sizes.length > 0 ? product.sizes.map(s => s.size) : ['M', 'L', 'XL'],
            label: product.productFit || 'CASUAL FIT',
            description: product.description || '',
            inStock: product.sizes && product.sizes.length > 0 ? product.sizes.some(s => s.inStock) : true,
            featured: product.featured || false,
            discount: product.discount || 0,
            sizes: product.sizes
        };

        res.status(200).json({
            success: true,
            data: transformedProduct
        });

    } catch (error) {
        console.error('Get public product error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error getting product'
        });
    }
};

module.exports = {
    getPublicProducts,
    getPublicProduct,
    getProductsByCategory,
    searchProducts,
    getFeaturedProducts
};
