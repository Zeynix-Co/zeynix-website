import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import connectDB from '@/lib/config/database';
import { Order } from '@/lib/models/Order';
import env from '@/lib/config/env';
import { sendAdminNewOrderNotification } from '@/lib/config/email';

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
                    const wasPending = order.paymentStatus === 'pending';
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

                    if (wasPending) {
                        try {
                            const shipping: any = order.shippingAddress || {};
                            const customerName = `${shipping.firstName || ''} ${shipping.lastName || ''}`.trim() || 'Valued Client';
                            const orderItems = Array.isArray(order.items) ? order.items.map((item: any) => ({
                                title: item.productTitle || 'Boutique Item',
                                size: item.size || 'Standard',
                                quantity: item.quantity || 1,
                                price: item.price || 0,
                            })) : [];

                            sendAdminNewOrderNotification({
                                orderNumber: order.orderNumber,
                                orderId: order._id.toString(),
                                totalAmount: order.totalAmount,
                                paymentMethod: 'Razorpay',
                                paymentStatus: 'completed',
                                customerName,
                                customerEmail: shipping.email,
                                customerPhone: shipping.phone,
                                shippingAddress: {
                                    addressLine1: shipping.addressLine1 || order.deliveryAddress?.street || 'N/A',
                                    addressLine2: shipping.addressLine2,
                                    city: shipping.city || order.deliveryAddress?.city || 'N/A',
                                    state: shipping.state || order.deliveryAddress?.state || 'N/A',
                                    pincode: shipping.pincode || order.deliveryAddress?.pincode || 'N/A',
                                    country: shipping.country || 'India',
                                },
                                items: orderItems,
                            }).catch(err => console.error('Webhook admin alert error:', err));
                        } catch (e) {
                            console.error('Failed to notify admin from webhook:', e);
                        }
                    }
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
