# Paytm Business Integration Setup Guide

## Overview
This guide will help you set up Paytm Business payment integration for the Zeynix website.

## Prerequisites
1. Paytm Business account (already have for offline payments)
2. Account activation completed
3. API credentials obtained

## Environment Variables Required

Add these environment variables to your `.env.local` file:

```bash
# Paytm Business Configuration
# Test Environment (for development)
PAYTM_MID_TEST=TEST_MID
PAYTM_MERCHANT_KEY_TEST=TEST_KEY

# Production Environment (get these from Paytm Business dashboard)
PAYTM_MID=your-paytm-merchant-id
PAYTM_MERCHANT_KEY=your-paytm-merchant-key

# Other existing variables
MONGODB_URI=mongodb://localhost:27017/zeynix-website
JWT_SECRET=your-super-secret-jwt-key
NEXTAUTH_SECRET=your-nextauth-secret-key
NEXTAUTH_URL=http://localhost:3000
CLOUDINARY_CLOUD_NAME=your-cloudinary-name
CLOUDINARY_API_KEY=your-cloudinary-api-key
CLOUDINARY_API_SECRET=your-cloudinary-secret
NODE_ENV=development
```

## Getting Paytm Credentials

### 1. Login to Paytm Business Dashboard
- Go to [dashboard.paytm.com](https://dashboard.paytm.com)
- Login with your existing account

### 2. Get API Credentials
- Navigate to "Developer Settings" → "API Keys"
- Copy your:
  - **Merchant ID (MID)**
  - **Merchant Key**

### 3. Configure Webhook URLs
- Set callback URL: `https://zeynix.in/api/paytm/callback`
- Enable webhook notifications for payment events

## Installation Steps

### 1. No Additional Dependencies Required
The integration uses Paytm's **all-in-one JS SDK** approach - no additional npm packages needed!

### 2. Update Environment Variables
- Add Paytm credentials to your `.env.local` file
- For Vercel deployment, add the same variables in Vercel dashboard

### 3. Test the Integration
```bash
# Start development server
npm run dev

# Test payment flow
# 1. Add items to cart
# 2. Go to checkout
# 3. Select "Online Payment" option
# 4. Complete payment
```

## Features Implemented

### ✅ **Payment Methods Supported**
- UPI (PhonePe, Google Pay, Paytm, etc.)
- Credit/Debit Cards
- Net Banking
- Paytm Wallet

### ✅ **API Endpoints Created**
- `POST /api/paytm/create-order` - Create payment order
- `POST /api/paytm/callback` - Handle payment callbacks
- `GET /api/paytm/status` - Check payment status

### ✅ **Pages Created**
- `/payment/success` - Payment success page
- `/payment/failure` - Payment failure page

### ✅ **Components Created**
- `PaytmPayment.tsx` - Payment component
- Updated `CheckoutForm.tsx` - Payment method selection

## Testing

### 1. Test Environment
- Use Paytm test credentials
- Test with test UPI IDs and cards
- Verify webhook notifications

### 2. Production Testing
- Switch to production credentials
- Test with real payment methods
- Monitor payment transactions

## Payment Flow

1. **User selects payment method** (Online Payment vs WhatsApp)
2. **Order is created** in database with "pending_payment" status
3. **Payment order is initiated** via Paytm API
4. **User completes payment** on Paytm's secure page
5. **Payment callback** updates order status
6. **User is redirected** to success/failure page
7. **Order status** is updated to "confirmed" or "failed"

## Security Features

- **SSL Encryption**: All payments secured with 256-bit SSL
- **Webhook Verification**: Payment callbacks are verified
- **Amount Validation**: Payment amount is validated
- **Order Verification**: Orders are verified before payment

## Troubleshooting

### Common Issues

1. **Payment Not Processing**
   - Check Paytm credentials
   - Verify webhook URL configuration
   - Check network connectivity

2. **Order Not Updating**
   - Check webhook endpoint
   - Verify database connection
   - Check order ID matching

3. **Test Payments Not Working**
   - Use Paytm test credentials
   - Test with Paytm test UPI IDs
   - Check test environment configuration

### Debug Steps

1. **Check Browser Console** for JavaScript errors
2. **Check Network Tab** for API call failures
3. **Check Server Logs** for backend errors
4. **Verify Environment Variables** are set correctly

## Support

- **Paytm Support**: support@paytm.com
- **Documentation**: [Paytm Developer Docs](https://developer.paytm.com)
- **API Reference**: [Paytm API Docs](https://developer.paytm.com/docs)

## Next Steps

1. **Get Paytm credentials** from your dashboard
2. **Update environment variables** with your credentials
3. **Test the integration** in development
4. **Deploy to production** with production credentials
5. **Monitor payments** and transactions

## Notes

- All payments are processed through Paytm's secure servers
- Customer payment data is never stored on your servers
- Webhook notifications ensure real-time order updates
- Integration is fully compatible with Vercel deployment
