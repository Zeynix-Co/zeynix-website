const Order = require('../models/Order');
const User = require('../models/User');

// @desc    Get all orders with filters and pagination
// @route   GET /api/admin/orders
// @access  Private (Admin only)
const getAllOrders = async (req, res) => {
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

        // Get orders with pagination and filters
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const status = req.query.status;
        const paymentStatus = req.query.paymentStatus;
        const search = req.query.search;

        // Build filter
        const filter = {};
        if (status && status !== 'all') filter.status = status;
        if (paymentStatus && paymentStatus !== 'all') filter.paymentStatus = paymentStatus;
        if (search) {
            filter.$or = [
                { orderNumber: { $regex: search, $options: 'i' } },
                { 'user.name': { $regex: search, $options: 'i' } },
                { 'user.email': { $regex: search, $options: 'i' } }
            ];
        }

        // Execute query
        const orders = await Order.find(filter)
            .populate('user', 'name email phone')
            .populate('items.product', 'title images discountedPrice')
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
        console.error('Get orders error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error getting orders'
        });
    }
};

// @desc    Get a specific order by ID
// @route   GET /api/admin/orders/:id
// @access  Private (Admin only)
const getOrder = async (req, res) => {
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

        const order = await Order.findById(id)
            .populate('user', 'name email phone')
            .populate('items.product', 'title images discountedPrice originalPrice');

        if (!order) {
            return res.status(404).json({
                success: false,
                message: 'Order not found'
            });
        }

        res.status(200).json({
            success: true,
            data: order
        });

    } catch (error) {
        console.error('Get order error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error getting order'
        });
    }
};

// @desc    Update order status
// @route   PATCH /api/admin/orders/:id/status
// @access  Private (Admin only)
const updateOrderStatus = async (req, res) => {
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
        const validStatuses = ['pending', 'confirmed', 'delivered', 'cancelled'];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid status. Must be pending, confirmed, delivered, or cancelled'
            });
        }

        // Check if order exists
        const existingOrder = await Order.findById(id);
        if (!existingOrder) {
            return res.status(404).json({
                success: false,
                message: 'Order not found'
            });
        }

        // Update order status
        const updatedOrder = await Order.findByIdAndUpdate(
            id,
            { status },
            { new: true }
        ).populate('user', 'name email phone')
            .populate('items.product', 'title images discountedPrice');

        res.status(200).json({
            success: true,
            message: `Order status updated to ${status}`,
            data: updatedOrder
        });

    } catch (error) {
        console.error('Update order status error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error during status update'
        });
    }
};

module.exports = {
    getAllOrders,
    getOrder,
    updateOrderStatus
};
