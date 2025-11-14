# Razorpay Live Mode Update

## ✅ Changes Made

### 1. Removed Test API - Live Mode Only

**Files Updated:**
- `src/lib/config/razorpay.ts` - Removed TEST configuration, only PRODUCTION (live) remains
- `src/lib/config/env.ts` - Removed test environment variables

**Before:**
- Had TEST and PRODUCTION modes
- Switched based on `NODE_ENV`

**After:**
- Only LIVE mode
- Always uses `RAZORPAY_KEY_ID_LIVE` and `RAZORPAY_KEY_SECRET_LIVE`

### 2. Using discountPrice Instead of totalAmount

**Files Updated:**
- `src/app/api/razorpay/create-order/route.ts` - Now fetches products and calculates from discountPrice
- `src/lib/utils/razorpay.ts` - Verification also uses discountPrice

**How It Works:**
1. When creating Razorpay order:
   - Fetches each product from database
   - Uses `product.discountPrice` if available
   - Falls back to `product.actualPrice` if discountPrice is not set
   - Calculates total: `sum(discountPrice * quantity)` for all items

2. When verifying payment:
   - Same calculation - fetches products and uses discountPrice
   - Ensures payment amount matches discountPrice total

### 3. Code Changes Details

#### `src/lib/config/razorpay.ts`
```typescript
// Now always returns PRODUCTION config
export const getRazorpayConfig = () => {
    return RAZORPAY_CONFIG.PRODUCTION; // Always live
};
```

#### `src/app/api/razorpay/create-order/route.ts`
```typescript
// Calculate amount from discountPrice
let totalAmountFromDiscountPrice = 0;
for (const orderItem of order.items) {
    const product = await Product.findById(orderItem.product);
    const itemPrice = product.discountPrice || product.actualPrice;
    totalAmountFromDiscountPrice += itemPrice * orderItem.quantity;
}

// Use this amount for Razorpay order
const razorpayOrderResult = await createRazorpayOrder({
    amount: totalAmountFromDiscountPrice, // From discountPrice
    ...
});
```

#### `src/lib/utils/razorpay.ts`
```typescript
// Verification also uses discountPrice
let totalAmountFromDiscountPrice = 0;
for (const orderItem of order.items) {
    const product = await Product.findById(orderItem.product);
    if (product) {
        const itemPrice = product.discountPrice || product.actualPrice;
        totalAmountFromDiscountPrice += itemPrice * orderItem.quantity;
    }
}
// Verify against this amount
```

## 🔧 Environment Variables Required

**Required in `.env.local` (and Vercel):**
```bash
RAZORPAY_KEY_ID_LIVE=rzp_live_xxxxx
RAZORPAY_KEY_SECRET_LIVE=xxxxx
```

**No longer needed:**
- `RAZORPAY_KEY_ID_TEST`
- `RAZORPAY_KEY_SECRET_TEST`
- `NODE_ENV` doesn't affect Razorpay anymore (always uses live)

## ⚠️ Important Notes

1. **Live API Only**: All payments will use live Razorpay credentials
2. **Real Transactions**: All payments will be real transactions (no test mode)
3. **discountPrice**: Amount is calculated from current product `discountPrice` in database
4. **Fallback**: If `discountPrice` is not set, uses `actualPrice`
5. **Always Fresh**: Amount is calculated fresh from database each time (not from stored order.totalAmount)

## 🧪 Testing

Before testing with real payments:
1. ✅ Verify `RAZORPAY_KEY_ID_LIVE` and `RAZORPAY_KEY_SECRET_LIVE` are set
2. ✅ Ensure products have correct `discountPrice` values
3. ✅ Test with small amount first
4. ✅ Verify amount calculation matches what you expect

## 📊 Amount Calculation Flow

1. User creates order → Order saved with `totalAmount` (from frontend calculation)
2. User clicks "Pay" → Backend fetches products fresh
3. Backend calculates: `sum(product.discountPrice * quantity)` 
4. Razorpay order created with this calculated amount
5. Payment happens with correct amount
6. Verification uses same calculation to ensure match

## 🚀 Deployment

For Vercel:
1. Add `RAZORPAY_KEY_ID_LIVE` and `RAZORPAY_KEY_SECRET_LIVE` to environment variables
2. Remove test variables if present
3. Deploy - will always use live credentials

---

**Status: Ready for live mode** ✅

