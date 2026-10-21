export interface CouponDefinition {
    code: string;
    discountPercent: number;
    title: string;
    description: string;
    badgeText: string;
}

// Configured CEO code (defaults to 'Mubashshir')
const CONFIGURED_CEO_CODE = (process.env.NEXT_PUBLIC_CEO_COUPON_CODE || 'MUBASHSHIR').trim().toUpperCase();

export const VALID_COUPONS: CouponDefinition[] = [
    {
        code: CONFIGURED_CEO_CODE,
        discountPercent: 10,
        title: 'CEO Special Discount',
        description: 'Special 10% discount on entire order',
        badgeText: 'CEO Special (10% OFF)',
    },
    // Also include canonical fallback if env is set differently
    ...(CONFIGURED_CEO_CODE !== 'MUBASHSHIR' ? [{
        code: 'MUBASHSHIR',
        discountPercent: 10,
        title: 'CEO Special Discount',
        description: 'Special 10% discount on entire order',
        badgeText: 'CEO Special (10% OFF)',
    }] : []),
];

/**
 * Validates a promo code. Case-insensitive and trimmed.
 * e.g., 'Mubashshir', 'mubashshir', 'MUBASHSHIR' all match.
 */
export function validateCoupon(inputCode?: string | null): CouponDefinition | null {
    if (!inputCode) return null;
    const clean = inputCode.trim().toUpperCase();
    return VALID_COUPONS.find((coupon) => coupon.code === clean) || null;
}

/**
 * Calculates discount amount based on subtotal and discount percentage.
 */
export function calculateCouponDiscount(subtotal: number, discountPercent: number): number {
    if (subtotal <= 0 || discountPercent <= 0) return 0;
    return Math.round((subtotal * discountPercent) / 100);
}
