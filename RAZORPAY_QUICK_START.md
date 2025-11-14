# Razorpay Integration - Quick Start Guide

## ✅ What's Been Implemented

### Files Created:
1. ✅ `src/lib/config/razorpay.ts` - Configuration (test & live)
2. ✅ `src/lib/utils/razorpay.ts` - Utility functions
3. ✅ `src/components/payment/RazorpayPayment.tsx` - Payment component
4. ✅ `src/app/api/razorpay/create-order/route.ts` - Create order API
5. ✅ `src/app/api/razorpay/verify-payment/route.ts` - Verify payment API

### Files Updated:
1. ✅ `package.json` - Added razorpay package
2. ✅ `src/lib/config/env.ts` - Added Razorpay env vars
3. ✅ `src/components/checkout/CheckoutForm.tsx` - Replaced Paytm with Razorpay
4. ✅ `src/app/payment/success/page.tsx` - Updated for Razorpay

## 🔧 Current Setup (Test API)

Your `.env.local` should have:
```bash
# Test Credentials
RAZORPAY_KEY_ID_TEST=rzp_test_xxxxx
RAZORPAY_KEY_SECRET_TEST=xxxxx

# Live Credentials (for later)
RAZORPAY_KEY_ID_LIVE=rzp_live_xxxxx
RAZORPAY_KEY_SECRET_LIVE=xxxxx

# Environment
NODE_ENV=development  # Uses test credentials
```

## 🧪 Testing with Test API

1. **Start the dev server:**
   ```bash
   npm run dev
   ```

2. **Test payment flow:**
   - Go to checkout page
   - Create an order
   - Click "Pay ₹X" button
   - Razorpay modal should open with test mode

3. **Use Razorpay test cards:**
   - Card: `4111 1111 1111 1111`
   - CVV: Any 3 digits (e.g., `123`)
   - Expiry: Any future date (e.g., `12/25`)
   - OTP: `1234`

4. **Verify:**
   - Payment should complete successfully
   - Order status should update to "confirmed"
   - Payment status should be "completed"
   - Redirect to success page

## 🔄 Switching to Live API

### For Local Testing:
1. Update `.env.local`:
   ```bash
   NODE_ENV=production  # Switch to production mode
   ```

2. Restart dev server:
   ```bash
   npm run dev
   ```

3. Now it will use live credentials (`RAZORPAY_KEY_ID_LIVE` and `RAZORPAY_KEY_SECRET_LIVE`)

### For Vercel Production:
1. Go to Vercel Dashboard → Settings → Environment Variables
2. Add/Update:
   ```
   NODE_ENV=production
   RAZORPAY_KEY_ID_LIVE=rzp_live_xxxxx
   RAZORPAY_KEY_SECRET_LIVE=xxxxx
   ```
3. Redeploy your application

## 📊 Amount Fix Applied

**Issue:** Amount mismatch between checkout (₹1,076) and Razorpay (₹1,348)

**Fix:** 
- Now uses exact amount from Razorpay order (in paise)
- No frontend conversion calculations
- Amount will match exactly

**How it works:**
1. Backend creates Razorpay order with exact amount in paise
2. Backend returns `razorpayAmount` (in paise) from Razorpay
3. Frontend uses this exact amount - no conversion

## ✅ Vercel Compatibility

**All routes are Vercel-compatible:**
- ✅ Uses Next.js App Router format
- ✅ Serverless function compatible
- ✅ No special runtime needed
- ✅ Standard Node.js runtime

**Routes:**
- `/api/razorpay/create-order` (POST)
- `/api/razorpay/verify-payment` (POST, GET)

## 🔒 Security Features

1. **Server-side signature verification** - All payments verified on server
2. **Amount validation** - Ensures payment amount matches order amount
3. **Duplicate payment prevention** - Checks if order already paid
4. **Environment-based credentials** - Separate test and live keys

## 🐛 Troubleshooting

### Amount Still Mismatched?
- Clear browser cache
- Check console for errors
- Verify `order.totalAmount` is correct in database
- Check Razorpay dashboard for order details

### Payment Not Working?
- Check environment variables are set correctly
- Verify Razorpay keys are valid
- Check browser console for errors
- Check server logs for API errors

### Test Mode Not Showing?
- Verify `NODE_ENV=development`
- Check test credentials are set
- Razorpay shows "Test Mode" banner when using test keys

## 📝 Next Steps

1. ✅ Test with test API (you're here)
2. ⏭️ Test payment flow end-to-end
3. ⏭️ Switch to live API when ready
4. ⏭️ Deploy to Vercel
5. ⏭️ Test with real small transaction first

---

**Ready to test!** Start your dev server and try making a payment. 🚀

