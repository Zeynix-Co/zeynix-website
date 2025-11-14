import { env } from './env';

// Razorpay Configuration - Live Mode Only
export const RAZORPAY_CONFIG = {
    // Production Environment (Live API Only)
    PRODUCTION: {
        KEY_ID: env.RAZORPAY_KEY_ID_LIVE,
        KEY_SECRET: env.RAZORPAY_KEY_SECRET_LIVE,
        BASE_URL: 'https://api.razorpay.com/v1',
        CHECKOUT_JS_URL: 'https://checkout.razorpay.com/v1/checkout.js',
    }
};

// Get current environment configuration - Always uses live credentials
export const getRazorpayConfig = () => {
    return RAZORPAY_CONFIG.PRODUCTION;
};

// Razorpay order interface
interface RazorpayOrder {
    id: string;
    entity: string;
    amount: number;
    amount_paid: number;
    amount_due: number;
    currency: string;
    receipt: string;
    offer_id: string | null;
    status: string;
    attempts: number;
    notes: Record<string, string>;
    created_at: number;
}

// Get Razorpay instance for server-side operations
export const getRazorpayInstance = () => {
    const config = getRazorpayConfig();

    if (!config.KEY_ID || !config.KEY_SECRET) {
        throw new Error('Razorpay credentials are not configured. Please check your environment variables.');
    }

    // Import Razorpay (using require for CommonJS module)
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const Razorpay = require('razorpay') as new (options: { key_id: string; key_secret: string }) => {
        orders: {
            create: (params: {
                amount: number;
                currency: string;
                receipt: string;
                notes?: Record<string, string>;
            }) => Promise<RazorpayOrder>;
        };
        payments: {
            fetch: (paymentId: string) => Promise<{
                id: string;
                entity: string;
                amount: number;
                currency: string;
                status: string;
                order_id: string;
                invoice_id: string | null;
                international: boolean;
                method: string;
                amount_refunded: number;
                refund_status: string | null;
                captured: boolean;
                description: string;
                card_id: string | null;
                bank: string | null;
                wallet: string | null;
                vpa: string | null;
                email: string;
                contact: string;
                notes: Record<string, string>;
                fee: number | null;
                tax: number | null;
                error_code: string | null;
                error_description: string | null;
                error_source: string | null;
                error_step: string | null;
                error_reason: string | null;
                acquirer_data: Record<string, unknown>;
                created_at: number;
            }>;
        };
    };

    return new Razorpay({
        key_id: config.KEY_ID,
        key_secret: config.KEY_SECRET,
    });
};

// Currency
export const CURRENCY = 'INR';

// Payment method options
export const PAYMENT_METHODS = {
    CARD: 'card',
    NETBANKING: 'netbanking',
    WALLET: 'wallet',
    UPI: 'upi',
    EMI: 'emi',
};

// Payment status
export const PAYMENT_STATUS = {
    CREATED: 'created',
    AUTHORIZED: 'authorized',
    CAPTURED: 'captured',
    REFUNDED: 'refunded',
    FAILED: 'failed',
};

