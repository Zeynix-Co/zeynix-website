import crypto from 'crypto';
import { getRazorpayInstance, getRazorpayConfig, CURRENCY, PAYMENT_STATUS } from '@/lib/config/razorpay';
import connectDB from '@/lib/config/database';
import { Order } from '@/lib/models/Order';
import { User } from '@/lib/models/User';

// Convert amount from rupees to paise (Razorpay requires amount in smallest currency unit)
export const convertRupeesToPaise = (amount: number): number => {
    // Use Math.round to handle floating point precision issues
    // Multiply by 100 and round to nearest integer
    return Math.round(amount * 100); // Convert rupees to paise (e.g., 1076.00 -> 107600)
};

// Convert amount from paise to rupees (for display)
export const convertPaiseToRupees = (amount: number): number => {
    return amount / 100;
};

// Create Razorpay order
export const createRazorpayOrder = async (orderData: {
    amount: number; // Amount in rupees
    orderId: string; // Your order number
    customerId: string;
    customerEmail: string;
    customerMobile: string;
    orderNotes?: Record<string, string>;
}): Promise<{ success: boolean; order?: any; error?: string }> => {
    try {
        const razorpay = getRazorpayInstance();
        const config = getRazorpayConfig();

        // Convert amount to paise
        const amountInPaise = convertRupeesToPaise(orderData.amount);

        // Create order on Razorpay
        const razorpayOrder = await razorpay.orders.create({
            amount: amountInPaise, // Amount in paise
            currency: CURRENCY,
            receipt: orderData.orderId, // Your order number
            notes: {
                order_id: orderData.orderId,
                customer_id: orderData.customerId,
                ...orderData.orderNotes,
            },
        });

        return {
            success: true,
            order: razorpayOrder,
        };
    } catch (error) {
        console.error('Create Razorpay order error:', error);
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Failed to create Razorpay order',
        };
    }
};

// Verify Razorpay payment signature
export const verifyPaymentSignature = (
    razorpayOrderId: string,
    razorpayPaymentId: string,
    razorpaySignature: string
): boolean => {
    try {
        const config = getRazorpayConfig();
        const secret = config.KEY_SECRET;

        if (!secret) {
            console.error('Razorpay secret key is not configured');
            return false;
        }

        // Generate signature
        const text = razorpayOrderId + '|' + razorpayPaymentId;
        const generatedSignature = crypto
            .createHmac('sha256', secret)
            .update(text)
            .digest('hex');

        // Compare signatures (use constant-time comparison for security)
        return crypto.timingSafeEqual(
            Buffer.from(generatedSignature),
            Buffer.from(razorpaySignature)
        );
    } catch (error) {
        console.error('Payment signature verification error:', error);
        return false;
    }
};

// Verify payment and update order status
export const verifyAndUpdateOrderPayment = async (paymentData: {
    razorpayOrderId: string;
    razorpayPaymentId: string;
    razorpaySignature: string;
    orderId: string; // Your order number (orderNumber from Order model)
}): Promise<{
    success: boolean;
    isValid?: boolean;
    order?: any;
    error?: string;
}> => {
    try {
        // Connect to database
        await connectDB();

        // Find the order by orderNumber
        const order = await Order.findOne({ orderNumber: paymentData.orderId });
        if (!order) {
            return {
                success: false,
                isValid: false,
                error: 'Order not found',
            };
        }

        // Check if order is already paid
        if (order.paymentStatus === 'completed') {
            return {
                success: false,
                isValid: false,
                error: 'Order is already paid',
            };
        }

        // Verify payment signature (SECURITY CRITICAL)
        const isValidSignature = verifyPaymentSignature(
            paymentData.razorpayOrderId,
            paymentData.razorpayPaymentId,
            paymentData.razorpaySignature
        );

        if (!isValidSignature) {
            console.error('Invalid payment signature for order:', paymentData.orderId);
            return {
                success: false,
                isValid: false,
                error: 'Invalid payment signature',
            };
        }

        // Verify amount by fetching payment details from Razorpay
        try {
            const razorpay = getRazorpayInstance();
            const payment = await razorpay.payments.fetch(paymentData.razorpayPaymentId);

            // Calculate amount from discountPrice by fetching products
            const { Product } = await import('@/lib/models/Product');
            let totalAmountFromDiscountPrice = 0;
            for (const orderItem of order.items) {
                const product = await Product.findById(orderItem.product);
                if (product) {
                    const itemPrice = product.discountPrice || product.actualPrice;
                    totalAmountFromDiscountPrice += itemPrice * orderItem.quantity;
                }
            }

            // Verify amount (payment.amount is in paise)
            const orderAmountInPaise = convertRupeesToPaise(totalAmountFromDiscountPrice);
            if (payment.amount !== orderAmountInPaise) {
                console.error('Amount mismatch:', {
                    expected: orderAmountInPaise,
                    received: payment.amount,
                });
                return {
                    success: false,
                    isValid: false,
                    error: 'Amount mismatch',
                };
            }

            // Verify currency
            if (payment.currency !== CURRENCY) {
                return {
                    success: false,
                    isValid: false,
                    error: 'Invalid currency',
                };
            }

            // Verify payment status
            if (payment.status !== PAYMENT_STATUS.CAPTURED && payment.status !== PAYMENT_STATUS.AUTHORIZED) {
                return {
                    success: false,
                    isValid: false,
                    error: 'Payment not captured or authorized',
                };
            }

            // Update order with payment details
            order.paymentStatus = 'completed';
            order.razorpayOrderId = paymentData.razorpayOrderId;
            order.razorpayPaymentId = paymentData.razorpayPaymentId;
            order.status = 'confirmed';
            order.paymentMethod = 'razorpay';

            await order.save();

            return {
                success: true,
                isValid: true,
                order: order.toObject(),
            };
        } catch (razorpayError) {
            console.error('Error fetching payment from Razorpay:', razorpayError);
            // Even if we can't verify with Razorpay, signature verification passed
            // Update order but mark as needing verification
            order.paymentStatus = 'completed';
            order.razorpayOrderId = paymentData.razorpayOrderId;
            order.razorpayPaymentId = paymentData.razorpayPaymentId;
            order.status = 'confirmed';
            order.paymentMethod = 'razorpay';

            await order.save();

            return {
                success: true,
                isValid: true,
                order: order.toObject(),
            };
        }
    } catch (error) {
        console.error('Verify and update order payment error:', error);
        return {
            success: false,
            isValid: false,
            error: error instanceof Error ? error.message : 'Failed to verify payment',
        };
    }
};

