'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAdminStore } from '@/store';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { colorClasses, ORDER_CONSTANTS, PAGINATION } from '@/lib/constants';

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

    // Load orders on component mount
    useEffect(() => {
        if (user) {
            getAllOrders();
        }
    }, [user, getAllOrders]);

    // Handle search with debounce
    useEffect(() => {
        const timer = setTimeout(() => {
            if (searchInput !== filters.search) {
                const newFilters = { ...filters, search: searchInput, page: 1 };
                setFilters(newFilters);
                if (user) {
                    getAllOrders(newFilters);
                }
            }
        }, 500);

        return () => clearTimeout(timer);
    }, [searchInput, filters.search, filters, getAllOrders, user]);

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
        } catch (error) {
            console.error('Failed to update order status:', error);
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

    // Get status badge color
    const getStatusBadgeColor = (status: string) => {
        switch (status) {
            case 'pending':
                return 'bg-yellow-100 text-yellow-800';
            case 'confirmed':
                return 'bg-blue-100 text-blue-800';
            case 'delivered':
                return 'bg-green-100 text-green-800';
            case 'cancelled':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    // Get payment status badge color
    const getPaymentStatusBadgeColor = (status: string) => {
        switch (status) {
            case 'pending':
                return 'bg-yellow-100 text-yellow-800';
            case 'completed':
                return 'bg-green-100 text-green-800';
            case 'failed':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    // Format date
    const formatDate = (dateString: string) => {
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
            <div className="flex items-center justify-center h-64">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading orders...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h2 className={`text-2xl font-bold ${colorClasses.primary.text}`}>
                        Orders ({ordersData?.pagination.total || 0})
                    </h2>
                    <p className="text-gray-600 mt-1">
                        Manage customer orders and track delivery status
                    </p>
                </div>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-lg shadow-sm p-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {/* Search */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Search Orders
                        </label>
                        <Input
                            type="text"
                            value={searchInput}
                            onChange={(e) => setSearchInput(e.target.value)}
                            placeholder="Search by order number, customer name..."
                            className="w-full"
                        />
                    </div>

                    {/* Order Status Filter */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Order Status
                        </label>
                        <select
                            value={filters.status}
                            onChange={(e) => handleFilterChange('status', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 text-[#070F2B] bg-white"
                        >
                            <option value="all" className="text-[#070F2B]">All</option>
                            {ORDER_CONSTANTS.statuses.map(status => (
                                <option key={status} value={status} className="text-[#070F2B]">
                                    {status.charAt(0).toUpperCase() + status.slice(1)}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Payment Status Filter */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Payment Status
                        </label>
                        <select
                            value={filters.paymentStatus}
                            onChange={(e) => handleFilterChange('paymentStatus', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 text-[#070F2B] bg-white"
                        >
                            <option value="all" className="text-[#070F2B]">All</option>
                            {ORDER_CONSTANTS.paymentMethods.map(method => (
                                <option key={method} value={method} className="text-[#070F2B]">
                                    {method.charAt(0).toUpperCase() + method.slice(1)}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Results per page */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Per Page
                        </label>
                        <select
                            value={filters.limit}
                            onChange={(e) => {
                                const newFilters = { ...filters, limit: parseInt(e.target.value), page: 1 };
                                setFilters(newFilters);
                                if (user) {
                                    getAllOrders(newFilters);
                                }
                            }}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 text-[#070F2B] bg-white"
                        >
                            {PAGINATION.limits.map(limit => (
                                <option key={limit} value={limit} className="text-[#070F2B]">{limit}</option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            {/* Error Display */}
            {error && (
                <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
                    <div className="flex items-center justify-between">
                        <span>{error}</span>
                        <button
                            onClick={clearError}
                            className="text-red-700 hover:text-red-900"
                        >
                            ×
                        </button>
                    </div>
                </div>
            )}

            {/* Orders Table */}
            {!ordersData || ordersData.orders.length === 0 ? (
                <div className="text-center py-12">
                    <div className="text-gray-400 text-6xl mb-4">📦</div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No orders found</h3>
                    <p className="text-gray-500">
                        {filters.search || filters.status !== 'all' || filters.paymentStatus !== 'all'
                            ? 'Try adjusting your filters or search terms'
                            : 'Orders will appear here when customers place them'
                        }
                    </p>
                </div>
            ) : (
                <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Order Details
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Customer
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Status
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Payment
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Amount
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {ordersData?.orders.map((order) => (
                                    <tr key={order._id} className="hover:bg-gray-50">
                                        {/* Order Details */}
                                        <td className="px-6 py-4">
                                            <div className="flex items-center">
                                                <div className="flex-shrink-0 h-10 w-10">
                                                    {order.items[0]?.product.images[0] ? (
                                                        <img
                                                            className="h-10 w-10 rounded-lg object-cover"
                                                            src={order.items[0].product.images[0]}
                                                            alt={order.items[0].product.title}
                                                        />
                                                    ) : (
                                                        <div className="h-10 w-10 rounded-lg bg-gray-200 flex items-center justify-center">
                                                            <span className="text-gray-500 text-sm">📷</span>
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="ml-4">
                                                    <div className="text-sm font-medium text-gray-900">
                                                        {order.orderNumber}
                                                    </div>
                                                    <div className="text-sm text-gray-500">
                                                        {order.items.length} item{order.items.length !== 1 ? 's' : ''}
                                                    </div>
                                                    <div className="text-xs text-gray-400">
                                                        {formatDate(order.createdAt)}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>

                                        {/* Customer */}
                                        <td className="px-6 py-4">
                                            <div className="text-sm font-medium text-gray-900">
                                                {order.user?.name || 'N/A'}
                                            </div>
                                            <div className="text-sm text-gray-500">
                                                {order.user?.email || 'N/A'}
                                            </div>
                                            <div className="text-sm text-gray-500">
                                                {order.user?.phone || 'N/A'}
                                            </div>
                                        </td>

                                        {/* Order Status */}
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadgeColor(order.status)}`}>
                                                {order.status}
                                            </span>
                                            <div className="mt-1">
                                                <select
                                                    value={order.status}
                                                    onChange={(e) => handleStatusUpdate(order._id, e.target.value)}
                                                    className="text-xs border border-gray-300 rounded px-2 py-1"
                                                    disabled={ordersLoading}
                                                >
                                                    {ORDER_CONSTANTS.statuses.map(status => (
                                                        <option key={status} value={status}>
                                                            {status.charAt(0).toUpperCase() + status.slice(1)}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>
                                        </td>

                                        {/* Payment Status */}
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPaymentStatusBadgeColor(order.paymentStatus)}`}>
                                                {order.paymentStatus}
                                            </span>
                                            <div className="text-xs text-gray-500 mt-1">
                                                {order.paymentMethod}
                                            </div>
                                        </td>

                                        {/* Amount */}
                                        <td className="px-6 py-4">
                                            <div className="text-sm font-medium text-gray-900">
                                                ₹{order.totalAmount}
                                            </div>
                                        </td>

                                        {/* Actions */}
                                        <td className="px-6 py-4">
                                            <div className="flex space-x-2">
                                                <Button
                                                    onClick={() => handleViewOrder(order._id)}
                                                    variant="outline"
                                                    size="sm"
                                                    className="cursor-pointer"
                                                >
                                                    View
                                                </Button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Pagination */}
            {ordersData && ordersData.pagination.totalPages > 1 && (
                <div className="flex items-center justify-center space-x-2">
                    <Button
                        onClick={() => handlePageChange(ordersData.pagination.currentPage - 1)}
                        variant="outline"
                        disabled={ordersData.pagination.currentPage <= 1}
                        className="cursor-pointer"
                    >
                        Previous
                    </Button>

                    <div className="flex items-center space-x-1">
                        {Array.from({ length: Math.min(5, ordersData.pagination.totalPages) }, (_, i) => {
                            const page = Math.max(1, Math.min(ordersData.pagination.totalPages - 4, ordersData.pagination.currentPage - 2)) + i;
                            if (page > ordersData.pagination.totalPages) return null;

                            return (
                                <Button
                                    key={page}
                                    onClick={() => handlePageChange(page)}
                                    variant={page === ordersData.pagination.currentPage ? "primary" : "outline"}
                                    size="sm"
                                    className="cursor-pointer"
                                >
                                    {page}
                                </Button>
                            );
                        })}
                    </div>

                    <Button
                        onClick={() => handlePageChange(ordersData.pagination.currentPage + 1)}
                        variant="outline"
                        disabled={ordersData.pagination.currentPage >= ordersData.pagination.totalPages}
                        className="cursor-pointer"
                    >
                        Next
                    </Button>
                </div>
            )}

            {/* Loading Overlay */}
            {ordersLoading && ordersData && ordersData.orders.length > 0 && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                        <p className="text-gray-600">Processing...</p>
                    </div>
                </div>
            )}
        </div>
    );
}
