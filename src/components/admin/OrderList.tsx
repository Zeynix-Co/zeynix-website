'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAdminStore } from '@/store';
import { ORDER_CONSTANTS, PAGINATION } from '@/lib/constants';
import {
    Search,
    ShoppingBag,
    Eye,
    ChevronLeft,
    ChevronRight,
    XCircle,
    CheckCircle,
    Clock,
    Truck,
    X,
    Filter,
    RefreshCw
} from 'lucide-react';

interface OrderListProps {
    onViewOrder?: (orderId: string) => void;
}

export default function OrderList({ onViewOrder }: OrderListProps) {
    const router = useRouter();
    const { user, ordersData, ordersLoading, error, getAllOrders, updateOrderStatus, clearError } = useAdminStore();

    // Local state for filters
    const [filters, setFilters] = useState({
        status: 'all',
        paymentStatus: 'all',
        search: '',
        page: 1,
        limit: 10
    });

    // Local state for search input
    const [searchInput, setSearchInput] = useState('');

    // Load orders on mount
    useEffect(() => {
        if (user) {
            getAllOrders(filters);
        }
    }, [user]);

    // Handle search debounce safely without infinite loops
    useEffect(() => {
        const timer = setTimeout(() => {
            if (searchInput !== filters.search) {
                const newFilters = { ...filters, search: searchInput, page: 1 };
                setFilters(newFilters);
                if (user) {
                    getAllOrders(newFilters);
                }
            }
        }, 450);

        return () => clearTimeout(timer);
    }, [searchInput]);

    // Handle filter changes
    const handleFilterChange = (filterType: 'status' | 'paymentStatus', value: string) => {
        const newFilters = { ...filters, [filterType]: value, page: 1 };
        setFilters(newFilters);
        if (user) {
            getAllOrders(newFilters);
        }
    };

    // Handle pagination
    const handlePageChange = (page: number) => {
        const newFilters = { ...filters, page };
        setFilters(newFilters);
        if (user) {
            getAllOrders(newFilters);
        }
    };

    // Handle status update
    const handleStatusUpdate = async (orderId: string, newStatus: string) => {
        try {
            if (user) {
                await updateOrderStatus(orderId, newStatus);
            }
        } catch (err) {
            console.error('Failed to update order status:', err);
        }
    };

    // Handle view order
    const handleViewOrder = (orderId: string) => {
        if (onViewOrder) {
            onViewOrder(orderId);
        } else {
            router.push(`/admin/orders/${orderId}`);
        }
    };

    // Status badge helper
    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'pending':
                return (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-500/15 text-amber-300 border border-amber-500/30">
                        <Clock className="w-3 h-3 text-amber-400" />
                        Pending
                    </span>
                );
            case 'confirmed':
                return (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-sky-500/15 text-sky-300 border border-sky-500/30">
                        <CheckCircle className="w-3 h-3 text-sky-400" />
                        Confirmed
                    </span>
                );
            case 'delivered':
                return (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                        <Truck className="w-3 h-3 text-emerald-400" />
                        Delivered
                    </span>
                );
            case 'cancelled':
                return (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-rose-500/15 text-rose-300 border border-rose-500/30">
                        <XCircle className="w-3 h-3 text-rose-400" />
                        Cancelled
                    </span>
                );
            default:
                return (
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-white/10 text-gray-300">
                        {status}
                    </span>
                );
        }
    };

    // Format date
    const formatDate = (dateString?: string) => {
        if (!dateString) return 'Recent';
        return new Date(dateString).toLocaleDateString('en-IN', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    if (ordersLoading && (!ordersData || ordersData.orders.length === 0)) {
        return (
            <div className="flex flex-col items-center justify-center h-80 rounded-3xl bg-[#070F2B]/80 border border-white/10">
                <div className="w-10 h-10 border-2 border-[#B5945B] border-t-transparent rounded-full animate-spin mb-3" />
                <p className="text-xs font-bold uppercase tracking-widest text-[#B5945B]">
                    Retrieving Client Orders...
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Control Bar: Filters & Search */}
            <div className="bg-[#070F2B]/85 backdrop-blur-xl rounded-2xl p-4 sm:p-5 border border-white/10 shadow-lg">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
                    {/* Search Field */}
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                            <Search className="w-4 h-4" />
                        </div>
                        <input
                            type="text"
                            value={searchInput}
                            onChange={(e) => setSearchInput(e.target.value)}
                            placeholder="Search order #, customer..."
                            className="w-full pl-10 pr-3.5 py-2.5 bg-white/5 border border-white/15 focus:border-[#B5945B] focus:ring-1 focus:ring-[#B5945B] rounded-xl text-white text-xs placeholder:text-gray-500 focus:outline-none transition-all"
                        />
                    </div>

                    {/* Order Status */}
                    <div>
                        <select
                            value={filters.status}
                            onChange={(e) => handleFilterChange('status', e.target.value)}
                            className="w-full px-3.5 py-2.5 bg-[#070F2B] border border-white/15 focus:border-[#B5945B] focus:ring-1 focus:ring-[#B5945B] rounded-xl text-white text-xs focus:outline-none transition-all"
                        >
                            <option value="all">All Order Statuses</option>
                            {ORDER_CONSTANTS.statuses.map(status => (
                                <option key={status} value={status}>
                                    Status: {status.charAt(0).toUpperCase() + status.slice(1)}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Payment Status */}
                    <div>
                        <select
                            value={filters.paymentStatus}
                            onChange={(e) => handleFilterChange('paymentStatus', e.target.value)}
                            className="w-full px-3.5 py-2.5 bg-[#070F2B] border border-white/15 focus:border-[#B5945B] focus:ring-1 focus:ring-[#B5945B] rounded-xl text-white text-xs focus:outline-none transition-all"
                        >
                            <option value="all">All Payment Methods</option>
                            {ORDER_CONSTANTS.paymentMethods.map(method => (
                                <option key={method} value={method}>
                                    Payment: {method.toUpperCase()}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Per Page */}
                    <div>
                        <select
                            value={filters.limit}
                            onChange={(e) => {
                                const newFilters = { ...filters, limit: parseInt(e.target.value), page: 1 };
                                setFilters(newFilters);
                                if (user) {
                                    getAllOrders(newFilters);
                                }
                            }}
                            className="w-full px-3.5 py-2.5 bg-[#070F2B] border border-white/15 focus:border-[#B5945B] focus:ring-1 focus:ring-[#B5945B] rounded-xl text-white text-xs focus:outline-none transition-all"
                        >
                            {PAGINATION.limits.map(limit => (
                                <option key={limit} value={limit}>
                                    Show {limit} entries per page
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            {/* Error Notification */}
            {error && (
                <div className="p-4 bg-red-500/15 border border-red-500/30 text-red-200 rounded-2xl flex items-center justify-between text-xs animate-shake">
                    <div className="flex items-center gap-2">
                        <XCircle className="w-4 h-4 text-red-400 shrink-0" />
                        <span>{error}</span>
                    </div>
                    <button
                        onClick={clearError}
                        className="text-red-300 hover:text-white p-1 rounded-lg cursor-pointer"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>
            )}

            {/* Orders Table Container */}
            <div className="bg-[#070F2B]/85 backdrop-blur-xl rounded-3xl border border-white/10 shadow-xl overflow-hidden">
                {!ordersData || ordersData.orders.length === 0 ? (
                    <div className="text-center py-16 px-4">
                        <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-gray-500 mx-auto mb-3.5">
                            <ShoppingBag className="w-6 h-6" />
                        </div>
                        <h3 className="text-sm font-bold text-gray-200">
                            No Customer Orders Found
                        </h3>
                        <p className="text-xs text-gray-400 mt-1 max-w-sm mx-auto">
                            {filters.search || filters.status !== 'all' || filters.paymentStatus !== 'all'
                                ? 'No orders match your filter criteria. Try clearing search filters.'
                                : 'Incoming orders placed on the boutique will appear here automatically.'}
                        </p>
                    </div>
                ) : (
                    <>
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-white/10 text-left text-xs">
                                <thead className="bg-white/5">
                                    <tr>
                                        <th className="px-5 py-3.5 text-[10px] font-extrabold text-[#B5945B] uppercase tracking-wider">
                                            Order Details
                                        </th>
                                        <th className="px-5 py-3.5 text-[10px] font-extrabold text-[#B5945B] uppercase tracking-wider">
                                            Client
                                        </th>
                                        <th className="px-5 py-3.5 text-[10px] font-extrabold text-[#B5945B] uppercase tracking-wider">
                                            Status
                                        </th>
                                        <th className="px-5 py-3.5 text-[10px] font-extrabold text-[#B5945B] uppercase tracking-wider">
                                            Payment
                                        </th>
                                        <th className="px-5 py-3.5 text-[10px] font-extrabold text-[#B5945B] uppercase tracking-wider">
                                            Amount
                                        </th>
                                        <th className="px-5 py-3.5 text-[10px] font-extrabold text-[#B5945B] uppercase tracking-wider text-right">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5">
                                    {ordersData.orders.map((order) => (
                                        <tr key={order._id} className="hover:bg-white/5 transition-colors">
                                            {/* Order Details */}
                                            <td className="px-5 py-4">
                                                <div className="font-mono font-bold text-white text-xs">
                                                    #{order.orderNumber}
                                                </div>
                                                <div className="text-[10px] text-gray-400 mt-0.5">
                                                    {formatDate(order.createdAt)} • {order.items?.length || 0} items
                                                </div>
                                            </td>

                                            {/* Client */}
                                            <td className="px-5 py-4">
                                                <div className="font-semibold text-white">
                                                    {order.user?.name || 'Customer'}
                                                </div>
                                                {order.user?.email && (
                                                    <div className="text-[10px] text-gray-400">
                                                        {order.user.email}
                                                    </div>
                                                )}
                                                {order.user?.phone && (
                                                    <div className="text-[10px] text-gray-500">
                                                        {order.user.phone}
                                                    </div>
                                                )}
                                            </td>

                                            {/* Status */}
                                            <td className="px-5 py-4">
                                                <div className="flex items-center gap-2">
                                                    {getStatusBadge(order.status)}
                                                    <select
                                                        value={order.status}
                                                        onChange={(e) => handleStatusUpdate(order._id, e.target.value)}
                                                        className="px-2 py-0.5 bg-[#070F2B] border border-white/15 rounded text-[10px] text-gray-300 focus:outline-none focus:border-[#B5945B]"
                                                    >
                                                        <option value="pending">Pending</option>
                                                        <option value="confirmed">Confirmed</option>
                                                        <option value="delivered">Delivered</option>
                                                        <option value="cancelled">Cancelled</option>
                                                    </select>
                                                </div>
                                            </td>

                                            {/* Payment */}
                                            <td className="px-5 py-4 font-mono uppercase text-[11px] text-gray-300">
                                                {order.paymentMethod || 'Online'}
                                            </td>

                                            {/* Amount */}
                                            <td className="px-5 py-4 font-bold text-white">
                                                ₹{order.totalAmount?.toLocaleString('en-IN')}
                                            </td>

                                            {/* Actions */}
                                            <td className="px-5 py-4 text-right">
                                                <button
                                                    onClick={() => handleViewOrder(order._id)}
                                                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-[#B5945B]/20 border border-white/10 hover:border-[#B5945B]/50 text-xs font-semibold text-gray-200 hover:text-white transition-all cursor-pointer"
                                                >
                                                    <Eye className="w-3.5 h-3.5 text-[#B5945B]" />
                                                    <span>Details</span>
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination Bar */}
                        {ordersData.pagination && ordersData.pagination.totalPages > 1 && (
                            <div className="px-5 py-4 border-t border-white/10 flex items-center justify-between">
                                <div className="text-xs text-gray-400">
                                    Showing page <span className="text-white font-bold">{ordersData.pagination.currentPage}</span> of <span className="text-white font-bold">{ordersData.pagination.totalPages}</span> ({ordersData.pagination.total} total orders)
                                </div>
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => handlePageChange(ordersData.pagination.currentPage - 1)}
                                        disabled={!ordersData.pagination.hasPrev || ordersData.pagination.currentPage <= 1}
                                        className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 disabled:opacity-40 disabled:cursor-not-allowed text-white cursor-pointer"
                                    >
                                        <ChevronLeft className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={() => handlePageChange(ordersData.pagination.currentPage + 1)}
                                        disabled={!ordersData.pagination.hasNext || ordersData.pagination.currentPage >= ordersData.pagination.totalPages}
                                        className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 disabled:opacity-40 disabled:cursor-not-allowed text-white cursor-pointer"
                                    >
                                        <ChevronRight className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}
