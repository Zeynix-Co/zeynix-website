import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import { User } from '@/lib/models/User';
import { Order } from '@/lib/models/Order';
import env from '@/lib/config/env';

// Interface for order items
interface OrderItem {
    _id?: string;
    product: {
        _id: string;
        title: string;
        images: string[];
        actualPrice: number;
        brand?: string;
        category?: string;
    };
    size: string;
    quantity: number;
    price: number;
    totalPrice: number;
}

// Connect to MongoDB
const connectDB = async () => {
    try {
        if (mongoose.connection.readyState === 1) {
            return; // Already connected
        }

        await mongoose.connect(env.MONGODB_URI);
        console.log('✅ MongoDB Connected for Admin Orders');
    } catch (error) {
        console.error('❌ MongoDB connection failed for Admin Orders:', error);
        throw error;
    }
};

// GET /api/admin/orders - Get all orders with pagination, filtering, and search
export async function GET(request: NextRequest) {
    try {
        await connectDB();

        const { searchParams } = new URL(request.url);
        const userId = searchParams.get('userId');
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '10');
        const status = searchParams.get('status');
        const paymentStatus = searchParams.get('paymentStatus');
        const search = searchParams.get('search');
        const sortBy = searchParams.get('sortBy') || 'createdAt';
        const sortOrder = searchParams.get('sortOrder') || 'desc';

        // Validate input
        if (!userId) {
            return NextResponse.json(
                {
                    success: false,
                    message: 'User ID is required'
                },
                { status: 400 }
            );
        }

        // Verify user is admin
        const adminUser = await User.findOne({ _id: userId, role: 'admin' });
        if (!adminUser) {
            return NextResponse.json(
                {
                    success: false,
                    message: 'Unauthorized access'
                },
                { status: 401 }
            );
        }

        // Build filter object
        const filter: Record<string, string | object | boolean> = { isActive: true };

        if (status && status !== 'all') {
            filter.status = status;
        }

        if (paymentStatus && paymentStatus !== 'all') {
            filter.paymentStatus = paymentStatus;
        }

        if (search && search.trim()) {
            filter.$or = [
                { orderNumber: { $regex: search, $options: 'i' } },
                { 'deliveryAddress.city': { $regex: search, $options: 'i' } },
                { 'deliveryAddress.state': { $regex: search, $options: 'i' } }
            ];
        }

        // Build sort object
        const sort: Record<string, 1 | -1> = {};
        sort[sortBy] = sortOrder === 'asc' ? 1 : -1;

        // Calculate pagination
        const skip = (page - 1) * limit;

        // Fetch orders with pagination
        const [orders, total] = await Promise.all([
            Order.find(filter)
                .sort(sort)
                .skip(skip)
                .limit(limit)
                .populate('user', 'name email')
                .populate('items.product', 'title images actualPrice')
                .select('-__v'),
            Order.countDocuments(filter)
        ]);

        // Calculate pagination info
        const totalPages = Math.ceil(total / limit);
        const hasNext = page < totalPages;
        const hasPrev = page > 1;

        return NextResponse.json({
            success: true,
            message: 'Orders fetched successfully',
            data: {
                orders: orders.map(order => ({
                    _id: order._id.toString(),
                    orderNumber: order.orderNumber,
                    user: order.user,
                    items: order.items.map((item: OrderItem) => ({
                        _id: item._id?.toString(),
                        product: item.product,
                        size: item.size,
                        quantity: item.quantity,
                        price: item.price,
                        totalPrice: item.totalPrice
                    })),
                    status: order.status,
                    totalAmount: order.totalAmount,
                    deliveryAddress: order.deliveryAddress,
                    deliveryInstructions: order.deliveryInstructions,
                    expectedDelivery: order.expectedDelivery,
                    paymentMethod: order.paymentMethod,
                    paymentStatus: order.paymentStatus,
                    razorpayOrderId: order.razorpayOrderId,
                    razorpayPaymentId: order.razorpayPaymentId,
                    itemCount: order.itemCount,
                    createdAt: order.createdAt,
                    updatedAt: order.updatedAt
                })),
                pagination: {
                    currentPage: page,
                    totalPages,
                    totalOrders: total,
                    hasNext,
                    hasPrev,
                    limit
                }
            }
        });

    } catch (error) {
        console.error('Admin orders fetch error:', error);
        return NextResponse.json(
            {
                success: false,
                message: 'Internal server error fetching orders'
            },
            { status: 500 }
        );
    }
}

// POST /api/admin/orders - Create new order (if needed for admin)
export async function POST(request: NextRequest) {
    try {
        await connectDB();

        const body = await request.json();
        const { userId, orderData } = body;

        // Validate input
        if (!userId || !orderData) {
            return NextResponse.json(
                {
                    success: false,
                    message: 'User ID and order data are required'
                },
                { status: 400 }
            );
        }

        // Verify user is admin
        const adminUser = await User.findOne({ _id: userId, role: 'admin' });
        if (!adminUser) {
            return NextResponse.json(
                {
                    success: false,
                    message: 'Unauthorized access'
                },
                { status: 401 }
            );
        }

        // Create new order
        const newOrder = new Order(orderData);
        await newOrder.save();

        // Populate the created order
        await newOrder.populate('user', 'name email');
        await newOrder.populate('items.product', 'title images actualPrice');

        return NextResponse.json({
            success: true,
            message: 'Order created successfully',
            data: {
                order: {
                    _id: newOrder._id.toString(),
                    orderNumber: newOrder.orderNumber,
                    user: newOrder.user,
                    items: newOrder.items,
                    status: newOrder.status,
                    totalAmount: newOrder.totalAmount,
                    deliveryAddress: newOrder.deliveryAddress,
                    deliveryInstructions: newOrder.deliveryInstructions,
                    expectedDelivery: newOrder.expectedDelivery,
                    paymentMethod: newOrder.paymentMethod,
                    paymentStatus: newOrder.paymentStatus,
                    itemCount: newOrder.itemCount,
                    createdAt: newOrder.createdAt,
                    updatedAt: newOrder.updatedAt
                }
            }
        });

    } catch (error) {
        console.error('Admin order creation error:', error);
        return NextResponse.json(
            {
                success: false,
                message: 'Internal server error creating order'
            },
            { status: 500 }
        );
    }
}
