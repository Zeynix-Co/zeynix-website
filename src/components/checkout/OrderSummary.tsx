'use client';

import { useCartStore } from '@/store';
import { colorClasses } from '@/lib/constants';
import { Package, Truck, CreditCard, Plus, Minus, Trash2, Check, AlertCircle, Tag } from 'lucide-react';
import PromoCodeBox from '@/components/checkout/PromoCodeBox';

export default function OrderSummary() {
    const {
        items,
        appliedCoupon,
        toggleSelectItem,
        selectAllItems,
        unselectAllItems,
        updateItemQuantity,
        removeItemById,
    } = useCartStore();

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
        }).format(price);
    };

    const selectedItems = items.filter((item) => item.selected !== false);
    const allSelected = items.length > 0 && selectedItems.length === items.length;
    const noneSelected = selectedItems.length === 0;

    // Calculate subtotal for selected items only
    const calculateSubtotal = () => {
        return selectedItems.reduce((total, item) => {
            const price = item.customization
                ? (item.customization.basePrice + item.customization.customizationPrice)
                : ((item.product.discountPrice && item.product.discountPrice < item.product.price)
                    ? item.product.discountPrice
                    : item.product.price);
            return total + (price * item.quantity);
        }, 0);
    };

    // Calculate total savings for selected items
    const calculateSavings = () => {
        return selectedItems.reduce((total, item) => {
            if (item.product.discountPrice && item.product.discountPrice < item.product.price) {
                return total + ((item.product.price - item.product.discountPrice) * item.quantity);
            }
            return total;
        }, 0);
    };

    const subtotal = calculateSubtotal();
    const savings = calculateSavings();
    const couponDiscount = appliedCoupon
        ? Math.round((subtotal * appliedCoupon.discountPercent) / 100)
        : 0;
    const shipping = 0; // Free shipping
    const total = Math.max(0, subtotal - couponDiscount + shipping);

    const getItemUnitPrice = (item: typeof items[0]) => {
        if (item.customization) {
            return item.customization.basePrice + item.customization.customizationPrice;
        }
        return (item.product.discountPrice && item.product.discountPrice < item.product.price)
            ? item.product.discountPrice
            : item.product.price;
    };

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-4 lg:p-6 transition-all">
            {/* Header */}
            <div className="mb-4 lg:mb-5 pb-3 border-b border-gray-100">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className={`text-lg lg:text-xl font-extrabold uppercase tracking-tight ${colorClasses.primary.text}`}>
                            Order Summary
                        </h2>
                        <p className="text-xs text-gray-500 mt-0.5">
                            Select items & adjust quantities for this order
                        </p>
                    </div>
                    {items.length > 0 && (
                        <button
                            type="button"
                            onClick={() => (allSelected ? unselectAllItems() : selectAllItems())}
                            className="text-xs font-semibold text-[#070F2B] hover:text-[#B5945B] transition-colors underline cursor-pointer"
                        >
                            {allSelected ? 'Deselect All' : 'Select All'}
                        </button>
                    )}
                </div>
            </div>

            {/* Selection Status Banner */}
            {items.length > 0 && (
                <div className="flex items-center justify-between text-xs font-medium text-gray-600 mb-3 bg-gray-50 px-3 py-2 rounded-lg border border-gray-200/60">
                    <span>
                        Selected for Order: <strong className="text-[#070F2B] font-bold">{selectedItems.length}</strong> of {items.length} items
                    </span>
                    {noneSelected && (
                        <span className="text-amber-600 font-semibold flex items-center gap-1">
                            <AlertCircle className="w-3.5 h-3.5" /> None selected
                        </span>
                    )}
                </div>
            )}

            {/* Warning if 0 items are selected */}
            {noneSelected && items.length > 0 && (
                <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-800">
                    <p className="font-semibold">⚠️ No items selected for order</p>
                    <p className="mt-0.5 text-amber-700">
                        Check the box next to any product below that you want to include in this order.
                    </p>
                    <button
                        type="button"
                        onClick={selectAllItems}
                        className="mt-2 text-xs font-bold text-amber-900 underline hover:text-black cursor-pointer"
                    >
                        Select all items now
                    </button>
                </div>
            )}

            {/* Cart Items List */}
            <div className="space-y-3 mb-5 max-h-[420px] overflow-y-auto pr-1">
                {items.length === 0 ? (
                    <div className="text-center py-8 text-gray-500 text-sm">
                        Your cart is empty.
                    </div>
                ) : (
                    items.map((item) => {
                        const isSelected = item.selected !== false;
                        const unitPrice = getItemUnitPrice(item);
                        const itemTotal = unitPrice * item.quantity;
                        const originalTotal = item.product.price * item.quantity;
                        const hasDiscount = item.product.discountPrice && item.product.discountPrice < item.product.price;

                        return (
                            <div
                                key={item.id}
                                className={`relative flex items-start gap-3 p-3 rounded-xl border transition-all ${
                                    isSelected
                                        ? 'bg-white border-gray-200 shadow-[0_2px_8px_rgba(7,15,43,0.04)]'
                                        : 'bg-gray-50/70 border-gray-200/60 opacity-60'
                                }`}
                            >
                                {/* Checkbox */}
                                <div className="pt-1 flex-shrink-0">
                                    <button
                                        type="button"
                                        onClick={() => toggleSelectItem(item.id)}
                                        aria-label={isSelected ? `Deselect ${item.product.title}` : `Select ${item.product.title}`}
                                        className={`w-5 h-5 rounded flex items-center justify-center border transition-all cursor-pointer ${
                                            isSelected
                                                ? 'bg-[#070F2B] border-[#070F2B] text-white shadow-sm'
                                                : 'bg-white border-gray-300 hover:border-gray-500 text-transparent'
                                        }`}
                                    >
                                        <Check className={`w-3.5 h-3.5 ${isSelected ? 'opacity-100' : 'opacity-0'}`} />
                                    </button>
                                </div>

                                {/* Thumbnail */}
                                <div className="relative flex-shrink-0">
                                    <img
                                        src={item.product.images[0] || '/images/products/placeholder.jpg'}
                                        alt={item.product.title}
                                        className={`w-14 h-14 lg:w-16 lg:h-16 object-cover rounded-lg border border-gray-100 ${
                                            !isSelected ? 'filter grayscale contrast-75' : ''
                                        }`}
                                    />
                                    {!isSelected && (
                                        <span className="absolute inset-0 bg-white/40 rounded-lg flex items-center justify-center text-[9px] font-bold text-gray-700 uppercase">
                                            Excluded
                                        </span>
                                    )}
                                </div>

                                {/* Item Info & Controls */}
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-start justify-between gap-2">
                                        <h4 className={`text-xs lg:text-sm font-semibold line-clamp-2 leading-snug ${
                                            isSelected ? 'text-gray-900' : 'text-gray-500 line-through'
                                        }`}>
                                            {item.product.title}
                                        </h4>

                                        <button
                                            type="button"
                                            onClick={() => removeItemById(item.id)}
                                            className="text-gray-400 hover:text-red-500 p-1 transition-colors cursor-pointer"
                                            title="Remove item from cart"
                                        >
                                            <Trash2 className="w-3.5 h-3.5" />
                                        </button>
                                    </div>

                                    {/* Size and Unit Price */}
                                    <div className="flex flex-wrap items-center gap-2 mt-1 text-xs text-gray-500">
                                        <span className="inline-block bg-gray-100 px-1.5 py-0.5 rounded text-[10px] font-bold text-gray-700">
                                            Size: {item.size}
                                        </span>
                                        <span>₹{unitPrice} each</span>
                                    </div>

                                    {/* Quantity Stepper & Item Total */}
                                    <div className="flex items-center justify-between mt-2.5 pt-1">
                                        {/* Quantity Stepper */}
                                        <div className="flex items-center border border-gray-200 rounded-lg bg-gray-50 overflow-hidden">
                                            <button
                                                type="button"
                                                onClick={() => updateItemQuantity(item.id, item.quantity - 1)}
                                                disabled={item.quantity <= 1}
                                                className="w-7 h-7 flex items-center justify-center hover:bg-gray-200 text-gray-700 disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
                                                title="Decrease quantity"
                                            >
                                                <Minus className="w-3 h-3" />
                                            </button>
                                            <span className="w-8 text-center text-xs font-bold text-gray-900 select-none">
                                                {item.quantity}
                                            </span>
                                            <button
                                                type="button"
                                                onClick={() => updateItemQuantity(item.id, item.quantity + 1)}
                                                className="w-7 h-7 flex items-center justify-center hover:bg-gray-200 text-gray-700 transition-colors cursor-pointer"
                                                title="Increase quantity"
                                            >
                                                <Plus className="w-3 h-3" />
                                            </button>
                                        </div>

                                        {/* Total price for this item */}
                                        <div className="text-right">
                                            <p className={`text-xs lg:text-sm font-bold ${
                                                isSelected ? 'text-[#070F2B]' : 'text-gray-400 line-through'
                                            }`}>
                                                {formatPrice(itemTotal)}
                                            </p>
                                            {hasDiscount && isSelected && (
                                                <p className="text-[10px] text-gray-400 line-through">
                                                    {formatPrice(originalTotal)}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>

            {/* Promo / Coupon Code Section */}
            {items.length > 0 && (
                <div className="mb-4 pt-1">
                    <PromoCodeBox />
                </div>
            )}

            {/* Pricing Breakdown */}
            <div className="border-t border-gray-100 pt-3 lg:pt-4 space-y-2 lg:space-y-2.5 text-xs lg:text-sm">
                <div className="flex justify-between text-gray-600">
                    <span>Subtotal ({selectedItems.length} selected)</span>
                    <span className="font-semibold text-gray-900">{formatPrice(subtotal)}</span>
                </div>

                <div className="flex justify-between text-gray-600">
                    <span>Shipping</span>
                    <span className="font-semibold text-green-600 uppercase text-[11px] tracking-wider">
                        {shipping === 0 ? 'Free' : formatPrice(shipping)}
                    </span>
                </div>

                {savings > 0 && (
                    <div className="flex justify-between text-gray-600">
                        <span>Total Savings</span>
                        <span className="font-bold text-green-600">
                            - {formatPrice(savings)}
                        </span>
                    </div>
                )}

                {/* Special CEO / Promo Discount */}
                {couponDiscount > 0 && (
                    <div className="flex justify-between items-center text-xs lg:text-sm bg-emerald-50 px-3 py-2 rounded-xl border border-emerald-200">
                        <span className="font-bold text-emerald-900 flex items-center gap-1.5">
                            <Tag className="w-3.5 h-3.5 text-emerald-600" />
                            {appliedCoupon?.code} ({appliedCoupon?.discountPercent}% OFF)
                        </span>
                        <span className="font-black text-emerald-700">
                            - {formatPrice(couponDiscount)}
                        </span>
                    </div>
                )}

                <div className="border-t border-gray-200 pt-3 mt-1">
                    <div className={`flex justify-between text-base lg:text-lg font-black ${colorClasses.primary.text}`}>
                        <span>Total Payable</span>
                        <span className="text-[#070F2B]">
                            {formatPrice(total)}
                        </span>
                    </div>
                    {noneSelected && (
                        <p className="text-[11px] text-amber-600 mt-1 text-right">
                            * Select at least 1 item to calculate total
                        </p>
                    )}
                </div>
            </div>

            {/* Order Information */}
            <div className="mt-5 p-3.5 bg-gray-50/80 border border-gray-100 rounded-xl space-y-2 text-xs text-gray-600">
                <div className="flex items-center gap-2">
                    <Package className="w-4 h-4 text-[#B5945B] flex-shrink-0" />
                    <span>Instant dispatch processing within 10 minutes</span>
                </div>
                <div className="flex items-center gap-2">
                    <Truck className="w-4 h-4 text-[#B5945B] flex-shrink-0" />
                    <span>Express delivery within 3 business days</span>
                </div>
                <div className="flex items-center gap-2">
                    <CreditCard className="w-4 h-4 text-[#B5945B] flex-shrink-0" />
                    <span>UPI, Cards, Net Banking & WhatsApp confirmed</span>
                </div>
            </div>

            {/* Security Notice */}
            <div className="mt-3.5 p-2.5 bg-blue-50/60 border border-blue-100 rounded-lg text-center">
                <p className="text-[11px] text-blue-900 font-medium">
                    🔒 256-bit SSL encrypted. Safe & authenticated checkout.
                </p>
            </div>
        </div>
    );
}
