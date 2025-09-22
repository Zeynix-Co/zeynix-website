'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { colorClasses } from '@/lib/constants';
import { Loader2, CreditCard, Smartphone, Building2, Wallet } from 'lucide-react';

interface PaytmPaymentProps {
    orderId: string;
    amount: number;
    onPaymentSuccess?: (transactionId: string) => void;
    onPaymentFailure?: (error: string) => void;
}

interface PaymentMethod {
    id: string;
    name: string;
    icon: React.ReactNode;
    description: string;
    enabled: boolean;
}

const PAYMENT_METHODS: PaymentMethod[] = [
    {
        id: 'UPI',
        name: 'UPI',
        icon: <Smartphone className="w-6 h-6" />,
        description: 'Pay using UPI apps like PhonePe, Google Pay, Paytm',
        enabled: true
    },
    {
        id: 'CARD',
        name: 'Credit/Debit Card',
        icon: <CreditCard className="w-6 h-6" />,
        description: 'Pay using your credit or debit card',
        enabled: true
    },
    {
        id: 'NET_BANKING',
        name: 'Net Banking',
        icon: <Building2 className="w-6 h-6" />,
        description: 'Pay using your bank account',
        enabled: true
    },
    {
        id: 'WALLET',
        name: 'Paytm Wallet',
        icon: <Wallet className="w-6 h-6" />,
        description: 'Pay using your Paytm wallet balance',
        enabled: true
    }
];

export default function PaytmPayment({
    orderId,
    amount,
    onPaymentSuccess,
    onPaymentFailure
}: PaytmPaymentProps) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [selectedMethod, setSelectedMethod] = useState<string>('UPI');
    const [paymentData, setPaymentData] = useState<Record<string, unknown> | null>(null);
    const [error, setError] = useState<string | null>(null);

    // Load Paytm JS SDK
    useEffect(() => {
        const loadPaytmSDK = () => {
            return new Promise((resolve, reject) => {
                if (window.Paytm) {
                    resolve(window.Paytm);
                    return;
                }

                const script = document.createElement('script');
                // Use environment-based URL
                const isProduction = process.env.NODE_ENV === 'production';
                const scriptUrl = isProduction
                    ? 'https://securegw.paytm.in/merchantpgpui/checkoutjs/merchants/PaytmTest.js'
                    : 'https://securegw-stage.paytm.in/merchantpgpui/checkoutjs/merchants/PaytmTest.js';

                script.src = scriptUrl;
                script.async = true;
                script.onload = () => resolve(window.Paytm);
                script.onerror = () => reject(new Error('Failed to load Paytm SDK'));
                document.head.appendChild(script);
            });
        };

        loadPaytmSDK().catch(console.error);
    }, []);

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
        }).format(price);
    };

    const handlePaymentMethodChange = (methodId: string) => {
        setSelectedMethod(methodId);
        setError(null);
    };

    const initiatePayment = async () => {
        try {
            setLoading(true);
            setError(null);

            // Create payment order
            const response = await fetch('/api/paytm/create-order', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ orderId }),
            });

            const data = await response.json();

            if (!data.success) {
                throw new Error(data.message || 'Failed to create payment order');
            }

            setPaymentData(data.data);

            // Initialize Paytm checkout
            if (window.Paytm) {
                const paytmConfig = {
                    root: '',
                    flow: 'DEFAULT',
                    data: {
                        orderId: data.data.paymentParams.ORDER_ID,
                        token: data.data.paymentParams.CHECKSUMHASH,
                        tokenType: 'TXN_TOKEN',
                        amount: data.data.paymentParams.TXN_AMOUNT,
                        userInfo: {
                            custId: data.data.paymentParams.CUST_ID,
                            mobile: data.data.paymentParams.MOBILE_NO,
                            email: data.data.paymentParams.EMAIL,
                        },
                        callbackUrl: data.data.paytmConfig.callbackUrl,
                        mid: data.data.paytmConfig.mid,
                        txnUrl: data.data.paytmConfig.txnUrl,
                        paymentMode: selectedMethod,
                        displayMode: 'DEFAULT',
                        enableLogging: true,
                        merchantLimit: false,
                        removePopup: false,
                        merchant: {
                            redirect: true,
                        },
                        handler: {
                            notifyMerchant: function (eventName: string, data: Record<string, unknown>) {
                                console.log('Paytm notification:', eventName, data);
                            },
                        },
                    },
                };

                window.Paytm.CheckoutJS.init(paytmConfig).then(function () {
                    window.Paytm.CheckoutJS.invoke();
                }).catch(function (error: Error) {
                    console.error('Paytm checkout error:', error);
                    setError('Failed to initialize payment. Please try again.');
                    setLoading(false);
                });
            } else {
                throw new Error('Paytm SDK not loaded');
            }

        } catch (error) {
            console.error('Payment initiation error:', error);
            setError(error instanceof Error ? error.message : 'Payment failed. Please try again.');
            setLoading(false);
        }
    };

    // Handle payment success/failure
    useEffect(() => {
        const handlePaymentResult = (event: MessageEvent) => {
            if (event.data && event.data.type === 'PAYTM_PAYMENT_RESULT') {
                setLoading(false);

                if (event.data.success) {
                    onPaymentSuccess?.(event.data.transactionId);
                    router.push(`/payment/success?orderId=${orderId}&transactionId=${event.data.transactionId}`);
                } else {
                    onPaymentFailure?.(event.data.error);
                    router.push(`/payment/failure?orderId=${orderId}&error=${encodeURIComponent(event.data.error)}`);
                }
            }
        };

        window.addEventListener('message', handlePaymentResult);
        return () => window.removeEventListener('message', handlePaymentResult);
    }, [orderId, onPaymentSuccess, onPaymentFailure, router]);

    return (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Select Payment Method</h3>
                <p className="text-gray-600">Choose your preferred payment method to complete the order</p>
            </div>

            {/* Payment Methods */}
            <div className="space-y-3 mb-6">
                {PAYMENT_METHODS.map((method) => (
                    <label
                        key={method.id}
                        className={`flex items-center p-4 border rounded-lg cursor-pointer transition-colors ${selectedMethod === method.id
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-200 hover:border-gray-300'
                            } ${!method.enabled ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                        <input
                            type="radio"
                            name="paymentMethod"
                            value={method.id}
                            checked={selectedMethod === method.id}
                            onChange={() => handlePaymentMethodChange(method.id)}
                            disabled={!method.enabled}
                            className="sr-only"
                        />
                        <div className="flex items-center flex-1">
                            <div className={`mr-4 ${selectedMethod === method.id ? 'text-blue-600' : 'text-gray-400'}`}>
                                {method.icon}
                            </div>
                            <div className="flex-1">
                                <div className="font-medium text-gray-900">{method.name}</div>
                                <div className="text-sm text-gray-500">{method.description}</div>
                            </div>
                        </div>
                        {selectedMethod === method.id && (
                            <div className="w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center">
                                <div className="w-2 h-2 bg-white rounded-full"></div>
                            </div>
                        )}
                    </label>
                ))}
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
                disabled={loading || !selectedMethod}
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
                    🔒 Your payment is secured by Paytm&apos;s 256-bit SSL encryption
                </p>
            </div>
        </div>
    );
}

// Extend Window interface for Paytm
declare global {
    interface Window {
        Paytm: {
            CheckoutJS: {
                init: (config: Record<string, unknown>) => Promise<void>;
                invoke: () => void;
            };
        };
    }
}
