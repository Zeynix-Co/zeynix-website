import { getPaytmConfig, TRANSACTION_STATUS, CURRENCY } from '@/lib/config/paytm';
import connectDB from '@/lib/config/database';
import { Order } from '@/lib/models/Order';
import { User } from '@/lib/models/User';

// Generate unique transaction ID
export const generateTransactionId = (orderId: string): string => {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 8);
    return `TXN_${orderId}_${timestamp}_${random}`.toUpperCase();
};

// Generate order ID for Paytm
export const generateOrderId = (): string => {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 8);
    return `ORDER_${timestamp}_${random}`.toUpperCase();
};

// Create Paytm payment request parameters
export const createPaymentParams = (orderData: {
    orderId: string;
    amount: number;
    customerId: string;
    customerEmail: string;
    customerMobile: string;
    orderDetails: string;
}) => {
    const config = getPaytmConfig();

    return {
        MID: config.MID,
        ORDER_ID: orderData.orderId,
        CUST_ID: orderData.customerId,
        INDUSTRY_TYPE_ID: config.INDUSTRY_TYPE_ID,
        CHANNEL_ID: config.CHANNEL_ID,
        TXN_AMOUNT: orderData.amount.toString(),
        WEBSITE: config.WEBSITE,
        CALLBACK_URL: config.CALLBACK_URL,
        EMAIL: orderData.customerEmail,
        MOBILE_NO: orderData.customerMobile,
        ORDER_DETAILS: orderData.orderDetails,
    };
};

// Verify payment response
export const verifyPaymentResponse = async (response: Record<string, unknown>): Promise<{
    isValid: boolean;
    orderId?: string;
    transactionId?: string;
    amount?: number;
    status?: string;
    error?: string;
}> => {
    try {
        // Basic validation
        if (!response.ORDERID || !response.TXNID || !response.TXNAMOUNT) {
            return {
                isValid: false,
                error: 'Invalid payment response: Missing required fields'
            };
        }

        // Connect to database
        await connectDB();

        // Find the order
        const order = await Order.findOne({ orderNumber: response.ORDERID });
        if (!order) {
            return {
                isValid: false,
                error: 'Order not found'
            };
        }

        // Verify amount
        const expectedAmount = order.totalAmount.toString();
        if (response.TXNAMOUNT !== expectedAmount) {
            return {
                isValid: false,
                error: 'Amount mismatch'
            };
        }

        // Check transaction status
        const isSuccess = response.STATUS === TRANSACTION_STATUS.SUCCESS;

        return {
            isValid: true,
            orderId: response.ORDERID as string,
            transactionId: response.TXNID as string,
            amount: parseFloat(response.TXNAMOUNT as string),
            status: response.STATUS as string,
        };

    } catch (error) {
        console.error('Payment verification error:', error);
        return {
            isValid: false,
            error: 'Payment verification failed'
        };
    }
};

// Update order payment status
export const updateOrderPaymentStatus = async (
    orderId: string,
    paymentData: {
        transactionId: string;
        status: string;
        amount: number;
        paymentMethod?: string;
    }
): Promise<{ success: boolean; error?: string }> => {
    try {
        await connectDB();

        const order = await Order.findOne({ orderNumber: orderId });
        if (!order) {
            return { success: false, error: 'Order not found' };
        }

        // Update order with payment details
        order.paymentStatus = paymentData.status === TRANSACTION_STATUS.SUCCESS ? 'completed' : 'failed';
        order.razorpayOrderId = paymentData.transactionId; // Reusing field for Paytm transaction ID
        order.razorpayPaymentId = paymentData.transactionId; // Reusing field for Paytm payment ID

        if (paymentData.status === TRANSACTION_STATUS.SUCCESS) {
            order.status = 'confirmed';
        }

        await order.save();

        return { success: true };

    } catch (error) {
        console.error('Update order payment status error:', error);
        return { success: false, error: 'Failed to update order status' };
    }
};

// Format amount for Paytm (should be in paise for INR)
export const formatAmountForPaytm = (amount: number): string => {
    // Paytm expects amount in rupees, not paise
    return amount.toFixed(2);
};

// Validate payment callback
export const validatePaymentCallback = (callbackData: Record<string, unknown>): boolean => {
    const requiredFields = ['ORDERID', 'TXNID', 'TXNAMOUNT', 'STATUS', 'RESPCODE'];

    for (const field of requiredFields) {
        if (!callbackData[field]) {
            return false;
        }
    }

    return true;
};

// Get payment status text
export const getPaymentStatusText = (status: string): string => {
    switch (status) {
        case TRANSACTION_STATUS.SUCCESS:
            return 'Payment Successful';
        case TRANSACTION_STATUS.FAILURE:
            return 'Payment Failed';
        case TRANSACTION_STATUS.PENDING:
            return 'Payment Pending';
        case TRANSACTION_STATUS.CANCELLED:
            return 'Payment Cancelled';
        default:
            return 'Unknown Status';
    }
};

// Get payment status color
export const getPaymentStatusColor = (status: string): string => {
    switch (status) {
        case TRANSACTION_STATUS.SUCCESS:
            return 'text-green-600 bg-green-100';
        case TRANSACTION_STATUS.FAILURE:
            return 'text-red-600 bg-red-100';
        case TRANSACTION_STATUS.PENDING:
            return 'text-yellow-600 bg-yellow-100';
        case TRANSACTION_STATUS.CANCELLED:
            return 'text-gray-600 bg-gray-100';
        default:
            return 'text-gray-600 bg-gray-100';
    }
};
