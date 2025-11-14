import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/config/database';
import { Order } from '@/lib/models/Order';
import { User } from '@/lib/models/User';
import { Product } from '@/lib/models/Product';
import { protect } from '@/lib/middleware/auth';
import { createRazorpayOrder } from '@/lib/utils/razorpay';
import { getRazorpayConfig } from '@/lib/config/razorpay';

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

        // Find the order by MongoDB _id
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

        // Calculate amount from discountPrice by fetching products from backend
        let totalAmountFromDiscountPrice = 0;
        for (const orderItem of order.items) {
            const product = await Product.findById(orderItem.product);
            if (!product) {
                return NextResponse.json(
                    { success: false, message: `Product ${orderItem.product} not found` },
                    { status: 404 }
                );
            }

            // Use discountPrice if available, otherwise use actualPrice
            const itemPrice = product.discountPrice || product.actualPrice;
            totalAmountFromDiscountPrice += itemPrice * orderItem.quantity;
        }

        // Create Razorpay order using discountPrice amount
        const razorpayOrderResult = await createRazorpayOrder({
            amount: totalAmountFromDiscountPrice, // Amount in rupees (calculated from discountPrice)
            orderId: order.orderNumber || order._id.toString(), // Use orderNumber or _id as receipt
            customerId: user._id.toString(),
            customerEmail: user.email,
            customerMobile: user.phone || '9999999999', // Default phone if not available
            orderNotes: {
                order_number: order.orderNumber || order._id.toString(),
                items_count: order.items.length.toString(),
                customer_name: user.name || '',
            },
        });

        if (!razorpayOrderResult.success || !razorpayOrderResult.order) {
            return NextResponse.json(
                {
                    success: false,
                    message: 'Failed to create Razorpay order',
                    error: razorpayOrderResult.error || 'Unknown error',
                },
                { status: 500 }
            );
        }

        // Get Razorpay configuration
        const config = getRazorpayConfig();

        // Store Razorpay order ID in the order (optional, for reference)
        // We'll update it later when payment is verified
        order.razorpayOrderId = razorpayOrderResult.order.id;
        await order.save();

        // Return Razorpay order details for frontend
        return NextResponse.json({
            success: true,
            data: {
                orderId: order.orderNumber || order._id.toString(), // Your order ID
                amount: totalAmountFromDiscountPrice, // Amount in rupees (calculated from discountPrice)
                razorpayOrderId: razorpayOrderResult.order.id, // Razorpay order ID
                razorpayAmount: razorpayOrderResult.order.amount, // Amount in paise from Razorpay (use this)
                key: config.KEY_ID, // Razorpay key ID for frontend
                currency: razorpayOrderResult.order.currency,
                receipt: razorpayOrderResult.order.receipt,
            },
            message: 'Razorpay order created successfully'
        });

    } catch (error) {
        console.error('Create Razorpay order error:', error);
        return NextResponse.json(
            {
                success: false,
                message: 'Failed to create Razorpay order',
                error: process.env.NODE_ENV === 'development' ? (error instanceof Error ? error.message : String(error)) : undefined
            },
            { status: 500 }
        );
    }
}

