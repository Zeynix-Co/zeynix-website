'use client';

import { useCartStore } from '@/store';
import { colorClasses } from '@/lib/constants';
import { Package, Truck, CreditCard } from 'lucide-react';

export default function OrderSummary() {
    const { items, totalAmount } = useCartStore();

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
        }).format(price);
    };

    const calculateSubtotal = () => {
        return items.reduce((total, item) => {
            // Use discounted price if available and less than original price
            const price = (item.product.discountPrice && item.product.discountPrice < item.product.price)
                ? item.product.discountPrice
                : item.product.price;
            return total + (price * item.quantity);
        }, 0);
    };

    const subtotal = calculateSubtotal();
    const shipping = 0; // Free shipping for now
    const total = subtotal + shipping;

    return (
        <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="mb-6">
                <h2 className={`text-xl font-semibold ${colorClasses.primary.text} mb-2`}>
                    Order Summary
                </h2>
                <p className="text-gray-600">Review your order details</p>
            </div>

            {/* Cart Items */}
            <div className="space-y-4 mb-6">
                <h3 className="font-medium text-gray-900">Items ({items.length})</h3>
                {items.map((item) => (
                    <div key={item.id} className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
                        <div className="flex-shrink-0">
                            <img
                                src={item.product.images[0]}
                                alt={item.product.title}
                                className="w-16 h-16 object-cover rounded-md"
                            />
                        </div>
                        <div className="flex-1 min-w-0">
                            <h4 className="text-sm font-medium text-gray-900 truncate">
                                {item.product.title}
                            </h4>
                            <p className="text-sm text-gray-500">
                                Size: {item.size} | Qty: {item.quantity}
                            </p>
                        </div>
                        <div className="flex-shrink-0 text-right">
                            <p className="text-sm font-medium text-gray-900">
                                {formatPrice((item.product.discountPrice || item.product.price) * item.quantity)}
                            </p>
                            {item.product.discountPrice && item.product.discountPrice < item.product.price && (
                                <p className="text-xs text-gray-500 line-through">
                                    {formatPrice(item.product.price * item.quantity)}
                                </p>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {/* Pricing Breakdown */}
            <div className="border-t pt-4 space-y-3">
                <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-medium text-gray-600">{formatPrice(subtotal)}</span>
                </div>

                <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Shipping</span>
                    <span className="font-medium text-green-600">
                        {shipping === 0 ? 'Free' : formatPrice(shipping)}
                    </span>
                </div>

                {items.some(item => item.product.discountPrice) && (
                    <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Total Savings</span>
                        <span className="font-medium text-green-600">
                            {formatPrice(
                                items.reduce((total, item) => {
                                    if (item.product.discountPrice) {
                                        return total + ((item.product.discountPrice - item.product.price) * item.quantity);
                                    }
                                    return total;
                                }, 0)
                            )}
                        </span>
                    </div>
                )}

                <div className="border-t pt-3">
                    <div className={`flex justify-between text-lg font-bold ${colorClasses.primary.text}`}>
                        <span>Total</span>
                        <span className={colorClasses.primary.text}>
                            {formatPrice(total)}
                        </span>
                    </div>
                </div>
            </div>

            {/* Order Information */}
            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-3">Order Information</h4>
                <div className="space-y-2 text-sm text-gray-600">
                    <div className="flex items-center">
                        <Package className="w-4 h-4 mr-2" />
                        <span>Order will be processed within 10 mins</span>
                    </div>
                    <div className="flex items-center">
                        <Truck className="w-4 h-4 mr-2" />
                        <span>Delivered within 30-45 mins</span>
                    </div>
                    <div className="flex items-center">
                        <CreditCard className="w-4 h-4 mr-2" />
                        <span>Payment integration coming soon</span>
                    </div>
                </div>
            </div>

            {/* Security Notice */}
            <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="text-center">
                    <p className="text-xs text-blue-800">
                        Your order information is secure and encrypted. We never store your payment details.
                    </p>
                </div>
            </div>
        </div>
    );
}