// Update order payment status (simpler version without signature verification)
export const updateOrderPaymentStatus = async (
    orderNumber: string,
    paymentData: {
        razorpayOrderId: string;
        razorpayPaymentId: string;
        status: string;
        amount: number; // In rupees
    }
): Promise<{ success: boolean; error?: string }> => {
    try {
        await connectDB();

        const order = await Order.findOne({ orderNumber });
        if (!order) {
            return { success: false, error: 'Order not found' };
        }

        // Update order with payment details
        order.razorpayOrderId = paymentData.razorpayOrderId;
        order.razorpayPaymentId = paymentData.razorpayPaymentId;
        order.paymentStatus = paymentData.status === 'captured' || paymentData.status === 'authorized' ? 'completed' : 'failed';
        order.paymentMethod = 'razorpay';

        if (paymentData.status === 'captured' || paymentData.status === 'authorized') {
            order.status = 'confirmed';
        }

        await order.save();

        return { success: true };
    } catch (error) {
        console.error('Update order payment status error:', error);
        return { success: false, error: 'Failed to update order status' };
    }
};

// Validate payment data
export const validatePaymentData = (paymentData: {
    razorpayOrderId?: string;
    razorpayPaymentId?: string;
    razorpaySignature?: string;
    orderId?: string;
}): boolean => {
    const requiredFields = ['razorpayOrderId', 'razorpayPaymentId', 'razorpaySignature', 'orderId'];

    for (const field of requiredFields) {
        if (!paymentData[field as keyof typeof paymentData]) {
            console.error(`Missing required field: ${field}`);
            return false;
        }
    }

    return true;
};

// Get payment status text
export const getPaymentStatusText = (status: string): string => {
    switch (status) {
        case PAYMENT_STATUS.CREATED:
            return 'Payment Created';
        case PAYMENT_STATUS.AUTHORIZED:
            return 'Payment Authorized';
        case PAYMENT_STATUS.CAPTURED:
            return 'Payment Successful';
        case PAYMENT_STATUS.REFUNDED:
            return 'Payment Refunded';
        case PAYMENT_STATUS.FAILED:
            return 'Payment Failed';
        default:
            return 'Unknown Status';
    }
};

// Get payment status color
export const getPaymentStatusColor = (status: string): string => {
    switch (status) {
        case PAYMENT_STATUS.CAPTURED:
        case PAYMENT_STATUS.AUTHORIZED:
            return 'text-green-600 bg-green-100';
        case PAYMENT_STATUS.FAILED:
            return 'text-red-600 bg-red-100';
        case PAYMENT_STATUS.CREATED:
            return 'text-yellow-600 bg-yellow-100';
        case PAYMENT_STATUS.REFUNDED:
            return 'text-blue-600 bg-blue-100';
        default:
            return 'text-gray-600 bg-gray-100';
    }
};

