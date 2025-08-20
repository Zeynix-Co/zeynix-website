import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import { User } from '@/lib/models/User';
import { Order } from '@/lib/models/Order';
import env from '@/lib/config/env';

// Connect to MongoDB
const connectDB = async () => {
    try {
        if (mongoose.connection.readyState === 1) {
            return; // Already connected
        }

        await mongoose.connect(env.MONGODB_URI);
        console.log('✅ MongoDB Connected for Admin Order Status');
    } catch (error) {
        console.error('❌ MongoDB connection failed for Admin Order Status:', error);
        throw error;
    }
};

// PATCH /api/admin/orders/[id]/status - Update order status
export async function PATCH(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        await connectDB();

        const body = await request.json();
        const { userId, status } = body;
        const resolvedParams = await params;
        const orderId = resolvedParams.id;

        // Validate input
        if (!userId || !orderId || !status) {
            return NextResponse.json(
                {
                    success: false,
                    message: 'User ID, Order ID, and status are required'
                },
                { status: 400 }
            );
        }

        // Validate status value
        const validStatuses = ['pending', 'confirmed', 'delivered', 'cancelled'];
        if (!validStatuses.includes(status)) {
            return NextResponse.json(
                {
                    success: false,
                    message: `Invalid status. Must be one of: ${validStatuses.join(', ')}`
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

        // Find the order first to check current status
        const existingOrder = await Order.findById(orderId);
        if (!existingOrder) {
            return NextResponse.json(
                {
                    success: false,
                    message: 'Order not found'
                },
                { status: 404 }
            );
        }

        // Validate status transition (optional business logic)
        const currentStatus = existingOrder.status;
        const statusTransitions: Record<string, string[]> = {
            'pending': ['confirmed', 'cancelled'],
            'confirmed': ['delivered', 'cancelled'],
            'delivered': [], // Final state
            'cancelled': [] // Final state
        };

        if (currentStatus !== status && statusTransitions[currentStatus] && !statusTransitions[currentStatus].includes(status)) {
            return NextResponse.json(
                {
                    success: false,
                    message: `Cannot change status from ${currentStatus} to ${status}`
                },
                { status: 400 }
            );
        }

        // Update the order status
        const updatedOrder = await Order.findByIdAndUpdate(
            orderId,
            {
                status,
                updatedAt: new Date(),
                // If cancelled, also set isActive to false
                ...(status === 'cancelled' && { isActive: false })
            },
            { new: true, runValidators: true }
        )
            .populate('user', 'name email')
            .populate('items.product', 'title images');

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
            message: `Order status updated to ${status} successfully`,
            data: {
                order: {
                    _id: updatedOrder._id.toString(),
                    orderNumber: updatedOrder.orderNumber,
                    user: updatedOrder.user,
                    status: updatedOrder.status,
                    totalAmount: updatedOrder.totalAmount,
                    itemCount: updatedOrder.itemCount,
                    isActive: updatedOrder.isActive,
                    updatedAt: updatedOrder.updatedAt
                }
            }
        });

    } catch (error) {
        console.error('Admin order status update error:', error);
        return NextResponse.json(
            {
                success: false,
                message: 'Internal server error updating order status'
            },
            { status: 500 }
        );
    }
}
