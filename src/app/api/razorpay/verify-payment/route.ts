import { NextRequest, NextResponse } from 'next/server';
import { protect } from '@/lib/middleware/auth';
import { verifyAndUpdateOrderPayment, validatePaymentData } from '@/lib/utils/razorpay';

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

        const body = await request.json();
        const {
            razorpayOrderId,
            razorpayPaymentId,
            razorpaySignature,
            orderId, // Your order number
        } = body;

        // Validate payment data
        if (!validatePaymentData({ razorpayOrderId, razorpayPaymentId, razorpaySignature, orderId })) {
            return NextResponse.json(
                {
                    success: false,
                    message: 'Invalid payment data: Missing required fields',
                },
                { status: 400 }
            );
        }

        // Verify payment and update order status
        const verificationResult = await verifyAndUpdateOrderPayment({
            razorpayOrderId,
            razorpayPaymentId,
            razorpaySignature,
            orderId,
        });

        if (!verificationResult.success) {
            return NextResponse.json(
                {
                    success: false,
                    message: verificationResult.error || 'Payment verification failed',
                    isValid: verificationResult.isValid || false,
                },
                { status: 400 }
            );
        }

        // Determine redirect URL based on payment status
        const redirectUrl = verificationResult.isValid
            ? `/payment/success?orderId=${orderId}&razorpayOrderId=${razorpayOrderId}&razorpayPaymentId=${razorpayPaymentId}`
            : `/payment/failure?orderId=${orderId}&error=${encodeURIComponent(verificationResult.error || 'Payment verification failed')}`;

        // Return success response
        return NextResponse.json({
            success: true,
            data: {
                orderId,
                razorpayOrderId,
                razorpayPaymentId,
                isValid: verificationResult.isValid,
                order: verificationResult.order,
                redirectUrl,
            },
            message: 'Payment verified successfully'
        });

    } catch (error) {
        console.error('Payment verification error:', error);
        return NextResponse.json(
            {
                success: false,
                message: 'Payment verification processing failed',
                error: process.env.NODE_ENV === 'development' ? (error instanceof Error ? error.message : String(error)) : undefined
            },
            { status: 500 }
        );
    }
}

// Also support GET request for status check (optional)
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

        // Import here to avoid circular dependencies
        const { default: connectDB } = await import('@/lib/config/database');
        const { Order } = await import('@/lib/models/Order');

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
                razorpayOrderId: order.razorpayOrderId,
                razorpayPaymentId: order.razorpayPaymentId,
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

