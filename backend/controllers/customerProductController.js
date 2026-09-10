const mongoose = require('mongoose');
const Product = require('../models/Product');

// Product transformer helper
const transformProduct = (product) => ({
    id: product._id,
    name: product.name || product.title,
    title: product.title || product.name,
    slug: product.slug || product._id.toString(),
    productId: product.productId || product._id.toString(),
    brand: product.brand || 'Zeynix',
    price: product.price || product.discountPrice || product.actualPrice,
    originalPrice: product.originalPrice || product.actualPrice,
    actualPrice: product.actualPrice,
    discountPrice: product.discountPrice || product.price || product.actualPrice,
    rating: product.rating || 0,
    totalRatings: product.totalRatings || 0,
    image: product.mainImage || (product.images && product.images.length > 0 ? product.images[0] : '/images/products/placeholder.jpg'),
    mainImage: product.mainImage || (product.images && product.images.length > 0 ? product.images[0] : '/images/products/placeholder.jpg'),
    images: product.images || [],
    category: product.category || 'casual',
    subcategory: product.subcategory || 't-shirts',
    size: product.sizes && product.sizes.length > 0 ? product.sizes.map(s => s.size) : ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    label: product.productFit || 'CASUAL FIT',
    productFit: product.productFit || 'CASUAL FIT',
    description: product.description || '',
    inStock: product.sizes && product.sizes.length > 0 ? product.sizes.some(s => s.inStock) : true,
    availableStock: product.availableStock || (product.sizes && product.sizes.length > 0 ? product.sizes.reduce((tot, s) => tot + (s.stock || 0), 0) : 100),
    featured: product.featured || false,
    discount: product.discount || 0,
    sizes: product.sizes || []
});

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
        const transformedProducts = products.map(transformProduct);

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

        const transformedProducts = products.map(transformProduct);

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
            status: 'published'
        };

        if (category && category !== 'all') {
            filter.category = category.toLowerCase();
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

        const products = await Product.find(filter)
            .sort(sort)
            .skip((page - 1) * limit)
            .limit(limit)
            .select('-__v');

        const total = await Product.countDocuments(filter);
        const transformedProducts = products.map(transformProduct);

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
                { name: { $regex: query, $options: 'i' } },
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
        const transformedProducts = products.map(transformProduct);

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

        const isObjectId = mongoose.Types.ObjectId.isValid(id);
        const query = isObjectId
            ? {
                $or: [{ _id: id }, { slug: id }, { productId: id }],
                isActive: true,
                status: 'published'
            }
            : {
                $or: [{ slug: id }, { productId: id }],
                isActive: true,
                status: 'published'
            };

        const product = await Product.findOne(query).select('-__v');

        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found'
            });
        }

        const transformedProduct = transformProduct(product);

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
