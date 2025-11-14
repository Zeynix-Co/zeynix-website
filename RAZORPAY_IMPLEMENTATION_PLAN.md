# Razorpay Implementation Plan - Detailed File Changes & Verification Flow

## 📋 Files That Will Be Changed/Created

### 🔵 NEW FILES (To Be Created)

1. **`src/lib/config/razorpay.ts`**
   - Razorpay configuration (test & live environments)
   - Environment-based config selector
   - Exports key ID and secret based on NODE_ENV

2. **`src/lib/utils/razorpay.ts`**
   - Create Razorpay order function
   - Verify payment signature function
   - Update order payment status function
   - Helper functions for amount conversion (rupees to paise)

3. **`src/components/payment/RazorpayPayment.tsx`**
   - New Razorpay payment component (replaces PaytmPayment)
   - Loads Razorpay checkout script from CDN
   - Handles payment initialization
   - Manages payment success/failure callbacks

4. **`src/app/api/razorpay/create-order/route.ts`**
   - API endpoint to create Razorpay order
   - Validates order and user authentication
   - Creates order on Razorpay and returns order details

5. **`src/app/api/razorpay/verify-payment/route.ts`**
   - API endpoint to verify payment signature
   - Server-side signature verification (SECURITY CRITICAL)
   - Updates order status in database
   - Returns verification result

### 🔴 FILES TO BE MODIFIED

1. **`package.json`**
   - **Change**: Add `"razorpay": "^2.9.2"` to dependencies
   - **Reason**: Razorpay Node.js SDK for server-side operations

2. **`src/lib/config/env.ts`**
   - **Change**: Add Razorpay environment variables
   - **Add**:
     - `RAZORPAY_KEY_ID_TEST`
     - `RAZORPAY_KEY_SECRET_TEST`
     - `RAZORPAY_KEY_ID_LIVE` (for production)
     - `RAZORPAY_KEY_SECRET_LIVE` (for production)
   - **Reason**: Store Razorpay credentials securely

3. **`src/components/checkout/CheckoutForm.tsx`**
   - **Change**: Replace PaytmPayment with RazorpayPayment
   - **Line 11**: Replace `import PaytmPayment from '@/components/payment/PaytmPayment';`
   - **Line 36**: Change `'paytm'` to `'razorpay'` in paymentMethod state
   - **Line 496-521**: Update payment method radio button labels
   - **Line 569-585**: Replace PaytmPayment component with RazorpayPayment
   - **Line 598-602**: Update payment method text references

4. **`src/app/payment/success/page.tsx`**
   - **Change**: Update to use Razorpay API endpoints
   - **Line 56**: Change `/api/paytm/status` to `/api/razorpay/verify-payment` (or create new endpoint)
   - **Line 168**: Update "Paytm" text to "Razorpay"
   - **Reason**: Display correct payment gateway name

5. **`src/lib/models/Order.ts`**
   - **No changes needed** - Already has `razorpayOrderId` and `razorpayPaymentId` fields ✅
   - **Note**: These fields will now be used for actual Razorpay data (not Paytm)

### 🟡 FILES TO BE DELETED (After Testing Razorpay Successfully)

**Optional - Can keep for reference or delete later:**

1. `src/components/payment/PaytmPayment.tsx` - No longer needed
2. `src/lib/config/paytm.ts` - No longer needed
3. `src/lib/utils/paytm-simple.ts` - No longer needed
4. `src/lib/utils/paytm.ts` - No longer needed
5. `src/app/api/paytm/` directory - All Paytm API routes (3 files)
   - `create-order/route.ts`
   - `callback/route.ts`
   - `status/route.ts`

### 📝 ENVIRONMENT VARIABLES TO ADD

Add to `.env.local` (or your environment file):

```bash
# Razorpay Test Credentials (Development)
RAZORPAY_KEY_ID_TEST=your_test_key_id
RAZORPAY_KEY_SECRET_TEST=your_test_key_secret

# Razorpay Live Credentials (Production)
RAZORPAY_KEY_ID_LIVE=your_live_key_id
RAZORPAY_KEY_SECRET_LIVE=your_live_key_secret

# Environment Detection
NODE_ENV=development  # or production
```

---

## 🔐 Payment Verification Flow

### How Razorpay Payment Verification Works

Razorpay uses a **two-step verification process**:

#### Step 1: Frontend Verification (Client-Side)
1. User completes payment on Razorpay checkout
2. Razorpay returns payment response with signature
3. Frontend receives payment details including:
   - `razorpay_payment_id`
   - `razorpay_order_id`
   - `razorpay_signature`
   - Order amount, currency, etc.

#### Step 2: Server-Side Verification (CRITICAL - Security)
1. Frontend sends payment details to your API (`/api/razorpay/verify-payment`)
2. Server verifies the signature using Razorpay secret key
3. Server validates:
   - ✅ Signature is valid (prevents tampering)
   - ✅ Amount matches order amount
   - ✅ Order exists and hasn't been paid
   - ✅ Currency is correct (INR)
