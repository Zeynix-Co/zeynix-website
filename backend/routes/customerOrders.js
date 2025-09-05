const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const User = require('../models/User');
const Product = require('../models/Product');

// POST /api/orders - Create a new order
router.post('/', async (req, res) => {
    try {
        // Get user ID from token (set by auth middleware)
        const userId = req.user._id;
        const { items, totalAmount, shippingAddress } = req.body;

        // Debug: Log received data
        console.log('Backend received order data:', {
            userId,
            items: items.map(item => ({
                productId: item.productId,
                size: item.size,
                quantity: item.quantity,
                price: item.price
            })),
            totalAmount,
            shippingAddress: {
                city: shippingAddress?.city,
                state: shippingAddress?.state
            }
        });

        console.log('User ID from token:', userId);


        // Validate required fields
        if (!items || !Array.isArray(items) || items.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'Order items are required'
            });
        }

        if (!totalAmount || totalAmount <= 0) {
            return res.status(400).json({
                success: false,
                message: 'Invalid total amount'
            });
        }

        if (!shippingAddress) {
            return res.status(400).json({
                success: false,
                message: 'Shipping address is required'
            });
        }

        // Validate products and check stock
        let calculatedTotal = 0;
        const orderItems = [];

        for (const item of items) {
            const product = await Product.findById(item.productId);
            if (!product) {
                return res.status(400).json({
                    success: false,
                    message: `Product ${item.productId} not found`
                });
            }

            if (!product.isActive) {
                return res.status(400).json({
                    success: false,
                    message: `Product ${product.title} is not available`
                });
            }

            // Check stock availability
            const sizeStock = product.sizes.find(s => s.size === item.size);
            if (!sizeStock || sizeStock.stock < item.quantity) {
                return res.status(400).json({
                    success: false,
                    message: `Insufficient stock for ${product.title} in size ${item.size}`
                });
            }

            // Use the price sent by frontend (which already includes discounts)
            const itemPrice = item.price; // This is the discounted price from frontend
            const itemTotal = itemPrice * item.quantity;
            calculatedTotal += itemTotal;

            console.log(`Item calculation: ${itemPrice} × ${item.quantity} = ${itemTotal} (using discounted price)`);

            orderItems.push({
                product: product._id,
                // Store complete product snapshot
                productTitle: product.title || product.name || 'Unknown Product',
                productImage: product.images && product.images.length > 0 ? product.images[0] : '/images/placeholder.jpg',
                productBrand: product.brand || 'Zeynix',
                size: item.size,
                quantity: item.quantity,
                price: itemPrice,
                totalPrice: itemTotal
            });
        }

        console.log(`Total calculation: Frontend sent ${totalAmount}, Backend calculated ${calculatedTotal}`);

        // Use frontend's total amount instead of recalculating
        // The frontend already calculates the correct total with discounts
        const finalTotalAmount = totalAmount;

        // Generate order number
        const now = new Date();
        const year = now.getFullYear().toString().slice(-2);
        const month = (now.getMonth() + 1).toString().padStart(2, '0');
        const day = now.getDate().toString().padStart(2, '0');

        // Count today's orders
        const todayOrders = await Order.countDocuments({
            createdAt: {
                $gte: new Date(now.getFullYear(), now.getMonth(), now.getDate()),
                $lt: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1)
            }
        });

        const orderCount = (todayOrders + 1).toString().padStart(3, '0');
        const orderNumber = `ZNX${year}${month}${day}${orderCount}`;

        // Create order
        const order = new Order({
            user: userId,
            orderNumber: orderNumber,
            items: orderItems,
            totalAmount: finalTotalAmount,
            deliveryAddress: {
                street: shippingAddress.addressLine1,
                city: shippingAddress.city,
                state: shippingAddress.state,
                pincode: shippingAddress.pincode
            },
            // Store complete shipping information
            shippingAddress: {
                firstName: shippingAddress.firstName,
                lastName: shippingAddress.lastName,
                phone: shippingAddress.phone,
                email: shippingAddress.email,
                addressLine1: shippingAddress.addressLine1,
                addressLine2: shippingAddress.addressLine2 || '',
                city: shippingAddress.city,
                state: shippingAddress.state,
                pincode: shippingAddress.pincode,
                country: shippingAddress.country || 'India'
            },
            status: 'pending',
            paymentStatus: 'pending',
            paymentMethod: 'razorpay',
            expectedDelivery: new Date(Date.now() + (45 * 60 * 1000)) // 45 minutes from now
        });

        await order.save();

        // Update product stock
        for (const item of items) {
            await Product.findByIdAndUpdate(
                item.productId,
                {
                    $inc: {
                        [`sizes.$[size].stock`]: -item.quantity
                    }
                },
                {
                    arrayFilters: [{ 'size.size': item.size }]
                }
            );
        }

        // Return success response
        res.status(201).json({
            success: true,
            message: 'Order created successfully',
            data: {
                id: order._id,
                orderNumber: order.orderNumber,
                totalAmount: order.totalAmount,
                status: order.status
            }
        });

    } catch (error) {
        console.error('Create order error:', error);
        console.error('Error stack:', error.stack);
        res.status(500).json({
            success: false,
            message: 'Internal server error creating order',
            error: error.message
        });
    }
});

// GET /api/orders - Get customer orders
router.get('/', async (req, res) => {
    try {
        // Get user ID from token (this should be set by auth middleware)
        const userId = req.user._id;

        if (!userId) {
            return res.status(401).json({
                success: false,
                message: 'Authentication required'
            });
        }

        // Get query parameters
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const status = req.query.status;

        // Build filter - only orders for this user
        const filter = { user: userId };
        if (status && status !== 'all') {
            filter.status = status;
        }

        // Execute query
        const orders = await Order.find(filter)
            .populate('items.product', 'title images')
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(limit);

        // Get total count
        const total = await Order.countDocuments(filter);

        res.status(200).json({
            success: true,
            data: {
                orders,
                pagination: {
                    page,
                    limit,
                    total,
                    pages: Math.ceil(total / limit)
                }
            }
        });

    } catch (error) {
        console.error('Get customer orders error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error getting customer orders'
        });
    }
});

// GET /api/orders/:id - Get customer order by ID
router.get('/:id', async (req, res) => {
    try {
        const userId = req.user._id;
        const { id } = req.params;

        if (!userId) {
            return res.status(401).json({
                success: false,
                message: 'Authentication required'
            });
        }

        const order = await Order.findById(id)
            .populate('items.product', 'title images');

        if (!order) {
            return res.status(404).json({
                success: false,
                message: 'Order not found'
            });
        }

        // Verify order belongs to this user
        if (order.user.toString() !== userId.toString()) {
            return res.status(403).json({
                success: false,
                message: 'Access denied'
            });
        }

        res.status(200).json({
            success: true,
            data: order
        });

    } catch (error) {
        console.error('Get customer order error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error getting customer order'
        });
    }
});

module.exports = router;
