// Paytm Configuration
export const PAYTM_CONFIG = {
    // Test Environment (for development)
    TEST: {
        MID: process.env.PAYTM_MID_TEST || 'TEST_MID',
        MERCHANT_KEY: process.env.PAYTM_MERCHANT_KEY_TEST || 'TEST_KEY',
        WEBSITE: 'WEBSTAGING',
        CHANNEL_ID: 'WEB',
        INDUSTRY_TYPE_ID: 'Retail',
        CALLBACK_URL: `${process.env.NEXTAUTH_URL}/api/paytm/callback`,
        JS_URL: 'https://securegw-stage.paytm.in/merchantpgpui/checkoutjs/merchants/PaytmTest.js',
        TXN_URL: 'https://securegw-stage.paytm.in/order/process',
        STATUS_URL: 'https://securegw-stage.paytm.in/order/status',
    },

    // Production Environment
    PRODUCTION: {
        MID: process.env.PAYTM_MID || '',
        MERCHANT_KEY: process.env.PAYTM_MERCHANT_KEY || '',
        WEBSITE: 'DEFAULT',
        CHANNEL_ID: 'WEB',
        INDUSTRY_TYPE_ID: 'Retail',
        CALLBACK_URL: `${process.env.NEXTAUTH_URL}/api/paytm/callback`,
        JS_URL: 'https://securegw.paytm.in/merchantpgpui/checkoutjs/merchants/PaytmTest.js',
        TXN_URL: 'https://securegw.paytm.in/order/process',
        STATUS_URL: 'https://securegw.paytm.in/order/status',
    }
};

// Get current environment configuration
export const getPaytmConfig = () => {
    const isProduction = process.env.NODE_ENV === 'production';
    return isProduction ? PAYTM_CONFIG.PRODUCTION : PAYTM_CONFIG.TEST;
};

// Paytm API endpoints
export const PAYTM_ENDPOINTS = {
    INITIATE_TRANSACTION: '/order/process',
    TRANSACTION_STATUS: '/order/status',
    REFUND: '/refund/process',
    REFUND_STATUS: '/refund/status',
};

// Payment methods supported
export const PAYMENT_METHODS = {
    UPI: 'UPI',
    CARD: 'CARD',
    NET_BANKING: 'NET_BANKING',
    WALLET: 'WALLET',
    EMI: 'EMI',
};

// Transaction status
export const TRANSACTION_STATUS = {
    SUCCESS: 'TXN_SUCCESS',
    FAILURE: 'TXN_FAILURE',
    PENDING: 'PENDING',
    CANCELLED: 'CANCELLED',
};

// Currency
export const CURRENCY = 'INR';

// Transaction timeout (in minutes)
export const TRANSACTION_TIMEOUT = 15;
