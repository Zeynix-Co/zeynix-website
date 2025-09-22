import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/config/database';
import { Order } from '@/lib/models/Order';
import { User } from '@/lib/models/User';
import { protect } from '@/lib/middleware/auth';
import { createPaymentParams, generateOrderId, formatAmountForPaytm } from '@/lib/utils/paytm-simple';
import { getPaytmConfig } from '@/lib/config/paytm';

export async function POST(request: NextRequest) {
    try {
        // Authenticate user
        const authResult = await protect(request);
        if (!authResult.user) {
            return NextResponse.json(
                { success: false, message: 'Authentication required' },
                { status: 401 }
            );
        }

        const { orderId } = await request.json();

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
            _id: orderId,
            user: authResult.user._id
        });

        if (!order) {
            return NextResponse.json(
                { success: false, message: 'Order not found' },
                { status: 404 }
            );
        }

        // Check if order is already paid
        if (order.paymentStatus === 'completed') {
            return NextResponse.json(
                { success: false, message: 'Order is already paid' },
                { status: 400 }
            );
        }

        // Get user details
        const user = await User.findById(authResult.user._id);
        if (!user) {
            return NextResponse.json(
                { success: false, message: 'User not found' },
                { status: 404 }
            );
        }

        // Get Paytm configuration
        const config = getPaytmConfig();

        // Create payment parameters
        const paymentParams = createPaymentParams({
            orderId: order.orderNumber,
            amount: parseFloat(formatAmountForPaytm(order.totalAmount)),
            customerId: user._id.toString(),
            customerEmail: user.email,
            customerMobile: user.phone || '9999999999', // Default phone if not available
            orderDetails: `Order for ${order.items.length} items`,
        });

        // Add Paytm-specific parameters
        const paytmParams = {
            ...paymentParams,
            MERC_UNQ_REF: order._id.toString(),
            PAYMENT_MODE_ONLY: 'YES',
            AUTH_MODE: 'USRPWD',
            PAYMENT_TYPE_ID: 'UPI',
        };

        // Return payment parameters for frontend
        return NextResponse.json({
            success: true,
            data: {
                orderId: order.orderNumber,
                amount: order.totalAmount,
                paymentParams: paytmParams,
                paytmConfig: {
                    mid: config.MID,
                    txnUrl: config.TXN_URL,
                    callbackUrl: config.CALLBACK_URL,
                },
                message: 'Payment order created successfully'
            }
        });

    } catch (error) {
        console.error('Create payment order error:', error);
        return NextResponse.json(
            {
                success: false,
                message: 'Failed to create payment order',
                error: process.env.NODE_ENV === 'development' ? (error instanceof Error ? error.message : String(error)) : undefined
            },
            { status: 500 }
        );
    }
}
