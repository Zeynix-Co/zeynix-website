'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAdminStore } from '@/store';
import { Button } from '@/components/ui/Button';
import { colorClasses } from '@/lib/constants';
import {
    ArrowLeft,
    User,
    Phone,
    Mail,
    MapPin,
    Package,
    Truck,
    CreditCard,
    Calendar,
    Clock,
    CheckCircle,
    XCircle,
    AlertCircle,
    Edit,
    Send,
    Printer
} from 'lucide-react';

interface OrderItem {
    product: {
        title: string;
        images: string[];
        actualPrice: number;
    };
    size: string;
    quantity: number;
    price: number;
}

interface ShippingAddress {
    firstName: string;
    lastName: string;
    addressLine1: string;
    addressLine2?: string;
    city: string;
    state: string;
    pincode: string;
    country: string;
}

interface OrderUser {
    _id: string;
    name: string;
    email: string;
    phone: string;
}

interface Order {
    _id: string;
    orderNumber?: string;
    status: string;
    paymentStatus: string;
    paymentMethod?: string;
    paymentGateway?: string;
    transactionId?: string;
    totalAmount: number;
    createdAt: string;
    user: OrderUser;
    shippingAddress: ShippingAddress;
    items: OrderItem[];
}


export default function OrderDetailsPage() {
    const router = useRouter();
    const params = useParams();
    const { user, ordersData, getAllOrders } = useAdminStore();

    const [order, setOrder] = useState<Order | null>(null);
    const [loading, setLoading] = useState(true);
    const [orderError, setOrderError] = useState<string | null>(null);
    const [updatingStatus, setUpdatingStatus] = useState(false);

    const orderId = params.id as string;

    // Fetch specific order details
    useEffect(() => {
        const fetchOrderDetails = async () => {
            try {
                setLoading(true);
                setOrderError(null);

                // First try to get from existing orders data
                if (ordersData?.orders) {
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    const foundOrder = ordersData.orders.find((o: any) => o._id === orderId);
                    if (foundOrder) {
                        // Cast to Order type directly since we know the structure
                        setOrder(foundOrder as unknown as Order);
                        setLoading(false);
                        return;
                    }
                }

                // If not found, fetch from API
                const response = await fetch(`/api/admin/orders/${orderId}`, {
                    credentials: 'include'
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch order details');
                }

                const result = await response.json();
                if (result.success) {
                    setOrder(result.data as Order);
                } else {
                    throw new Error(result.message || 'Failed to fetch order');
                }
            } catch (error) {
                console.error('Error fetching order details:', error);
                setOrderError(error instanceof Error ? error.message : 'Failed to fetch order details');
            } finally {
                setLoading(false);
            }
        };

        if (orderId && user) {
            fetchOrderDetails();
        }
    }, [orderId, user, ordersData]);

    const handleStatusUpdate = async (newStatus: string) => {
        try {
            setUpdatingStatus(true);

            const response = await fetch(`/api/admin/orders/${orderId}/status`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({ status: newStatus })
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.message || 'Failed to update status');
            }

            if (result.success) {
                // Update local order state
                setOrder((prev: Order | null) => prev ? ({
                    ...prev,
                    status: newStatus
                }) : null);

                // Refresh orders list
                getAllOrders();
            } else {
                throw new Error(result.message || 'Failed to update status');
            }
        } catch (error) {
            console.error('Error updating order status:', error);
            alert(error instanceof Error ? error.message : 'Failed to update order status');
        } finally {
            setUpdatingStatus(false);
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status.toLowerCase()) {
            case 'completed':
                return <CheckCircle className="w-4 h-4" />;
            case 'cancelled':
                return <XCircle className="w-4 h-4" />;
            case 'pending':
                return <Clock className="w-4 h-4" />;
            default:
                return <AlertCircle className="w-4 h-4" />;
        }
    };

    const getStatusColor = (status: string) => {
        switch (status.toLowerCase()) {
            case 'completed':
                return 'bg-green-100 text-green-800 border-green-200';
            case 'cancelled':
                return 'bg-red-100 text-red-800 border-red-200';
            case 'pending':
                return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            default:
                return 'bg-gray-100 text-gray-800 border-gray-200';
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

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading order details...</p>
                </div>
            </div>
        );
    }

    if (orderError || !order) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <XCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
                    <h2 className="text-xl font-semibold text-gray-900 mb-2">Order Not Found</h2>
                    <p className="text-gray-600 mb-4">{orderError || 'The order you are looking for does not exist.'}</p>
                    <Button onClick={() => router.push('/admin/orders')}>
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back to Orders
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center gap-4 mb-4">
                        <Button
                            onClick={() => router.push('/admin/orders')}
                            variant="outline"
                            className="p-2"
                        >
                            <ArrowLeft className="w-5 h-5" />
                        </Button>
                        <div>
                            <h1 className={`text-3xl font-bold ${colorClasses.primary.text}`}>
                                Order Details
                            </h1>
                            <p className="text-gray-800 mt-1">
                                Order #{order.orderNumber || order._id}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Order Status Card */}
                        <div className="bg-white rounded-lg shadow-sm border p-6">
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-xl font-semibold text-gray-900">Order Status</h2>
                                <div className="flex items-center gap-2">
                                    {getStatusIcon(order.status)}
                                    <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(order.status)}`}>
                                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                                    </span>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Order Date</label>
                                    <div className="flex items-center gap-2 text-gray-800">
                                        <Calendar className="w-4 h-4" />
                                        {formatDate(order.createdAt)}
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Payment Status</label>
                                    <div className="flex items-center gap-2">
                                        {order.paymentStatus === 'completed' ?
                                            <CheckCircle className="w-4 h-4 text-green-500" /> :
                                            <Clock className="w-4 h-4 text-yellow-500" />
                                        }
                                        <span className={`px-2 py-1 rounded text-xs font-medium ${order.paymentStatus === 'completed'
                                            ? 'bg-green-100 text-green-800'
                                            : 'bg-yellow-100 text-yellow-800'
                                            }`}>
                                            {order.paymentStatus.charAt(0).toUpperCase() + order.paymentStatus.slice(1)}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Status Update */}
                            <div className="border-t pt-4">
                                <label className="block text-sm font-medium text-gray-700 mb-2">Update Status</label>
                                <div className="flex gap-2">
                                    <select
                                        value={order.status}
                                        onChange={(e) => handleStatusUpdate(e.target.value)}
                                        disabled={updatingStatus}
                                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    >
                                        <option value="pending">Pending</option>
                                        <option value="processing">Processing</option>
                                        <option value="shipped">Shipped</option>
                                        <option value="delivered">Delivered</option>
                                        <option value="completed">Completed</option>
                                        <option value="cancelled">Cancelled</option>
                                    </select>
                                    {updatingStatus && (
                                        <div className="flex items-center px-3">
                                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Customer Information */}
                        <div className="bg-white rounded-lg shadow-sm border p-6">
                            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                <User className="w-5 h-5" />
                                Customer Information
                            </h2>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                                    <div className="flex items-center gap-2 text-gray-800">
                                        <User className="w-4 h-4" />
                                        {order.user?.name || 'N/A'}
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                                    <div className="flex items-center gap-2 text-gray-800">
                                        <Mail className="w-4 h-4" />
                                        {order.user?.email || 'N/A'}
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                                    <div className="flex items-center gap-2 text-gray-800">
                                        <Phone className="w-4 h-4" />
                                        {order.user?.phone || 'N/A'}
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Customer ID</label>
                                    <div className="text-gray-800 font-mono text-sm">
                                        {order.user?._id || 'N/A'}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Delivery Address */}
                        <div className="bg-white rounded-lg shadow-sm border p-6">
                            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                <MapPin className="w-5 h-5" />
                                Delivery Address
                            </h2>

                            <div className="bg-gray-50 rounded-lg p-4">
                                <div className="text-gray-800">
                                    <div className="font-medium mb-1">
                                        {order.shippingAddress?.firstName} {order.shippingAddress?.lastName}
                                    </div>
                                    <div className="text-sm text-gray-700 mb-2">
                                        {order.shippingAddress?.addressLine1}
                                        {order.shippingAddress?.addressLine2 && (
                                            <>, {order.shippingAddress.addressLine2}</>
                                        )}
                                    </div>
                                    <div className="text-sm text-gray-700">
                                        {order.shippingAddress?.city}, {order.shippingAddress?.state} - {order.shippingAddress?.pincode}
                                    </div>
                                    <div className="text-sm text-gray-700">
                                        {order.shippingAddress?.country}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Order Items */}
                        <div className="bg-white rounded-lg shadow-sm border p-6">
                            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                <Package className="w-5 h-5" />
                                Order Items
                            </h2>

                            <div className="space-y-4">
                                {order.items?.map((item: OrderItem, index: number) => (
                                    <div key={index} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                                        <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center">
                                            {item.product?.images?.[0] ? (
                                                <img
                                                    src={item.product.images[0]}
                                                    alt={item.product.title}
                                                    className="w-full h-full object-cover rounded-lg"
                                                />
                                            ) : (
                                                <Package className="w-8 h-8 text-gray-400" />
                                            )}
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="font-medium text-gray-800">{item.product?.title || 'Product'}</h3>
                                            <p className="text-sm text-gray-700">Size: {item.size}</p>
                                            <p className="text-sm text-gray-700">Quantity: {item.quantity}</p>
                                        </div>
                                        <div className="text-right">
                                            <div className="font-medium text-gray-800">
                                                {formatPrice(item.price)}
                                            </div>
                                            <div className="text-sm text-gray-700">
                                                each
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="lg:col-span-1 space-y-6">
                        {/* Order Summary */}
                        <div className="bg-white rounded-lg shadow-sm border p-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h3>
                            <div className="space-y-3">
                                <div className="flex justify-between">
                                    <span className="text-gray-700">Subtotal</span>
                                    <span className="font-medium text-gray-800">{formatPrice(order.totalAmount)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-700">Shipping</span>
                                    <span className="font-medium text-green-600">Free</span>
                                </div>
                                <div className="border-t pt-3">
                                    <div className="flex justify-between text-lg font-bold">
                                        <span className="text-gray-800">Total</span>
                                        <span className={colorClasses.primary.text}>
                                            {formatPrice(order.totalAmount)}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
