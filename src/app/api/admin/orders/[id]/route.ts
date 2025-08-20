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
        console.log('✅ MongoDB Connected for Admin Order Details');
    } catch (error) {
        console.error('❌ MongoDB connection failed for Admin Order Details:', error);
        throw error;
    }
};

// GET /api/admin/orders/[id] - Get single order details
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        await connectDB();

        const { searchParams } = new URL(request.url);
        const userId = searchParams.get('userId');
        const resolvedParams = await params;
        const orderId = resolvedParams.id;

        // Validate input
        if (!userId || !orderId) {
            return NextResponse.json(
                {
                    success: false,
                    message: 'User ID and Order ID are required'
                },
                { status: 400 }
            );
        }

        // Validate ObjectId format
        if (!mongoose.Types.ObjectId.isValid(orderId)) {
            return NextResponse.json(
                {
                    success: false,
                    message: 'Invalid order ID format'
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

        // Find the order
        const order = await Order.findById(orderId)
            .populate('user', 'name email phone')
            .populate('items.product', 'title images actualPrice brand category')
            .select('-__v');

        if (!order) {
            return NextResponse.json(
                {
                    success: false,
                    message: 'Order not found'
                },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            message: 'Order details fetched successfully',
            data: {
                order: {
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
                    isActive: order.isActive,
                    createdAt: order.createdAt,
                    updatedAt: order.updatedAt
                }
            }
        });

    } catch (error) {
        console.error('Admin order details fetch error:', error);
        return NextResponse.json(
            {
                success: false,
                message: 'Internal server error fetching order details'
            },
            { status: 500 }
        );
    }
}

// PUT /api/admin/orders/[id] - Update order details
export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        await connectDB();

        const body = await request.json();
        const { userId, updateData } = body;
        const resolvedParams = await params;
        const orderId = resolvedParams.id;

        // Validate input
        if (!userId || !orderId || !updateData) {
            return NextResponse.json(
                {
                    success: false,
                    message: 'User ID, Order ID, and update data are required'
                },
                { status: 400 }
            );
        }

        // Validate ObjectId format
        if (!mongoose.Types.ObjectId.isValid(orderId)) {
            return NextResponse.json(
                {
                    success: false,
                    message: 'Invalid order ID format'
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

        // Find and update the order
        const updatedOrder = await Order.findByIdAndUpdate(
            orderId,
            { ...updateData, updatedAt: new Date() },
            { new: true, runValidators: true }
        )
            .populate('user', 'name email phone')
            .populate('items.product', 'title images actualPrice brand category');

        if (!updatedOrder) {
            return NextResponse.json(
                {
                    success: false,
                    message: 'Order not found'
                },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            message: 'Order updated successfully',
            data: {
                order: {
                    _id: updatedOrder._id.toString(),
                    orderNumber: updatedOrder.orderNumber,
                    user: updatedOrder.user,
                    items: updatedOrder.items.map((item: OrderItem) => ({
                        _id: item._id?.toString(),
                        product: item.product,
                        size: item.size,
                        quantity: item.quantity,
                        price: item.price,
                        totalPrice: item.totalPrice
                    })),
                    status: updatedOrder.status,
                    totalAmount: updatedOrder.totalAmount,
                    deliveryAddress: updatedOrder.deliveryAddress,
                    deliveryInstructions: updatedOrder.deliveryInstructions,
                    expectedDelivery: updatedOrder.expectedDelivery,
                    paymentMethod: updatedOrder.paymentMethod,
                    paymentStatus: updatedOrder.paymentStatus,
                    razorpayOrderId: updatedOrder.razorpayOrderId,
                    razorpayPaymentId: updatedOrder.razorpayPaymentId,
                    itemCount: updatedOrder.itemCount,
                    isActive: updatedOrder.isActive,
                    createdAt: updatedOrder.createdAt,
                    updatedAt: updatedOrder.updatedAt
                }
            }
        });

    } catch (error) {
        console.error('Admin order update error:', error);
        return NextResponse.json(
            {
                success: false,
                message: 'Internal server error updating order'
            },
            { status: 500 }
        );
    }
}

// DELETE /api/admin/orders/[id] - Soft delete order (set isActive to false)
export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        await connectDB();

        const body = await request.json();
        const { userId } = body;
        const resolvedParams = await params;
        const orderId = resolvedParams.id;

        // Validate input
        if (!userId || !orderId) {
            return NextResponse.json(
                {
                    success: false,
                    message: 'User ID and Order ID are required'
                },
                { status: 400 }
            );
        }

        // Validate ObjectId format
        if (!mongoose.Types.ObjectId.isValid(orderId)) {
            return NextResponse.json(
                {
                    success: false,
                    message: 'Invalid order ID format'
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

        // Soft delete the order
        const deletedOrder = await Order.findByIdAndUpdate(
            orderId,
            { isActive: false, updatedAt: new Date() },
            { new: true }
        );

        if (!deletedOrder) {
            return NextResponse.json(
                {
                    success: false,
                    message: 'Order not found'
                },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            message: 'Order deleted successfully',
            data: {
                orderId: deletedOrder._id.toString(),
                orderNumber: deletedOrder.orderNumber
            }
        });

    } catch (error) {
        console.error('Admin order delete error:', error);
        return NextResponse.json(
            {
                success: false,
                message: 'Internal server error deleting order'
            },
            { status: 500 }
        );
    }
}
