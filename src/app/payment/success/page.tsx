'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuthStore } from '@/store';
import { useCartStore } from '@/store';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { CheckCircle, ArrowRight, Package, Clock } from 'lucide-react';
import { colorClasses } from '@/lib/constants';
import Link from 'next/link';

interface PaymentSuccessData {
    orderId: string;
    transactionId: string;
    amount: number;
    paymentStatus: string;
    orderStatus: string;
    createdAt: string;
}

export default function PaymentSuccessPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { isAuthenticated } = useAuthStore();
    const { clearCart } = useCartStore();

    const [paymentData, setPaymentData] = useState<PaymentSuccessData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const orderId = searchParams.get('orderId');
    const transactionId = searchParams.get('transactionId');

    useEffect(() => {
        if (!isAuthenticated) {
            router.push('/login');
            return;
        }

        if (!orderId) {
            setError('Order ID not found');
            setLoading(false);
            return;
        }

        // Clear cart on successful payment
        clearCart();

        // Fetch payment details
        fetchPaymentStatus();
    }, [isAuthenticated, orderId, router, clearCart]);

    const fetchPaymentStatus = async () => {
        try {
            const response = await fetch(`/api/paytm/status?orderId=${orderId}`);
            const data = await response.json();

            if (data.success) {
                setPaymentData(data.data);
            } else {
                setError(data.message || 'Failed to fetch payment details');
            }
        } catch (error) {
            console.error('Error fetching payment status:', error);
            setError('Failed to fetch payment details');
        } finally {
            setLoading(false);
        }
    };

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
        }).format(price);
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-IN', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Verifying payment...</p>
                </div>
            </div>
        );
    }

    if (error || !paymentData) {
        return (
            <div className="min-h-screen bg-gray-50">
                <Header />
                <div className="max-w-2xl mx-auto px-4 py-16">
                    <div className="bg-white rounded-lg shadow-lg p-8 text-center">
                        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Package className="w-8 h-8 text-red-600" />
                        </div>
                        <h1 className="text-2xl font-bold text-gray-900 mb-2">Payment Verification Failed</h1>
                        <p className="text-gray-600 mb-6">{error || 'Unable to verify payment details'}</p>
                        <div className="space-y-3">
                            <Link
                                href="/account/orders"
                                className={`inline-flex items-center px-6 py-3 rounded-md ${colorClasses.primary.bg} text-white hover:opacity-90 transition-opacity`}
                            >
                                View Orders
                            </Link>
                            <Link
                                href="/products"
                                className="inline-flex items-center px-6 py-3 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors ml-3"
                            >
                                Continue Shopping
                            </Link>
                        </div>
                    </div>
                </div>
                <Footer />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <Header />

            <div className="max-w-4xl mx-auto px-4 py-16">
                {/* Success Header */}
                <div className="text-center mb-8">
                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <CheckCircle className="w-12 h-12 text-green-600" />
                    </div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Payment Successful!</h1>
                    <p className="text-gray-600">Your order has been confirmed and payment has been processed.</p>
                </div>

                {/* Payment Details Card */}
                <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
                    <h2 className="text-xl font-semibold text-gray-900 mb-6">Payment Details</h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-500 mb-1">Order ID</label>
                            <p className="text-lg font-mono text-gray-900">{paymentData.orderId}</p>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-500 mb-1">Transaction ID</label>
                            <p className="text-lg font-mono text-gray-900">{paymentData.transactionId}</p>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-500 mb-1">Amount Paid</label>
                            <p className="text-2xl font-bold text-green-600">{formatPrice(paymentData.amount)}</p>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-500 mb-1">Payment Method</label>
                            <p className="text-lg text-gray-900">Paytm</p>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-500 mb-1">Order Status</label>
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                                {paymentData.orderStatus}
                            </span>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-500 mb-1">Order Date</label>
                            <p className="text-lg text-gray-900">{formatDate(paymentData.createdAt)}</p>
                        </div>
                    </div>
                </div>

                {/* Next Steps */}
                <div className="bg-blue-50 rounded-lg p-6 mb-8">
                    <h3 className="text-lg font-semibold text-blue-900 mb-4">What&apos;s Next?</h3>
                    <div className="space-y-3">
                        <div className="flex items-center text-blue-800">
                            <Clock className="w-5 h-5 mr-3" />
                            <span>You will receive an order confirmation email shortly</span>
                        </div>
                        <div className="flex items-center text-blue-800">
                            <Package className="w-5 h-5 mr-3" />
                            <span>Your order will be processed and shipped within 1-2 business days</span>
                        </div>
                        <div className="flex items-center text-blue-800">
                            <CheckCircle className="w-5 h-5 mr-3" />
                            <span>You can track your order status in your account dashboard</span>
                        </div>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Link
                        href={`/account/orders/${paymentData.orderId}`}
                        className={`inline-flex items-center px-8 py-3 rounded-md ${colorClasses.primary.bg} text-white hover:opacity-90 transition-opacity`}
                    >
                        View Order Details
                        <ArrowRight className="w-5 h-5 ml-2" />
                    </Link>

                    <Link
                        href="/account/orders"
                        className="inline-flex items-center px-8 py-3 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                        All Orders
                    </Link>

                    <Link
                        href="/products"
                        className="inline-flex items-center px-8 py-3 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                        Continue Shopping
                    </Link>
                </div>
            </div>

            <Footer />
        </div>
    );
}
