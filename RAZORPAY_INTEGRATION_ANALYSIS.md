# Razorpay Integration Analysis & Plan

## Current State Analysis

### Existing Paytm Integration

**Frontend Components:**
- `src/components/payment/PaytmPayment.tsx` - Main payment component with Paytm SDK integration
- `src/components/checkout/CheckoutForm.tsx` - Checkout form that renders PaytmPayment component

**Backend API Routes:**
- `/api/paytm/create-order` - Creates payment order for Paytm
- `/api/paytm/callback` - Handles Paytm payment callback (GET & POST)
- `/api/paytm/status` - Checks payment status

**Configuration & Utils:**
- `src/lib/config/paytm.ts` - Paytm configuration (test & production)
- `src/lib/utils/paytm-simple.ts` - Paytm utility functions

**Order Model:**
- Already has `razorpayOrderId` and `razorpayPaymentId` fields (currently reused for Paytm)
- Default `paymentMethod` is set to `'razorpay'` (but actual integration uses Paytm)
- Payment status: `pending`, `completed`, `failed`, `refunded`

### Key Observations

1. **Schema Ready for Razorpay**: The Order model already has fields for Razorpay, suggesting this was planned
2. **Payment Flow**: Order creation → Payment initiation → Callback handling → Status verification
3. **Current Payment Method**: Uses Paytm SDK with CheckoutJS
4. **Environment Variables**: Uses `PAYTM_MID_TEST`, `PAYTM_MERCHANT_KEY_TEST` for test environment

## What Can Be Done

### ✅ Advantages of Razorpay Over Paytm

1. **Better Developer Experience**: Cleaner API and better documentation
2. **Modern UI**: Razorpay checkout has a more modern, user-friendly interface
3. **Wider Payment Methods**: Better support for UPI, cards, wallets, net banking
4. **Better Analytics**: More detailed payment analytics and reporting
5. **Easier Integration**: Simpler integration process with Razorpay SDK
6. **Test Cards**: Better test card numbers and test UPI IDs for development

### 🔧 Integration Requirements

**Required Packages:**
- `razorpay` - Node.js SDK for backend (server-side operations)
- Razorpay Checkout (frontend) - CDN-based, no npm package needed

**Required Environment Variables:**
- `RAZORPAY_KEY_ID` - Your Razorpay API key (test)
- `RAZORPAY_KEY_SECRET` - Your Razorpay API secret (test)

**API Endpoints Needed:**
- `/api/razorpay/create-order` - Create Razorpay order
- `/api/razorpay/verify-payment` - Verify payment signature
- `/api/razorpay/callback` - Handle payment callback (optional, as Razorpay uses frontend callbacks)

## Step-by-Step Integration Plan

### Phase 1: Setup & Configuration
1. **Install Razorpay SDK**
   - Add `razorpay` package to `package.json`
   - Create Razorpay configuration file

2. **Environment Variables**
   - Add `RAZORPAY_KEY_ID` and `RAZORPAY_KEY_SECRET` to `.env.local`
   - Use your test credentials

### Phase 2: Backend Implementation
1. **Create Razorpay Config** (`src/lib/config/razorpay.ts`)
   - Configuration for test and production environments
   - Helper functions to get current config

2. **Create Razorpay Utils** (`src/lib/utils/razorpay.ts`)
   - Function to create Razorpay order
   - Function to verify payment signature
   - Function to update order payment status

3. **Create API Routes**
   - `/api/razorpay/create-order/route.ts` - Create order on Razorpay
   - `/api/razorpay/verify-payment/route.ts` - Verify payment signature

### Phase 3: Frontend Implementation
1. **Create Razorpay Payment Component** (`src/components/payment/RazorpayPayment.tsx`)
   - Load Razorpay checkout script
   - Initialize payment with order details
   - Handle payment success/failure callbacks
   - Redirect to success/failure pages

2. **Update CheckoutForm**
   - Replace `PaytmPayment` with `RazorpayPayment`
   - Update payment method labels
   - Update success messages

### Phase 4: Update Existing Code
1. **Update Payment Success Page**
   - Update to show "Razorpay" instead of "Paytm"
   - Update API calls to use Razorpay endpoints

2. **Update Order Model Usage**
   - Ensure `razorpayOrderId` and `razorpayPaymentId` are used correctly
   - Update payment method defaults

### Phase 5: Testing
1. **Test with Razorpay Test Credentials**
   - Test successful payment flow
   - Test failed payment scenarios
   - Test payment cancellation

2. **Verify Order Updates**
   - Ensure orders are updated correctly in database
   - Verify payment status updates

## Files to Create/Modify

### New Files:
1. `src/lib/config/razorpay.ts` - Razorpay configuration
2. `src/lib/utils/razorpay.ts` - Razorpay utility functions
3. `src/components/payment/RazorpayPayment.tsx` - Razorpay payment component
4. `src/app/api/razorpay/create-order/route.ts` - Create Razorpay order API
5. `src/app/api/razorpay/verify-payment/route.ts` - Verify payment API

### Files to Modify:
1. `package.json` - Add razorpay package
2. `src/components/checkout/CheckoutForm.tsx` - Replace PaytmPayment with RazorpayPayment
3. `src/app/payment/success/page.tsx` - Update payment method display
4. `.env.local` - Add Razorpay credentials

### Files to Consider (Optional):
- Keep Paytm files for reference or remove them after Razorpay is fully tested
- You can keep both integrations and allow users to choose (advanced)

## Important Notes

1. **Payment Flow Difference**:
   - **Paytm**: Uses server-side callback verification
   - **Razorpay**: Uses signature verification on the client and server
   - Razorpay doesn't require a separate callback endpoint (handles it via frontend callbacks)

2. **Amount Format**:
   - **Paytm**: Amount in rupees (e.g., 100.00)
   - **Razorpay**: Amount in paise (e.g., 10000 for ₹100)

3. **Order ID**:
   - Razorpay creates its own order ID (different from your order number)
   - Store both your order number and Razorpay order ID

4. **Payment Verification**:
   - Razorpay requires signature verification using the secret key
   - Always verify payment signature on the server before updating order status

## Security Considerations

1. **Never expose secret key**: Keep `RAZORPAY_KEY_SECRET` only on the server
2. **Verify signatures**: Always verify Razorpay payment signatures server-side
3. **Validate amounts**: Always verify payment amount matches order amount
4. **Check order status**: Verify order exists and hasn't been paid already

## Testing Checklist

- [ ] Test successful payment flow
- [ ] Test payment failure scenarios
- [ ] Test payment cancellation
- [ ] Verify order creation and updates
- [ ] Test with different payment methods (UPI, Card, Net Banking)
- [ ] Verify callback handling
- [ ] Test error handling
- [ ] Verify database updates

## Next Steps

1. **Review this plan** and approve
2. **Provide Razorpay test credentials** (if not already in .env)
3. **Decide**: Keep Paytm as fallback or fully replace?
4. **Proceed with implementation** following the phases above

---

**Estimated Implementation Time**: 2-3 hours
**Complexity**: Medium (similar to current Paytm integration)

