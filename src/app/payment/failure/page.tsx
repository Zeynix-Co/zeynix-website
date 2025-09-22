'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuthStore } from '@/store';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { XCircle, ArrowLeft, RefreshCw, Package } from 'lucide-react';
import { colorClasses } from '@/lib/constants';
import Link from 'next/link';

export default function PaymentFailurePage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { isAuthenticated } = useAuthStore();

    const [orderId, setOrderId] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!isAuthenticated) {
            router.push('/login');
            return;
        }

        const orderIdParam = searchParams.get('orderId');
        const errorParam = searchParams.get('error');

        setOrderId(orderIdParam);
        setError(errorParam);
    }, [isAuthenticated, searchParams, router]);

    const handleRetryPayment = () => {
        if (orderId) {
            router.push(`/checkout?retry=${orderId}`);
        } else {
            router.push('/checkout');
        }
    };

    const getErrorMessage = () => {
        if (error) {
            return error;
        }
        return 'Payment could not be processed. Please try again.';
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <Header />

            <div className="max-w-2xl mx-auto px-4 py-16">
                {/* Failure Header */}
                <div className="text-center mb-8">
                    <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <XCircle className="w-12 h-12 text-red-600" />
                    </div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Payment Failed</h1>
                    <p className="text-gray-600">We couldn&apos;t process your payment. Please try again.</p>
                </div>

                {/* Error Details Card */}
                <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">What happened?</h2>

                    <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                        <p className="text-red-800">{getErrorMessage()}</p>
                    </div>

                    {orderId && (
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-500 mb-1">Order ID</label>
                            <p className="text-lg font-mono text-gray-900">{orderId}</p>
                        </div>
                    )}

                    <div className="space-y-4">
                        <h3 className="text-lg font-medium text-gray-900">Common reasons for payment failure:</h3>
                        <ul className="space-y-2 text-gray-600">
                            <li className="flex items-start">
                                <span className="text-red-500 mr-2">•</span>
                                Insufficient funds in your account
                            </li>
                            <li className="flex items-start">
                                <span className="text-red-500 mr-2">•</span>
                                Incorrect card details or expired card
                            </li>
                            <li className="flex items-start">
                                <span className="text-red-500 mr-2">•</span>
                                Network connectivity issues
                            </li>
                            <li className="flex items-start">
                                <span className="text-red-500 mr-2">•</span>
                                Bank server temporarily unavailable
                            </li>
                            <li className="flex items-start">
                                <span className="text-red-500 mr-2">•</span>
                                Transaction was cancelled by you
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Help Section */}
                <div className="bg-blue-50 rounded-lg p-6 mb-8">
                    <h3 className="text-lg font-semibold text-blue-900 mb-4">Need Help?</h3>
                    <div className="space-y-3">
                        <div className="flex items-center text-blue-800">
                            <Package className="w-5 h-5 mr-3" />
                            <span>Your order is saved and you can retry payment anytime</span>
                        </div>
                        <div className="flex items-center text-blue-800">
                            <RefreshCw className="w-5 h-5 mr-3" />
                            <span>Try using a different payment method</span>
                        </div>
                        <div className="flex items-center text-blue-800">
                            <ArrowLeft className="w-5 h-5 mr-3" />
                            <span>Contact support if the problem persists</span>
                        </div>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <button
                        onClick={handleRetryPayment}
                        className={`inline-flex items-center px-8 py-3 rounded-md ${colorClasses.primary.bg} text-white hover:opacity-90 transition-opacity`}
                    >
                        <RefreshCw className="w-5 h-5 mr-2" />
                        Retry Payment
                    </button>

                    <Link
                        href="/checkout"
                        className="inline-flex items-center px-8 py-3 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5 mr-2" />
                        Back to Checkout
                    </Link>

                    <Link
                        href="/products"
                        className="inline-flex items-center px-8 py-3 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                        Continue Shopping
                    </Link>
                </div>

                {/* Support Contact */}
                <div className="mt-8 text-center">
                    <p className="text-gray-600 mb-2">Still having trouble?</p>
                    <Link
                        href="/contact"
                        className="text-blue-600 hover:text-blue-800 font-medium"
                    >
                        Contact our support team
                    </Link>
                </div>
            </div>

            <Footer />
        </div>
    );
}
