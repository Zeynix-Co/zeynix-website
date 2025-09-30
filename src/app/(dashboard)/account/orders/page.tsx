'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Package, Clock, CheckCircle, XCircle, Truck, Eye, ExternalLink } from 'lucide-react';
import { colorClasses } from '@/lib/constants';
import { Order, OrderListResponse } from '@/types/order';
import { Button } from '@/components/ui/Button';

export default function OrdersPage() {
    const router = useRouter();
    const { isAuthenticated } = useAuthStore();
    const [orders, setOrders] = useState<Order[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    useEffect(() => {
        if (!isAuthenticated) {
            router.push('/login?redirect=/account/orders');
            return;
        }
        fetchOrders();
    }, [isAuthenticated, currentPage]);

    const fetchOrders = async () => {
        try {
            setIsLoading(true);
            setError(null);

            const response = await fetch(`/api/orders?page=${currentPage}&limit=10`, {
                credentials: 'include',
            });
            const result: OrderListResponse = await response.json();

            if (result.success) {
                setOrders(result.data.orders);
                setTotalPages(result.data.pagination.pages);
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
            month: 'short',
            day: 'numeric'
        });
    };

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
        }).format(price);
    };

    const handleViewOrder = (orderId: string) => {
        router.push(`/account/orders/${orderId}`);
    };

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
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
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="bg-white rounded-lg p-6 mb-4">
                                    <div className="h-6 bg-gray-200 rounded w-1/4 mb-2"></div>
                                    <div className="h-4 bg-gray-200 rounded w-1/3 mb-4"></div>
                                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                                </div>
                            ))}
                        </div>
                    </div>
                </main>
                <Footer />
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gray-50">
                <Header />
                <main className="container mx-auto px-4 py-8">
                    <div className="max-w-4xl mx-auto text-center">
                        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                            <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
                            <h2 className="text-xl font-semibold text-red-800 mb-2">Error Loading Orders</h2>
                            <p className="text-red-600 mb-4">{error}</p>
                            <Button onClick={fetchOrders} variant="outline">
                                Try Again
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
                    {/* Page Header */}
                    <div className="mb-8">
                        <h1 className={`text-3xl font-bold ${colorClasses.primary.text} mb-2`}>My Orders</h1>
                        <p className="text-gray-600">Track your orders and view order history</p>
                    </div>

                    {/* Orders List */}
                    {orders.length === 0 ? (
                        <div className="bg-white rounded-lg shadow-sm border p-8 text-center">
                            <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                            <h2 className="text-xl font-semibold text-gray-900 mb-2">No Orders Yet</h2>
                            <p className="text-gray-600 mb-6">
                                You haven&apos;t placed any orders yet. Start shopping to see your orders here.
                            </p>
                            <Button onClick={() => router.push('/products')}>
                                Start Shopping
                            </Button>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {orders.map((order) => (
                                <div key={order.id} className="bg-white rounded-lg shadow-sm border p-6">
                                    {/* Order Header */}
                                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
                                        <div className="mb-4 sm:mb-0">
                                            <div className="flex items-center gap-3 mb-2">
                                                <h3 className="text-lg font-semibold text-gray-900">
                                                    Order #{order.orderNumber}
                                                </h3>
                                                <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                                                    {getStatusText(order.status)}
                                                </span>
                                            </div>
                                            <p className="text-sm text-gray-600">
                                                Placed on {formatDate(order.createdAt)}
                                            </p>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Button
                                                onClick={() => handleViewOrder(order.id)}
                                                variant="outline"
                                                size="sm"
                                            >
                                                <Eye className="w-4 h-4 mr-2" />
                                                View Details
                                            </Button>
                                        </div>
                                    </div>

                                    {/* Order Items Preview */}
                                    <div className="mb-4">
                                        <div className="flex items-center gap-3 mb-2">
                                            {getStatusIcon(order.status)}
                                            <span className="text-sm font-medium text-gray-700">
                                                {order.items.length} item{order.items.length !== 1 ? 's' : ''}
                                            </span>
                                        </div>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                            {order.items.slice(0, 2).map((item, index) => (
                                                <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                                                    <img
                                                        src={item.productImage}
                                                        alt={item.productTitle}
                                                        className="w-12 h-12 object-cover rounded-md"
                                                    />
                                                    <div className="flex-1 min-w-0">
                                                        <h4 className="text-sm font-medium text-gray-900 truncate">
                                                            {item.productTitle}
                                                        </h4>
                                                        <p className="text-xs text-gray-500">
                                                            Size: {item.size} | Qty: {item.quantity}
                                                        </p>
                                                    </div>
                                                </div>
                                            ))}
                                            {order.items.length > 2 && (
                                                <div className="flex items-center justify-center p-3 bg-gray-50 rounded-lg">
                                                    <span className="text-sm text-gray-500">
                                                        +{order.items.length - 2} more items
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Order Footer */}
                                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pt-4 border-t">
                                        <div className="mb-3 sm:mb-0">
                                            <p className="text-sm text-gray-600">
                                                Total: <span className="font-semibold text-gray-900">{formatPrice(order.totalAmount)}</span>
                                            </p>
                                            {order.trackingNumber && (
                                                <p className="text-sm text-gray-600 mt-1">
                                                    Tracking: {order.trackingNumber}
                                                </p>
                                            )}
                                        </div>
                                        <div className="flex items-center gap-2">
                                            {order.status === 'pending_payment' && (
                                                <span className="text-xs text-yellow-600 bg-yellow-50 px-2 py-1 rounded">
                                                    Payment integration coming soon
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className="mt-8 flex justify-center">
                            <div className="flex items-center gap-2">
                                <Button
                                    onClick={() => handlePageChange(currentPage - 1)}
                                    disabled={currentPage === 1}
                                    variant="outline"
                                    size="sm"
                                >
                                    Previous
                                </Button>

                                <span className="px-4 py-2 text-sm text-gray-600">
                                    Page {currentPage} of {totalPages}
                                </span>

                                <Button
                                    onClick={() => handlePageChange(currentPage + 1)}
                                    disabled={currentPage === totalPages}
                                    variant="outline"
                                    size="sm"
                                >
                                    Next
                                </Button>
                            </div>
                        </div>
                    )}
                </div>
            </main>

            <Footer />
        </div>
    );
} 