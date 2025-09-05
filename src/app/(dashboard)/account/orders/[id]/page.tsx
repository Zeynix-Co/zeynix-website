'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAuthStore } from '@/store';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { ArrowLeft, Package, Clock, CheckCircle, XCircle, Truck, MapPin, Phone, Mail, Calendar } from 'lucide-react';
import { colorClasses } from '@/lib/constants';
import { Order, OrderResponse } from '@/types/order';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';

export default function OrderDetailPage() {
    const router = useRouter();
    const params = useParams();
    const { isAuthenticated } = useAuthStore();
    const [order, setOrder] = useState<Order | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const orderId = params.id as string;

    useEffect(() => {
        if (!isAuthenticated) {
            router.push('/login?redirect=/account/orders');
            return;
        }
        if (orderId) {
            fetchOrder();
        }
    }, [isAuthenticated, orderId]);

    const fetchOrder = async () => {
        try {
            setIsLoading(true);
            setError(null);

            const response = await fetch(`/api/orders/${orderId}`, {
                headers: {
                    'Authorization': `Bearer ${useAuthStore.getState().token}`,
                },
                credentials: 'include',
            });
            const result: OrderResponse = await response.json();

            if (result.success) {
                setOrder(result.data);
            } else {
                setError('Failed to load order details');
            }
        } catch (err) {
            console.error('Error fetching order:', err);
            setError('Failed to load order details');
        } finally {
            setIsLoading(false);
        }
    };

    const getStatusIcon = (status: Order['status']) => {
        switch (status) {
            case 'pending_payment':
                return <Clock className="w-5 h-5 text-yellow-500" />;
            case 'confirmed':
                return <Package className="w-5 h-5 text-blue-500" />;
            case 'processing':
                return <Package className="w-5 h-5 text-purple-500" />;
            case 'shipped':
                return <Truck className="w-5 h-5 text-indigo-500" />;
            case 'delivered':
                return <CheckCircle className="w-5 h-5 text-green-500" />;
            case 'cancelled':
                return <XCircle className="w-5 h-5 text-red-500" />;
            default:
                return <Clock className="w-5 h-5 text-gray-500" />;
        }
    };

    const getStatusColor = (status: Order['status']) => {
        switch (status) {
            case 'pending_payment':
                return 'bg-yellow-100 text-yellow-800';
            case 'confirmed':
                return 'bg-blue-100 text-blue-800';
            case 'processing':
                return 'bg-purple-100 text-purple-800';
            case 'shipped':
                return 'bg-indigo-100 text-indigo-800';
            case 'delivered':
                return 'bg-green-100 text-green-800';
            case 'cancelled':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const getStatusText = (status: Order['status']) => {
        switch (status) {
            case 'pending_payment':
                return 'Pending Payment';
            case 'confirmed':
                return 'Confirmed';
            case 'processing':
                return 'Processing';
            case 'shipped':
                return 'Shipped';
            case 'delivered':
                return 'Delivered';
            case 'cancelled':
                return 'Cancelled';
            default:
                return status;
        }
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

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
        }).format(price);
    };

    if (!isAuthenticated) {
        return null; // Will redirect
    }

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-50">
                <Header />
                <main className="container mx-auto px-4 py-8">
                    <div className="max-w-4xl mx-auto">
                        <div className="animate-pulse">
                            <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
                            <div className="h-4 bg-gray-200 rounded w-1/2 mb-8"></div>
                            <div className="bg-white rounded-lg p-6 mb-4">
                                <div className="h-6 bg-gray-200 rounded w-1/4 mb-2"></div>
                                <div className="h-4 bg-gray-200 rounded w-1/3 mb-4"></div>
                                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                            </div>
                        </div>
                    </div>
                </main>
                <Footer />
            </div>
        );
    }

    if (error || !order) {
        return (
            <div className="min-h-screen bg-gray-50">
                <Header />
                <main className="container mx-auto px-4 py-8">
                    <div className="max-w-4xl mx-auto text-center">
                        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                            <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
                            <h2 className="text-xl font-semibold text-red-800 mb-2">Error Loading Order</h2>
                            <p className="text-red-600 mb-4">{error || 'Order not found'}</p>
                            <Button onClick={fetchOrder} variant="outline" className="mr-2">
                                Try Again
                            </Button>
                            <Button onClick={() => router.push('/account/orders')} variant="outline">
                                Back to Orders
                            </Button>
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

            <main className="container mx-auto px-4 py-8">
                <div className="max-w-4xl mx-auto">
                    {/* Breadcrumb */}
                    <nav className="flex items-center gap-2 text-sm text-gray-600 mb-6">
                        <Link href="/" className="hover:text-gray-900">Home</Link>
                        <span>/</span>
                        <Link href="/account/orders" className="hover:text-gray-900">Orders</Link>
                        <span>/</span>
                        <span className="text-gray-900">Order #{order.orderNumber}</span>
                    </nav>

                    {/* Page Header */}
                    <div className="mb-8">
                        <div className="flex items-center gap-4 mb-4">
                            <Link
                                href="/account/orders"
                                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                                <ArrowLeft className="w-5 h-5" />
                            </Link>
                            <div>
                                <h1 className="text-3xl font-bold text-gray-900">
                                    Order #{order.orderNumber}
                                </h1>
                                <p className="text-gray-600 mt-1">
                                    Placed on {formatDate(order.createdAt)}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Order Status */}
                    <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
                        <div className="flex items-center gap-3 mb-4">
                            {getStatusIcon(order.status)}
                            <div>
                                <h2 className="text-xl font-semibold text-gray-900">Order Status</h2>
                                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                                    {getStatusText(order.status)}
                                </span>
                            </div>
                        </div>

                        {order.status === 'pending_payment' && (
                            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                                <p className="text-yellow-800 text-sm">
                                    <strong>Note:</strong> Payment integration will be available soon. Your order is saved and will be processed once payment is completed.
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Order Items */}
                    <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
                        <h2 className="text-xl font-semibold text-gray-900 mb-4">Order Items</h2>
                        <div className="space-y-4">
                            {order.items.map((item, index) => (
                                <div key={index} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                                    <div className="w-20 h-20 bg-gray-200 rounded-md flex items-center justify-center overflow-hidden">
                                        {item.productImage && item.productImage !== '/images/placeholder.jpg' ? (
                                            <img
                                                src={item.productImage}
                                                alt={item.productTitle || 'Product'}
                                                className="w-full h-full object-cover"
                                                onError={(e) => {
                                                    e.currentTarget.style.display = 'none';
                                                    const nextElement = e.currentTarget.nextElementSibling;
                                                    if (nextElement) {
                                                        (nextElement as HTMLElement).style.display = 'flex';
                                                    }
                                                }}
                                            />
                                        ) : null}
                                        <div className="w-full h-full bg-gray-300 flex items-center justify-center text-gray-500 text-xs" style={{ display: item.productImage && item.productImage !== '/images/placeholder.jpg' ? 'none' : 'flex' }}>
                                            No Image
                                        </div>
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="font-medium text-gray-900">{item.productTitle || 'Unknown Product'}</h3>
                                        <p className="text-sm text-gray-600">
                                            Brand: {item.productBrand || 'Zeynix'}
                                        </p>
                                        <p className="text-sm text-gray-600">
                                            Size: {item.size} | Quantity: {item.quantity}
                                        </p>
                                        <p className="text-sm text-gray-600">
                                            Price: {formatPrice(item.price)} each
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-medium text-gray-900">{formatPrice(item.total)}</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Order Total */}
                        <div className="border-t pt-4 mt-6">
                            <div className="flex justify-between items-center text-lg font-bold">
                                <span>Total Amount</span>
                                <span className={colorClasses.primary.text}>{formatPrice(order.totalAmount)}</span>
                            </div>
                        </div>
                    </div>

                    {/* Shipping Information */}
                    <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
                        <h2 className="text-xl font-semibold text-gray-900 mb-4">Shipping Information</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <h3 className="font-medium text-gray-900 mb-3">Delivery Address</h3>
                                <div className="space-y-2 text-sm text-gray-600">
                                    {order.shippingAddress ? (
                                        <div className="flex items-start gap-2">
                                            <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                                            <div>
                                                <p>{order.shippingAddress.firstName} {order.shippingAddress.lastName}</p>
                                                <p>{order.shippingAddress.addressLine1}</p>
                                                {order.shippingAddress.addressLine2 && (
                                                    <p>{order.shippingAddress.addressLine2}</p>
                                                )}
                                                <p>{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.pincode}</p>
                                                <p>{order.shippingAddress.country}</p>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="flex items-start gap-2">
                                            <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                                            <div>
                                                <p className="text-gray-500">Shipping address not available</p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div>
                                <h3 className="font-medium text-gray-900 mb-3">Contact Details</h3>
                                <div className="space-y-2 text-sm text-gray-600">
                                    {order.shippingAddress ? (
                                        <>
                                            <div className="flex items-center gap-2">
                                                <Phone className="w-4 h-4" />
                                                <span>{order.shippingAddress.phone}</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Mail className="w-4 h-4" />
                                                <span>{order.shippingAddress.email}</span>
                                            </div>
                                        </>
                                    ) : (
                                        <div className="flex items-center gap-2">
                                            <Phone className="w-4 h-4" />
                                            <span className="text-gray-500">Contact details not available</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Order Details */}
                    <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
                        <h2 className="text-xl font-semibold text-gray-900 mb-4">Order Details</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <h3 className="font-medium text-gray-900 mb-3">Order Information</h3>
                                <div className="space-y-2 text-sm text-gray-600">
                                    <div className="flex justify-between">
                                        <span>Order Number:</span>
                                        <span className="font-medium">{order.orderNumber}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Order Date:</span>
                                        <span className="font-medium">{formatDate(order.createdAt)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Payment Status:</span>
                                        <span className="font-medium capitalize">{order.paymentStatus}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Payment Method:</span>
                                        <span className="font-medium">
                                            {order.paymentMethod === 'pending_integration' ? 'Coming Soon' : order.paymentMethod}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {order.trackingNumber && (
                                <div>
                                    <h3 className="font-medium text-gray-900 mb-3">Tracking Information</h3>
                                    <div className="space-y-2 text-sm text-gray-600">
                                        <div className="flex justify-between">
                                            <span>Tracking Number:</span>
                                            <span className="font-medium">{order.trackingNumber}</span>
                                        </div>
                                        {order.estimatedDelivery && (
                                            <div className="flex justify-between">
                                                <span>Estimated Delivery:</span>
                                                <span className="font-medium">{formatDate(order.estimatedDelivery)}</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-3 justify-center">
                        <Button
                            onClick={() => router.push('/account/orders')}
                            variant="outline"
                        >
                            Back to Orders
                        </Button>
                        <Button
                            onClick={() => router.push('/products')}
                        >
                            Continue Shopping
                        </Button>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