4. Only if all validations pass, server updates order status
5. Server returns success/failure to frontend

### Verification Process Diagram

```
┌─────────────┐
│   User      │
│  Completes  │
│  Payment    │
└──────┬──────┘
       │
       ▼
┌─────────────────────────────────────┐
│  Razorpay Checkout                  │
│  - Processes payment                │
│  - Returns payment response         │
│  - Includes signature               │
└──────┬──────────────────────────────┘
       │
       ▼
┌─────────────────────────────────────┐
│  Frontend (RazorpayPayment.tsx)     │
│  - Receives payment response        │
│  - Sends to /api/razorpay/verify    │
└──────┬──────────────────────────────┘
       │
       ▼
┌─────────────────────────────────────┐
│  API: /api/razorpay/verify-payment  │
│  ✅ Verify signature (SECURITY)     │
│  ✅ Validate amount                 │
│  ✅ Check order exists              │
│  ✅ Update order status             │
└──────┬──────────────────────────────┘
       │
       ▼
┌─────────────────────────────────────┐
│  Database                           │
│  - Update order.paymentStatus       │
│  - Store razorpayOrderId            │
│  - Store razorpayPaymentId          │
└─────────────────────────────────────┘
```

### Signature Verification Code (Security Critical)

```typescript
import Razorpay from 'razorpay';
import crypto from 'crypto';

function verifyPaymentSignature(
  razorpay_order_id: string,
  razorpay_payment_id: string,
  razorpay_signature: string,
  secret: string
): boolean {
  const text = razorpay_order_id + '|' + razorpay_payment_id;
  const generated_signature = crypto
    .createHmac('sha256', secret)
    .update(text)
    .digest('hex');
  
  return generated_signature === razorpay_signature;
}
```

**Why this is important:**
- Prevents payment fraud
- Ensures payment data hasn't been tampered with
- Only legitimate payments from Razorpay are accepted

---

## 🧪 Testing Strategy

### Phase 1: Test API Integration

1. **Set Environment Variables:**
   ```bash
   NODE_ENV=development
   RAZORPAY_KEY_ID_TEST=rzp_test_xxxxx
   RAZORPAY_KEY_SECRET_TEST=xxxxx
   ```

2. **Test Scenarios:**
   - ✅ Successful payment with test card
   - ✅ Failed payment (insufficient funds)
   - ✅ Payment cancellation
   - ✅ Invalid signature handling
   - ✅ Amount mismatch handling
   - ✅ Duplicate payment prevention

3. **Razorpay Test Cards:**
   - Success: `4111 1111 1111 1111`
   - CVV: Any 3 digits
   - Expiry: Any future date
   - OTP: `1234`

### Phase 2: Live API Integration

1. **Switch Environment:**
   ```bash
   NODE_ENV=production
   RAZORPAY_KEY_ID_LIVE=rzp_live_xxxxx
   RAZORPAY_KEY_SECRET_LIVE=xxxxx
   ```

2. **Update Config:**
   - Configuration will automatically use live credentials
   - No code changes needed

3. **Testing:**
   - Test with small real transactions first
   - Verify all payment methods work
   - Monitor payment logs

---

## 🔄 Migration Checklist

### Before Implementation:
- [ ] Backup current Paytm integration
- [ ] Add Razorpay test credentials to `.env.local`
- [ ] Review this plan

### During Implementation:
- [ ] Install razorpay package
- [ ] Create Razorpay config
- [ ] Create Razorpay utils
- [ ] Create API routes
- [ ] Create RazorpayPayment component
- [ ] Update CheckoutForm
- [ ] Update success page
- [ ] Update env.ts

### After Implementation (Testing):
- [ ] Test with Razorpay test API
- [ ] Verify payment success flow
- [ ] Verify payment failure handling
- [ ] Verify database updates
- [ ] Check signature verification
- [ ] Test all payment methods

### After Testing:
- [ ] Switch to live API credentials
- [ ] Test with real small transaction
- [ ] Remove Paytm files (optional)
- [ ] Update documentation

---

## 📊 Key Differences: Paytm vs Razorpay

| Aspect | Paytm | Razorpay |
|--------|-------|----------|
| **Amount Format** | Rupees (100.00) | Paise (10000) |
| **Verification** | Server callback | Signature verification |
| **SDK** | Paytm CheckoutJS | Razorpay Checkout (CDN) |
| **Order Creation** | Manual params | Razorpay API |
| **Callback** | Separate endpoint | Frontend + API verify |

---

## ⚠️ Important Security Notes

1. **Never expose secret keys** - Always use environment variables
2. **Always verify signatures** - Never trust client-side data alone
3. **Validate amounts** - Ensure payment amount matches order
4. **Check order status** - Prevent duplicate payments
5. **Use HTTPS** - Required for production

---

## 🚀 Implementation Order

1. Install package and add env vars
2. Create config file
3. Create utility functions
4. Create API routes
5. Create payment component
6. Update CheckoutForm
7. Test with test API
8. Switch to live API when ready

---

**Ready to proceed?** Review this plan and confirm if you want any changes before I start implementation.

