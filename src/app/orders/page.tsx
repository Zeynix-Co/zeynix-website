'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Package, Clock, CheckCircle, XCircle } from 'lucide-react';
import { colorClasses } from '@/lib/constants';
import { Order, OrderListResponse } from '@/types/order';

const getStatusIcon = (status: Order['status']) => {
    switch (status) {
        case 'pending_payment':
            return <Clock className="w-5 h-5 text-yellow-500" />;
        case 'processing':
            return <Package className="w-5 h-5 text-blue-500" />;
        case 'shipped':
            return <Package className="w-5 h-5 text-purple-500" />;
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
        case 'processing':
            return 'bg-blue-100 text-blue-800';
        case 'shipped':
            return 'bg-purple-100 text-purple-800';
        case 'delivered':
            return 'bg-green-100 text-green-800';
        case 'cancelled':
            return 'bg-red-100 text-red-800';
        default:
            return 'bg-gray-100 text-gray-800';
    }
};

export default function OrdersPage() {
    const router = useRouter();
    const { isAuthenticated } = useAuthStore();
    const [orders, setOrders] = useState<Order[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!isAuthenticated) {
            router.push('/login?redirect=/orders');
            return;
        }
        fetchOrders();
    }, [isAuthenticated]);

    const fetchOrders = async () => {
        try {
            setIsLoading(true);
            setError(null);

            const response = await fetch('/api/orders', {
                headers: {
                    'Authorization': `Bearer ${useAuthStore.getState().token}`,
                },
                credentials: 'include',
            });
            const result: OrderListResponse = await response.json();

            if (result.success) {
                setOrders(result.data.orders);
            } else {
                setError('Failed to load orders');
            }
        } catch (err) {
            console.error('Error fetching orders:', err);
            setError('Failed to load orders');
        } finally {
            setIsLoading(false);
        }
    };

    if (!isAuthenticated) {
        return null;
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <Header />

            <main className="container mx-auto px-4 py-8">
                <div className="max-w-4xl mx-auto">
                    {/* Page Header */}
                    <div className="mb-8">
                        <h1 className={`text-3xl font-bold ${colorClasses.primary.text} mb-2`}>My Orders</h1>
                        <p className="text-gray-600">Track your orders and view order history</p>
                    </div>

                    {/* Loading State */}
                    {isLoading && (
                        <div className="text-center py-12">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                            <p className="mt-4 text-gray-600">Loading orders...</p>
                        </div>
                    )}

                    {/* Error State */}
                    {error && (
                        <div className="text-center py-12">
                            <p className="text-red-600 mb-4">{error}</p>
                            <button
                                onClick={fetchOrders}
                                className={`px-4 py-2 rounded-md ${colorClasses.primary.bg} text-white hover:opacity-90 transition-opacity`}
                            >
                                Try Again
                            </button>
                        </div>
                    )}

                    {/* Orders List */}
                    {!isLoading && !error && (
                        <div className="space-y-6">
                            {orders.map((order) => (
                                <div key={order.id} className="bg-white rounded-lg shadow-md p-6">
                                    {/* Order Header */}
                                    <div className="flex items-center justify-between mb-4">
                                        <div>
                                            <h3 className="font-semibold text-lg text-gray-800">{order.orderNumber}</h3>
                                            <p className="text-sm text-gray-500">Ordered on {new Date(order.createdAt).toLocaleDateString()}</p>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            {getStatusIcon(order.status)}
                                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                                                {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Order Details */}
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                                        <div>
                                            <p className="text-sm text-gray-500">Items</p>
                                            <p className="font-semibold text-gray-500">{order.items.length} items</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500">Total</p>
                                            <p className="font-semibold text-gray-500">₹{order.totalAmount}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500">Expected Delivery</p>
                                            <p className="font-semibold text-gray-500">{new Date(Date.now() + (45 * 60 * 1000)).toLocaleDateString()}</p>
                                        </div>
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="flex gap-3">
                                        <button
                                            onClick={() => router.push(`/account/orders/${order.id}`)}
                                            className={`px-4 py-2 rounded-md text-sm ${colorClasses.primary.bg} text-white hover:opacity-90 transition-opacity`}
                                        >
                                            View Details
                                        </button>
                                        {order.status === 'shipped' && (
                                            <button className="px-4 py-2 rounded-md text-sm border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors">
                                                Track Package
                                            </button>
                                        )}
                                        {order.status === 'delivered' && (
                                            <button className="px-4 py-2 rounded-md text-sm border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors">
                                                Write Review
                                            </button>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Empty State */}
                    {!isLoading && !error && orders.length === 0 && (
                        <div className="text-center py-12">
                            <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                            <h3 className="text-xl font-semibold text-gray-600 mb-2">No orders yet</h3>
                            <p className="text-gray-500 mb-6">Start shopping to see your orders here</p>
                            <button
                                onClick={() => router.push('/products')}
                                className={`px-6 py-3 rounded-md ${colorClasses.primary.bg} text-white hover:opacity-90 transition-opacity`}
                            >
                                Start Shopping
                            </button>
                        </div>
                    )}
                </div>
            </main>

            <Footer />
        </div>
    );
} 