'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store';
import { useCartStore } from '@/store';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import CheckoutForm from '@/components/checkout/CheckoutForm';
import OrderSummary from '@/components/checkout/OrderSummary';
import { colorClasses } from '@/lib/constants';
import { ShoppingBag, ArrowLeft, CheckCircle } from 'lucide-react';
import Link from 'next/link';

export default function CheckoutPage() {
    const router = useRouter();
    const { isAuthenticated, user } = useAuthStore();
    const { items, totalItems } = useCartStore();
    const [orderCreated, setOrderCreated] = useState(false);
    const [orderId, setOrderId] = useState<string>('');

    // Handle redirects
    useEffect(() => {
        if (!isAuthenticated) {
            router.push('/login?redirect=/checkout');
            return;
        }

        if (totalItems === 0) {
            router.push('/cart');
            return;
        }
    }, [isAuthenticated, totalItems, router]);

    // Show loading or redirect if not ready
    if (!isAuthenticated || totalItems === 0) {
        return null;
    }

    const handleOrderCreated = (newOrderId: string) => {
        setOrderId(newOrderId);
        setOrderCreated(true);
    };

    const handleContinueShopping = () => {
        router.push('/products');
    };

    const handleViewOrders = () => {
        router.push('/account/orders');
    };

    if (orderCreated) {
        return (
            <div className="min-h-screen bg-gray-50">
                <Header />

                <main className="max-w-4xl mx-auto px-4 py-8">
                    {/* Breadcrumb */}
                    <nav className="flex items-center gap-2 text-sm text-gray-600 mb-6">
                        <Link href="/" className="hover:text-gray-900">Home</Link>
                        <span>/</span>
                        <Link href="/cart" className="hover:text-gray-900">Cart</Link>
                        <span>/</span>
                        <span className="text-gray-900">Checkout</span>
                    </nav>

                    {/* Order Success */}
                    <div className="bg-white rounded-lg shadow-sm border p-8 text-center">
                        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                            <CheckCircle className="w-12 h-12 text-green-600" />
                        </div>

                        <h1 className={`text-3xl font-bold ${colorClasses.primary.text} mb-4`}>
                            Order Created Successfully!
                        </h1>

                        <p className="text-gray-600 mb-6 max-w-md mx-auto">
                            Your order has been created and saved. We&apos;ll process it once payment integration is available.
                        </p>

                        <div className="bg-gray-50 rounded-lg p-4 mb-6">
                            <p className="text-sm text-gray-700">
                                <strong>Order ID:</strong> {orderId}
                            </p>
                            <p className="text-sm text-gray-700 mt-1">
                                <strong>Total Amount:</strong> ₹{items.reduce((total, item) => {
                                    const price = item.product.discountPrice || item.product.price;
                                    return total + (price * item.quantity);
                                }, 0).toLocaleString()}
                            </p>
                        </div>

                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8">
                            <h3 className="font-medium text-blue-800 mb-2">What&apos;s Next?</h3>
                            <ul className="text-sm text-blue-700 space-y-1 text-left max-w-md mx-auto">
                                <li>• Your order is saved in our system</li>
                                <li>• Payment integration will be available soon</li>
                                <li>• You&apos;ll receive updates via email</li>
                                <li>• Track your order in your account</li>
                            </ul>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-3 justify-center">
                            <button
                                onClick={handleViewOrders}
                                className={`px-6 py-3 rounded-md ${colorClasses.primary.bg} text-white hover:opacity-90 transition-opacity`}
                            >
                                View My Orders
                            </button>
                            <button
                                onClick={handleContinueShopping}
                                className="px-6 py-3 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
                            >
                                Continue Shopping
                            </button>
                        </div>
                    </div>
                </main>

                <Footer />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <Header />

            <main className="max-w-7xl mx-auto px-4 py-8">
                {/* Breadcrumb */}
                <nav className="flex items-center gap-2 text-sm text-gray-600 mb-6">
                    <Link href="/" className="hover:text-gray-900">Home</Link>
                    <span>/</span>
                    <Link href="/cart" className="hover:text-gray-900">Cart</Link>
                    <span>/</span>
                    <span className="text-gray-900">Checkout</span>
                </nav>

                {/* Page Header */}
                <div className="mb-8">
                    <div className="flex items-center gap-4 mb-4">
                        <Link
                            href="/cart"
                            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                            <ArrowLeft className="w-5 h-5" />
                        </Link>
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">Checkout</h1>
                            <p className="text-gray-600 mt-1">
                                Complete your order - {totalItems} item{totalItems !== 1 ? 's' : ''} in cart
                            </p>
                        </div>
                    </div>
                </div>

                {/* Checkout Content */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Checkout Form - Takes 2 columns on large screens */}
                    <div className="lg:col-span-2">
                        <CheckoutForm onOrderCreated={handleOrderCreated} />
                    </div>

                    {/* Order Summary - Takes 1 column on large screens */}
                    <div className="lg:col-span-1">
                        <OrderSummary />
                    </div>
                </div>

                {/* Additional Information */}
                <div className="mt-12 md:w-2/3">
                    <div className="bg-white rounded-lg shadow-sm border p-6">
                        <h2 className={`text-xl font-semibold ${colorClasses.primary.text} mb-4`}>
                            Need Help?
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <h3 className="font-medium text-gray-900 mb-2">Contact Support</h3>
                                <p className="text-sm text-gray-600 mb-2">
                                    Have questions about your order? Our support team is here to help.
                                </p>
                                <Link
                                    href="/contact"
                                    className={`text-sm ${colorClasses.primary.text} hover:underline`}
                                >
                                    Contact Us →
                                </Link>
                            </div>
                            <div>
                                <h3 className="font-medium text-gray-900 mb-2">Return Policy</h3>
                                <p className="text-sm text-gray-600 mb-2">
                                    Learn about our return and exchange policies.
                                </p>
                                <Link
                                    href="/about"
                                    className={`text-sm ${colorClasses.primary.text} hover:underline`}
                                >
                                    Learn More →
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
} 