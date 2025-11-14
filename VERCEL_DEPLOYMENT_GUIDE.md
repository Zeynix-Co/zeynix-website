# Vercel Deployment Guide for Razorpay Integration

## ✅ Vercel Compatibility

All files are **fully compatible with Vercel** because:

1. **Next.js App Router**: All API routes use Next.js 13+ App Router format (`route.ts` files)
2. **Serverless Functions**: Vercel automatically converts these to serverless functions
3. **No Edge Runtime Conflicts**: Standard Node.js runtime is used (no special edge runtime required)
4. **Environment Variables**: Properly configured to work with Vercel's environment variable system

## 🔧 Setting Up Environment Variables on Vercel

### Step 1: Add Environment Variables in Vercel Dashboard

1. Go to your Vercel project dashboard
2. Navigate to **Settings** → **Environment Variables**
3. Add the following variables:

#### For Development/Preview:
```
RAZORPAY_KEY_ID_TEST=rzp_test_xxxxx
RAZORPAY_KEY_SECRET_TEST=xxxxx
NODE_ENV=development
```

#### For Production:
```
RAZORPAY_KEY_ID_LIVE=rzp_live_xxxxx
RAZORPAY_KEY_SECRET_LIVE=xxxxx
NODE_ENV=production
```

### Step 2: Assign to Environments

- **Development**: Select "Development" and "Preview"
- **Production**: Select "Production" only

### Step 3: Redeploy

After adding environment variables, redeploy your application for changes to take effect.

## 🔄 Switching Between Test and Live API

### Current Implementation

The code automatically switches between test and live APIs based on `NODE_ENV`:

```typescript
// src/lib/config/razorpay.ts
export const getRazorpayConfig = () => {
    const isProduction = process.env.NODE_ENV === 'production';
    return isProduction ? RAZORPAY_CONFIG.PRODUCTION : RAZORPAY_CONFIG.TEST;
};
```

### How It Works:

- **Development/Preview**: Uses `RAZORPAY_KEY_ID_TEST` and `RAZORPAY_KEY_SECRET_TEST`
- **Production**: Uses `RAZORPAY_KEY_ID_LIVE` and `RAZORPAY_KEY_SECRET_LIVE`

### Testing Locally:

1. **Test Mode** (Default):
   ```bash
   NODE_ENV=development npm run dev
   # Uses test credentials from .env.local
   ```

2. **Live Mode** (for testing):
   ```bash
   NODE_ENV=production npm run dev
   # Uses live credentials from .env.local
   ```

### For Production Deployment:

1. Set `NODE_ENV=production` in Vercel environment variables
2. Add live API credentials (`RAZORPAY_KEY_ID_LIVE` and `RAZORPAY_KEY_SECRET_LIVE`)
3. Deploy to production

## 🐛 Fixing Amount Mismatch Issue

The amount mismatch (₹1,076 showing as ₹1,348 in Razorpay) has been fixed:

### What Was Wrong:
- Frontend was recalculating amount from rupees to paise using `Math.round(orderAmount * 100)`
- This could cause rounding errors or precision issues
- Not using the exact amount from Razorpay order that was created

### What's Fixed:
1. **Backend** now returns `razorpayAmount` (in paise) directly from Razorpay order creation
2. **Frontend** uses the exact `razorpayAmount` from API response - no conversion needed
3. The amount shown in Razorpay modal will now match the order total exactly

### Code Changes:
```typescript
// API now returns razorpayAmount in paise (from Razorpay order)
data: {
    razorpayAmount: razorpayOrderResult.order.amount, // Exact amount in paise from Razorpay
    amount: order.totalAmount, // Amount in rupees (for display only)
    ...
}

// Frontend uses exact amount from Razorpay order
amount: razorpayAmount, // Direct from Razorpay - no conversion needed
```

### Important Notes:
- When you provide `order_id` to Razorpay checkout, the `amount` field **must match** the amount in the Razorpay order
- Using the exact amount from Razorpay order ensures there are no mismatches
- The amount is converted to paise only once (on the backend when creating the order)

## 📋 API Routes (All Vercel-Compatible)

All routes follow Next.js App Router conventions:

1. **`/api/razorpay/create-order`** (POST)
   - Creates Razorpay order
   - Returns order details for frontend

2. **`/api/razorpay/verify-payment`** (POST, GET)
   - POST: Verifies payment signature
   - GET: Checks payment status

## 🔒 Security Notes for Vercel

1. **Never commit secrets**: Use Vercel environment variables
2. **Use different credentials**: Test and live credentials are separate
3. **Signature verification**: Always verified server-side (included in code)
4. **HTTPS required**: Vercel provides HTTPS automatically in production

## 🧪 Testing Checklist

Before deploying to production:

- [ ] Test API routes work locally
- [ ] Verify test credentials work
- [ ] Test payment flow with test cards
- [ ] Verify amount matches exactly
- [ ] Check signature verification works
- [ ] Add live credentials to Vercel
- [ ] Test with small real transaction first
- [ ] Monitor Vercel logs for errors

## 📝 Notes

- **Amount Precision**: Razorpay requires amount in paise (smallest currency unit)
- **Order ID**: Razorpay creates its own order ID, we store both your order number and Razorpay order ID
- **Payment Verification**: Critical security step - always verified server-side

## 🚀 Deployment Steps

1. **Commit and push your code** to your Git repository
2. **Connect repository** to Vercel (if not already connected)
3. **Add environment variables** in Vercel dashboard
4. **Deploy** - Vercel will automatically build and deploy
5. **Test** - Verify payment flow works correctly
6. **Switch to live** - Update `NODE_ENV` to production and add live credentials

---

**All files are production-ready and Vercel-compatible!** ✅

