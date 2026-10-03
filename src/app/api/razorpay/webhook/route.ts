import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import connectDB from '@/lib/config/database';
import { Order } from '@/lib/models/Order';
import env from '@/lib/config/env';

export async function POST(request: NextRequest) {
    try {
        const rawBody = await request.text();
        const signature = request.headers.get('x-razorpay-signature');

        const webhookSecret = env.RAZORPAY_WEBHOOK_SECRET;

        // If a webhook secret is configured, verify signature
        if (webhookSecret && signature) {
            const expectedSignature = crypto
                .createHmac('sha256', webhookSecret)
                .update(rawBody)
                .digest('hex');

            const isMatch = crypto.timingSafeEqual(
                Buffer.from(expectedSignature),
                Buffer.from(signature)
            );

            if (!isMatch) {
                console.error('❌ Razorpay webhook signature verification failed');
                return NextResponse.json(
                    { success: false, message: 'Invalid signature' },
                    { status: 400 }
                );
            }
        } else if (!signature) {
            console.warn('⚠️ Razorpay webhook received without x-razorpay-signature header');
        }

        const event = JSON.parse(rawBody);
        console.log(`🔔 Razorpay Webhook Event Received: ${event.event}`);

        await connectDB();

        // Handle payment.captured or order.paid
        if (event.event === 'payment.captured' || event.event === 'order.paid') {
            const paymentEntity = event.payload?.payment?.entity;
            const orderEntity = event.payload?.order?.entity;

            const razorpayOrderId = paymentEntity?.order_id || orderEntity?.id;
            const razorpayPaymentId = paymentEntity?.id;

            if (razorpayOrderId) {
                const order = await Order.findOne({ razorpayOrderId });

                if (order) {
                    order.paymentStatus = 'completed';
                    if (razorpayPaymentId) {
                        order.razorpayPaymentId = razorpayPaymentId;
                    }
                    if (order.status === 'pending') {
                        order.status = 'confirmed';
                    }
                    order.paymentMethod = 'razorpay';
                    await order.save();

                    console.log(`✅ Order ${order.orderNumber} successfully marked as completed via Razorpay webhook`);
                } else {
                    console.warn(`⚠️ Order with razorpayOrderId ${razorpayOrderId} not found in database`);
                }
            }
        } else if (event.event === 'payment.failed') {
            const paymentEntity = event.payload?.payment?.entity;
            const razorpayOrderId = paymentEntity?.order_id;
            const razorpayPaymentId = paymentEntity?.id;

            if (razorpayOrderId) {
                const order = await Order.findOne({ razorpayOrderId });
                if (order && order.paymentStatus !== 'completed') {
                    order.paymentStatus = 'failed';
                    if (razorpayPaymentId) {
                        order.razorpayPaymentId = razorpayPaymentId;
                    }
                    await order.save();
                    console.log(`⚠️ Order ${order.orderNumber} marked as failed via Razorpay webhook`);
                }
            }
        }

        return NextResponse.json({ status: 'ok', received: true });
    } catch (error) {
        console.error('Razorpay webhook handler error:', error);
        return NextResponse.json(
            { success: false, message: 'Internal server error processing webhook' },
            { status: 500 }
        );
    }
}
