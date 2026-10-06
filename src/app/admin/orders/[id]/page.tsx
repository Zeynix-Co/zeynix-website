'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { useAdminStore } from '@/store';
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
    ShieldCheck,
    ExternalLink,
    RefreshCw
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
    const { user, ordersData, token, getAllOrders } = useAdminStore();

    const [order, setOrder] = useState<Order | null>(null);
    const [loading, setLoading] = useState(true);
    const [orderError, setOrderError] = useState<string | null>(null);
    const [updatingStatus, setUpdatingStatus] = useState(false);

    const orderId = params.id as string;

    const fetchOrderDetails = async () => {
        try {
            setLoading(true);
            setOrderError(null);

            // First try to find in existing orders store data
            if (ordersData?.orders) {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const foundOrder = ordersData.orders.find((o: any) => o._id === orderId);
                if (foundOrder) {
                    setOrder(foundOrder as unknown as Order);
                    setLoading(false);
                    return;
                }
            }

            // Fallback to fetch direct from API
            const userIdParam = user?.id || (user as any)?._id || '';
            const response = await fetch(`/api/admin/orders/${orderId}?userId=${userIdParam}`, {
                headers: {
                    ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
                },
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

    useEffect(() => {
        if (orderId && user) {
            fetchOrderDetails();
        }
    }, [orderId, user, ordersData, token]);

    const handleStatusUpdate = async (newStatus: string) => {
        try {
            setUpdatingStatus(true);

            const userIdParam = user?.id || (user as any)?._id || '';
            const response = await fetch(`/api/admin/orders/${orderId}/status?userId=${userIdParam}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
                },
                credentials: 'include',
                body: JSON.stringify({ status: newStatus, userId: userIdParam })
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.message || 'Failed to update status');
            }

            if (result.success) {
                setOrder((prev: Order | null) => prev ? ({
                    ...prev,
                    status: newStatus
                }) : null);

                // Refresh overall orders cache
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

    const getStatusBadge = (status: string) => {
        switch (status.toLowerCase()) {
            case 'completed':
            case 'delivered':
                return 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30';
            case 'shipped':
                return 'bg-blue-500/15 text-blue-400 border-blue-500/30';
            case 'processing':
                return 'bg-amber-500/15 text-amber-400 border-amber-500/30';
            case 'pending':
                return 'bg-yellow-500/15 text-yellow-300 border-yellow-500/30';
            case 'cancelled':
                return 'bg-red-500/15 text-red-400 border-red-500/30';
            default:
                return 'bg-gray-500/15 text-gray-400 border-gray-500/30';
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status.toLowerCase()) {
            case 'completed':
            case 'delivered':
                return <CheckCircle className="w-4 h-4 text-emerald-400" />;
            case 'cancelled':
                return <XCircle className="w-4 h-4 text-red-400" />;
            case 'pending':
                return <Clock className="w-4 h-4 text-yellow-400" />;
            case 'shipped':
                return <Truck className="w-4 h-4 text-blue-400" />;
            default:
                return <AlertCircle className="w-4 h-4 text-amber-400" />;
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-IN', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0
        }).format(price);
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-[#050B1E] flex items-center justify-center text-white">
                <div className="text-center p-8 bg-[#070F2B]/80 border border-[#B5945B]/20 rounded-2xl backdrop-blur-xl max-w-sm">
                    <div className="w-10 h-10 border-2 border-[#B5945B] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                    <h3 className="text-sm font-semibold tracking-wide uppercase text-[#B5945B]">Loading Order</h3>
                    <p className="text-xs text-gray-400 mt-1">Retrieving details from luxury atelier pipeline...</p>
                </div>
            </div>
        );
    }

    if (orderError || !order) {
        return (
            <div className="min-h-screen bg-[#050B1E] flex items-center justify-center text-white p-4">
                <div className="text-center p-8 bg-[#070F2B]/90 border border-red-500/20 rounded-2xl backdrop-blur-xl max-w-md w-full">
                    <div className="w-14 h-14 rounded-full bg-red-500/10 border border-red-500/30 flex items-center justify-center mx-auto mb-4 text-red-400">
                        <XCircle className="w-7 h-7" />
                    </div>
                    <h2 className="text-lg font-bold font-serif uppercase tracking-wider text-white mb-2">Order Not Found</h2>
                    <p className="text-xs text-gray-400 mb-6">{orderError || 'The order you requested could not be retrieved.'}</p>
                    <Link
                        href="/admin/orders"
                        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#B5945B] to-[#997943] text-black text-xs font-bold uppercase tracking-wider hover:opacity-90 transition-opacity"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Return to Orders
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen w-full relative bg-[#050B1E] text-white overflow-x-hidden selection:bg-[#B5945B]/30 selection:text-white">
            {/* Ambient Background Glowing Orbs */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
                <div className="absolute -top-32 -right-32 w-[550px] h-[550px] rounded-full bg-gradient-to-br from-[#B5945B]/15 via-[#D4AF37]/10 to-transparent blur-[140px]" />
                <div className="absolute -bottom-36 -left-36 w-[650px] h-[650px] rounded-full bg-gradient-to-tr from-[#142352]/40 via-[#070F2B]/60 to-transparent blur-[150px]" />
                <div 
                    className="absolute inset-0 opacity-[0.12]"
                    style={{
                        backgroundImage: `radial-gradient(circle, rgba(181, 148, 91, 0.35) 1px, transparent 1px)`,
                        backgroundSize: '36px 36px',
                    }}
                />
            </div>

            {/* Navigation Header */}
            <header className="relative z-20 w-full border-b border-white/10 bg-[#070F2B]/80 backdrop-blur-xl sticky top-0">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <Link
                            href="/admin/orders"
                            className="group inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-[#B5945B]/40 text-xs font-semibold text-gray-300 hover:text-white transition-all"
                        >
                            <ArrowLeft className="w-3.5 h-3.5 text-[#B5945B] group-hover:-translate-x-1 transition-transform" />
                            <span>Orders Pipeline</span>
                        </Link>

                        <div className="flex items-center gap-2 text-xs font-bold text-[#B5945B] uppercase tracking-wider">
                            <ShieldCheck className="w-4 h-4 text-[#B5945B]" />
                            <span>Order #{order.orderNumber || order._id.slice(-8).toUpperCase()}</span>
                        </div>

                        <Link
                            href="/"
                            target="_blank"
                            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-gray-300 hover:text-white transition-all"
                        >
                            <ExternalLink className="w-3.5 h-3.5 text-[#B5945B]" />
                            <span>Store</span>
                        </Link>
                    </div>
                </div>
            </header>

            {/* Main Content Area */}
            <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header Info */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                    <div>
                        <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-[#B5945B] mb-1">
                            <span>Client Order Details</span>
                            <span className="text-gray-500">•</span>
                            <span className="text-gray-400 font-mono">ID: {order._id}</span>
                        </div>
                        <h1 className="text-2xl sm:text-3xl font-black font-serif uppercase tracking-tight text-white">
                            Invoice #{order.orderNumber || order._id.slice(-8).toUpperCase()}
                        </h1>
                        <p className="text-xs text-gray-400 mt-1 flex items-center gap-2">
                            <Calendar className="w-3.5 h-3.5 text-[#B5945B]" />
                            Placed on {formatDate(order.createdAt)}
                        </p>
                    </div>

                    <div className="flex items-center gap-3">
                        <button
                            onClick={fetchOrderDetails}
                            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-gray-300 hover:text-white transition-all"
                        >
                            <RefreshCw className="w-3.5 h-3.5 text-[#B5945B]" />
                            <span>Refresh</span>
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left Column (2 Cols) */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Status Card & Status Controller */}
                        <div className="rounded-2xl bg-[#070F2B]/80 border border-[#B5945B]/20 backdrop-blur-xl p-6 shadow-xl">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-white/10">
                                <div>
                                    <h3 className="text-xs font-bold uppercase tracking-wider text-[#B5945B]">Order Status</h3>
                                    <p className="text-xs text-gray-400 mt-0.5">Current fulfillment & delivery stage</p>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider border ${getStatusBadge(order.status)}`}>
                                        {getStatusIcon(order.status)}
                                        {order.status}
                                    </span>
                                </div>
                            </div>

                            <div className="pt-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="p-3.5 rounded-xl bg-white/5 border border-white/5">
                                    <span className="text-[11px] font-medium text-gray-400 block mb-1">Payment Status</span>
                                    <div className="flex items-center gap-2">
                                        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[11px] font-bold uppercase ${
                                            order.paymentStatus === 'completed' || order.paymentStatus === 'paid'
                                                ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                                                : 'bg-yellow-500/15 text-yellow-300 border border-yellow-500/30'
                                        }`}>
                                            <CreditCard className="w-3 h-3" />
                                            {order.paymentStatus}
                                        </span>
                                    </div>
                                </div>

                                <div className="p-3.5 rounded-xl bg-white/5 border border-white/5">
                                    <span className="text-[11px] font-medium text-gray-400 block mb-1">Payment Method</span>
                                    <span className="text-xs font-semibold text-white uppercase tracking-wide">
                                        {order.paymentMethod || order.paymentGateway || 'Card / Online'}
                                    </span>
                                </div>
                            </div>

                            {/* Status Changer Control */}
                            <div className="mt-5 pt-5 border-t border-white/10">
                                <label className="block text-xs font-bold uppercase tracking-wider text-gray-300 mb-2">
                                    Modify Fulfillment Stage
                                </label>
                                <div className="flex items-center gap-3">
                                    <select
                                        value={order.status}
                                        onChange={(e) => handleStatusUpdate(e.target.value)}
                                        disabled={updatingStatus}
                                        className="flex-1 px-4 py-2.5 bg-[#050B1E] border border-[#B5945B]/30 text-white rounded-xl text-xs font-medium focus:outline-none focus:border-[#B5945B] focus:ring-1 focus:ring-[#B5945B] cursor-pointer"
                                    >
                                        <option value="pending">Pending</option>
                                        <option value="processing">Processing</option>
                                        <option value="shipped">Shipped</option>
                                        <option value="delivered">Delivered</option>
                                        <option value="completed">Completed</option>
                                        <option value="cancelled">Cancelled</option>
                                    </select>
                                    {updatingStatus && (
                                        <div className="flex items-center gap-2 text-xs text-[#B5945B]">
                                            <div className="w-4 h-4 border-2 border-[#B5945B] border-t-transparent rounded-full animate-spin" />
                                            <span>Updating...</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Order Items */}
                        <div className="rounded-2xl bg-[#070F2B]/80 border border-[#B5945B]/20 backdrop-blur-xl p-6 shadow-xl">
                            <h3 className="text-xs font-bold uppercase tracking-wider text-[#B5945B] mb-4 flex items-center gap-2">
                                <Package className="w-4 h-4 text-[#B5945B]" />
                                Bag Items ({order.items?.length || 0})
                            </h3>

                            <div className="space-y-3">
                                {order.items?.map((item: OrderItem, idx: number) => (
                                    <div
                                        key={idx}
                                        className="flex items-center gap-4 p-4 rounded-xl bg-white/5 border border-white/5 hover:border-[#B5945B]/30 transition-colors"
                                    >
                                        <div className="w-16 h-16 rounded-xl bg-black/40 border border-white/10 overflow-hidden flex items-center justify-center flex-shrink-0">
                                            {item.product?.images?.[0] ? (
                                                <img
                                                    src={item.product.images[0]}
                                                    alt={item.product.title || 'Product'}
                                                    className="w-full h-full object-cover"
                                                />
                                            ) : (
                                                <Package className="w-6 h-6 text-gray-500" />
                                            )}
                                        </div>

                                        <div className="flex-1 min-w-0">
                                            <h4 className="text-sm font-semibold text-white truncate">
                                                {item.product?.title || 'Luxury Atelier Piece'}
                                            </h4>
                                            <div className="flex items-center gap-3 text-xs text-gray-400 mt-1">
                                                <span className="px-2 py-0.5 rounded bg-white/5 border border-white/10 font-mono text-[11px]">
                                                    Size: {item.size || 'N/A'}
                                                </span>
                                                <span>Qty: {item.quantity}</span>
                                            </div>
                                        </div>

                                        <div className="text-right">
                                            <div className="text-sm font-bold text-[#B5945B]">
                                                {formatPrice(item.price * item.quantity)}
                                            </div>
                                            <div className="text-[11px] text-gray-400">
                                                {formatPrice(item.price)} each
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Customer Information */}
                        <div className="rounded-2xl bg-[#070F2B]/80 border border-[#B5945B]/20 backdrop-blur-xl p-6 shadow-xl">
                            <h3 className="text-xs font-bold uppercase tracking-wider text-[#B5945B] mb-4 flex items-center gap-2">
                                <User className="w-4 h-4 text-[#B5945B]" />
                                Client Identity
                            </h3>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="p-3.5 rounded-xl bg-white/5 border border-white/5">
                                    <span className="text-[11px] text-gray-400 block mb-1">Full Name</span>
                                    <span className="text-sm font-semibold text-white flex items-center gap-2">
                                        <User className="w-3.5 h-3.5 text-[#B5945B]" />
                                        {order.user?.name || `${order.shippingAddress?.firstName || ''} ${order.shippingAddress?.lastName || ''}`.trim() || 'N/A'}
                                    </span>
                                </div>

                                <div className="p-3.5 rounded-xl bg-white/5 border border-white/5">
                                    <span className="text-[11px] text-gray-400 block mb-1">Email Address</span>
                                    <span className="text-sm font-semibold text-white flex items-center gap-2 truncate">
                                        <Mail className="w-3.5 h-3.5 text-[#B5945B]" />
                                        {order.user?.email || 'N/A'}
                                    </span>
                                </div>

                                <div className="p-3.5 rounded-xl bg-white/5 border border-white/5">
                                    <span className="text-[11px] text-gray-400 block mb-1">Contact Phone</span>
                                    <span className="text-sm font-semibold text-white flex items-center gap-2">
                                        <Phone className="w-3.5 h-3.5 text-[#B5945B]" />
                                        {order.user?.phone || 'N/A'}
                                    </span>
                                </div>

                                <div className="p-3.5 rounded-xl bg-white/5 border border-white/5">
                                    <span className="text-[11px] text-gray-400 block mb-1">Account ID</span>
                                    <span className="text-xs font-mono text-gray-300">
                                        {order.user?._id || 'Guest Checkout'}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column (Sidebar) */}
                    <div className="space-y-6">
                        {/* Financial Summary */}
                        <div className="rounded-2xl bg-[#070F2B]/80 border border-[#B5945B]/20 backdrop-blur-xl p-6 shadow-xl">
                            <h3 className="text-xs font-bold uppercase tracking-wider text-[#B5945B] mb-4 flex items-center gap-2">
                                <CreditCard className="w-4 h-4 text-[#B5945B]" />
                                Financial Summary
                            </h3>

                            <div className="space-y-3 text-xs">
                                <div className="flex justify-between items-center text-gray-400">
                                    <span>Items Subtotal</span>
                                    <span className="text-white font-medium">{formatPrice(order.totalAmount)}</span>
                                </div>
                                <div className="flex justify-between items-center text-gray-400">
                                    <span>Boutique Shipping</span>
                                    <span className="text-emerald-400 font-semibold uppercase text-[11px]">Complimentary</span>
                                </div>
                                <div className="flex justify-between items-center text-gray-400">
                                    <span>Sales Tax / GST</span>
                                    <span className="text-white font-medium">Included</span>
                                </div>

                                <div className="pt-4 mt-2 border-t border-white/10 flex justify-between items-center">
                                    <span className="text-sm font-bold uppercase tracking-wider text-white">Grand Total</span>
                                    <span className="text-lg font-black font-serif text-[#B5945B]">
                                        {formatPrice(order.totalAmount)}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Shipping Destination */}
                        <div className="rounded-2xl bg-[#070F2B]/80 border border-[#B5945B]/20 backdrop-blur-xl p-6 shadow-xl">
                            <h3 className="text-xs font-bold uppercase tracking-wider text-[#B5945B] mb-4 flex items-center gap-2">
                                <MapPin className="w-4 h-4 text-[#B5945B]" />
                                Delivery Destination
                            </h3>

                            <div className="p-4 rounded-xl bg-white/5 border border-white/5 space-y-2 text-xs text-gray-300">
                                <div className="font-semibold text-white text-sm">
                                    {order.shippingAddress?.firstName} {order.shippingAddress?.lastName}
                                </div>
                                <div>
                                    {order.shippingAddress?.addressLine1}
                                    {order.shippingAddress?.addressLine2 && `, ${order.shippingAddress?.addressLine2}`}
                                </div>
                                <div>
                                    {order.shippingAddress?.city}, {order.shippingAddress?.state} - <span className="font-mono text-[#B5945B]">{order.shippingAddress?.pincode}</span>
                                </div>
                                <div className="text-gray-400 uppercase text-[11px] font-semibold">
                                    {order.shippingAddress?.country || 'India'}
                                </div>
                            </div>
                        </div>

                        {/* Quick Navigation Help */}
                        <div className="rounded-2xl bg-[#070F2B]/60 border border-white/5 backdrop-blur-xl p-5 text-center">
                            <p className="text-xs text-gray-400 mb-3">
                                Need to inspect products or manage stock?
                            </p>
                            <Link
                                href="/admin/products"
                                className="inline-flex items-center justify-center w-full px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-gray-300 hover:text-white transition-all"
                            >
                                Product Catalog
                            </Link>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
