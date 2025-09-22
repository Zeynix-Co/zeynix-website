import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/config/database';
import { Order } from '@/lib/models/Order';
import { protect } from '@/lib/middleware/auth';

export async function GET(request: NextRequest) {
    try {
        // Authenticate user
        const authResult = await protect(request);
        if (!authResult.user) {
            return NextResponse.json(
                { success: false, message: 'Authentication required' },
                { status: 401 }
            );
        }

        const { searchParams } = new URL(request.url);
        const orderId = searchParams.get('orderId');

        if (!orderId) {
            return NextResponse.json(
                { success: false, message: 'Order ID is required' },
                { status: 400 }
            );
        }

        // Connect to database
        await connectDB();

        // Find the order
        const order = await Order.findOne({
            orderNumber: orderId,
            user: authResult.user._id
        });

        if (!order) {
            return NextResponse.json(
                { success: false, message: 'Order not found' },
                { status: 404 }
            );
        }

        // Return order payment status
        return NextResponse.json({
            success: true,
            data: {
                orderId: order.orderNumber,
                paymentStatus: order.paymentStatus,
                orderStatus: order.status,
                amount: order.totalAmount,
                transactionId: order.razorpayOrderId, // Reusing field for Paytm transaction ID
                paymentMethod: order.paymentMethod,
                createdAt: order.createdAt,
                updatedAt: order.updatedAt
            }
        });

    } catch (error) {
        console.error('Payment status check error:', error);
        return NextResponse.json(
            {
                success: false,
                message: 'Failed to check payment status',
                error: process.env.NODE_ENV === 'development' ? (error instanceof Error ? error.message : String(error)) : undefined
            },
            { status: 500 }
        );
    }
}
