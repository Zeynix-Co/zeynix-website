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

// Get Razorpay instance for server-side operations
export const getRazorpayInstance = () => {
    const config = getRazorpayConfig();

    if (!config.KEY_ID || !config.KEY_SECRET) {
        throw new Error('Razorpay credentials are not configured. Please check your environment variables.');
    }

    const Razorpay = require('razorpay');
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

