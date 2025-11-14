'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { colorClasses } from '@/lib/constants';
import { Loader2, CreditCard } from 'lucide-react';

interface RazorpayPaymentProps {
    orderId: string;
    amount: number;
    onPaymentSuccess?: (razorpayOrderId: string, razorpayPaymentId: string) => void;
    onPaymentFailure?: (error: string) => void;
}

// Razorpay payment response interface
interface RazorpayPaymentResponse {
    razorpay_order_id: string;
    razorpay_payment_id: string;
    razorpay_signature: string;
}

interface RazorpayPaymentError {
    error?: {
        description?: string;
        code?: string;
        source?: string;
        step?: string;
        reason?: string;
    };
}

interface RazorpayOptions {
    key: string;
    amount: number;
    currency: string;
    name: string;
    description: string;
    order_id: string;
    handler: (response: RazorpayPaymentResponse) => void | Promise<void>;
    prefill?: Record<string, unknown>;
    notes?: Record<string, string>;
    theme?: {
        color?: string;
    };
    modal?: {
        ondismiss?: () => void;
    };
}

interface RazorpayInstance {
    open: () => void;
    on: (event: string, handler: (response: RazorpayPaymentError) => void) => void;
}

interface RazorpayConstructor {
    new(options: RazorpayOptions): RazorpayInstance;
}

// Extend Window interface for Razorpay
declare global {
    interface Window {
        Razorpay: RazorpayConstructor;
    }
}

export default function RazorpayPayment({
    orderId,
    amount,
    onPaymentSuccess,
    onPaymentFailure
}: RazorpayPaymentProps) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Load Razorpay checkout script
    useEffect(() => {
        const loadRazorpaySDK = () => {
            return new Promise((resolve, reject) => {
                if (window.Razorpay) {
                    resolve(window.Razorpay);
                    return;
                }

                const script = document.createElement('script');
                script.src = 'https://checkout.razorpay.com/v1/checkout.js';
                script.async = true;
                script.onload = () => resolve(window.Razorpay);
                script.onerror = () => reject(new Error('Failed to load Razorpay SDK'));
                document.body.appendChild(script);
            });
        };

        loadRazorpaySDK().catch(console.error);
    }, []);

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
        }).format(price);
    };

    const initiatePayment = async () => {
        try {
            setLoading(true);
            setError(null);

            // Step 1: Create Razorpay order via API
            const response = await fetch('/api/razorpay/create-order', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({ orderId }),
            });

            const data = await response.json();

            if (!data.success) {
                throw new Error(data.message || 'Failed to create payment order');
            }

            // Extract Razorpay order details
            const { razorpayOrderId: orderIdFromAPI, key, razorpayAmount, currency, receipt } = data.data;

            // Step 2: Initialize Razorpay checkout
            if (!window.Razorpay) {
                throw new Error('Razorpay SDK not loaded. Please refresh the page.');
            }

            const options = {
                key: key, // Razorpay key ID from API
                amount: razorpayAmount, // Amount in paise from Razorpay order (already created)
                currency: currency || 'INR',
                name: 'Zeynix',
                description: `Order #${receipt || orderId}`,
                order_id: orderIdFromAPI, // Razorpay order ID - when provided, amount must match
                handler: async function (response: RazorpayPaymentResponse) {
                    // Payment successful - verify on server
                    try {
                        setLoading(true);

                        // Step 3: Verify payment on server
                        const verifyResponse = await fetch('/api/razorpay/verify-payment', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            credentials: 'include',
                            body: JSON.stringify({
                                razorpayOrderId: response.razorpay_order_id,
                                razorpayPaymentId: response.razorpay_payment_id,
                                razorpaySignature: response.razorpay_signature,
                                orderId: orderId, // Your order ID
                            }),
                        });

                        const verifyData = await verifyResponse.json();

                        if (verifyData.success && verifyData.data.isValid) {
                            // Payment verified successfully
                            onPaymentSuccess?.(
                                response.razorpay_order_id,
                                response.razorpay_payment_id
                            );
                            router.push(
                                `/payment/success?orderId=${orderId}&razorpayOrderId=${response.razorpay_order_id}&razorpayPaymentId=${response.razorpay_payment_id}`
                            );
                        } else {
                            // Payment verification failed
                            const errorMessage = verifyData.message || 'Payment verification failed';
                            onPaymentFailure?.(errorMessage);
                            router.push(
                                `/payment/failure?orderId=${orderId}&error=${encodeURIComponent(errorMessage)}`
                            );
                        }
                    } catch (verifyError) {
                        console.error('Payment verification error:', verifyError);
                        const errorMessage = verifyError instanceof Error ? verifyError.message : 'Payment verification failed';
                        onPaymentFailure?.(errorMessage);
                        router.push(
                            `/payment/failure?orderId=${orderId}&error=${encodeURIComponent(errorMessage)}`
                        );
                    } finally {
                        setLoading(false);
                    }
                },
                prefill: {
                    // Pre-fill customer details if available
                },
                notes: {
                    order_id: orderId,
                },
                theme: {
                    color: '#6366f1', // Indigo color matching your theme
                },
                modal: {
                    ondismiss: function () {
                        // User closed the payment modal
                        setLoading(false);
                        setError('Payment cancelled by user');
                    },
                },
            };

            // Step 4: Open Razorpay checkout
            const razorpay = new window.Razorpay(options);
            razorpay.on('payment.failed', function (response: RazorpayPaymentError) {
                // Payment failed
                setLoading(false);
                const errorMessage = response.error?.description || 'Payment failed';
                setError(errorMessage);
                onPaymentFailure?.(errorMessage);
            });

            razorpay.open();
            setLoading(false);

        } catch (error) {
            console.error('Payment initiation error:', error);
            setError(error instanceof Error ? error.message : 'Payment failed. Please try again.');
            setLoading(false);
            onPaymentFailure?.(error instanceof Error ? error.message : 'Payment failed. Please try again.');
        }
    };

    return (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Complete Payment</h3>
                <p className="text-gray-600">Pay securely using UPI, Cards, Net Banking, or Wallets</p>
            </div>

            {/* Error Message */}
            {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-red-800 text-sm">{error}</p>
                </div>
            )}

            {/* Payment Summary */}
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <div className="flex justify-between items-center">
                    <span className="text-gray-600">Total Amount</span>
                    <span className="text-2xl font-bold text-gray-900">{formatPrice(amount)}</span>
                </div>
                <div className="text-sm text-gray-500 mt-1">
                    Order ID: {orderId}
                </div>
            </div>

            {/* Pay Button */}
            <Button
                onClick={initiatePayment}
                disabled={loading}
                className={`w-full ${colorClasses.primary.bg} text-white hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed`}
            >
                {loading ? (
                    <>
                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                        Processing Payment...
                    </>
                ) : (
                    <>
                        <CreditCard className="w-5 h-5 mr-2" />
                        Pay {formatPrice(amount)}
                    </>
                )}
            </Button>

            {/* Security Notice */}
            <div className="mt-4 text-center">
                <p className="text-xs text-gray-500">
                    🔒 Your payment is secured by Razorpay&apos;s 256-bit SSL encryption
                </p>
            </div>
        </div>
    );
}

