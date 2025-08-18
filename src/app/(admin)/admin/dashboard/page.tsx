'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAdminStore } from '@/store';
import { Button } from '@/components/ui/Button';
import { colorClasses } from '@/lib/constants';

interface Order {
    _id: string;
    orderNumber: string;
    user?: {
        name: string;
    };
    status: 'pending' | 'confirmed' | 'delivered' | 'cancelled';
    totalAmount: number;
}

interface Product {
    _id: string;
    title: string;
    sizes: Array<{
        size: string;
        stock: number;
    }>;
}

interface DashboardData {
    recentOrders?: Order[];
    lowStockProducts?: Product[];
}

export default function AdminDashboardPage() {
    const router = useRouter();
    const { user, dashboardData, getDashboardData, logout, isLoading } = useAdminStore();
    const [isLoadingData, setIsLoadingData] = useState(false);

    useEffect(() => {
        // Fetch dashboard data when component mounts
        const fetchData = async () => {
            setIsLoadingData(true);
            try {
                await getDashboardData();
            } catch (error) {
                console.error('Failed to fetch dashboard data:', error);
            } finally {
                setIsLoadingData(false);
            }
        };

        fetchData();
    }, [getDashboardData]);

    const handleLogout = () => {
        logout();
        router.push('/admin/login');
    };

    const navigateTo = (path: string) => {
        router.push(path);
    };

    if (!user) {
        return null; // Will redirect
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="bg-white shadow-sm border-b">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <div className="flex items-center">
                            <h1 className={`text-2xl font-bold ${colorClasses.primary.text}`}>
                                Zeynix Admin
                            </h1>
                        </div>
                        <div className="flex items-center space-x-4">
                            <span className="text-gray-700">Welcome, {user.name}</span>
                            <Button
                                onClick={handleLogout}
                                variant="outline"
                                className="cursor-pointer"
                            >
                                Logout
                            </Button>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="p-4 max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                {/* Stats Cards */}
                <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                    <div className="bg-white overflow-hidden shadow rounded-lg">
                        <div className="p-5">
                            <div className="flex items-center">
                                <div className="flex-shrink-0">
                                    <div className={`w-8 h-8 rounded-md ${colorClasses.primary.bg} flex items-center justify-center`}>
                                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                                        </svg>
                                    </div>
                                </div>
                                <div className="ml-5 w-0 flex-1">
                                    <dl>
                                        <dt className="text-sm font-medium text-gray-500 truncate">Total Products</dt>
                                        <dd className="text-lg font-medium text-gray-900">
                                            {isLoadingData ? '...' : dashboardData?.counts?.totalProducts || 0}
                                        </dd>
                                    </dl>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white overflow-hidden shadow rounded-lg">
                        <div className="p-5">
                            <div className="flex items-center">
                                <div className="flex-shrink-0">
                                    <div className={`w-8 h-8 rounded-md ${colorClasses.primary.bg} flex items-center justify-center`}>
                                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                                        </svg>
                                    </div>
                                </div>
                                <div className="ml-5 w-0 flex-1">
                                    <dl>
                                        <dt className="text-sm font-medium text-gray-500 truncate">Total Orders</dt>
                                        <dd className="text-lg font-medium text-gray-900">
                                            {isLoadingData ? '...' : dashboardData?.counts?.totalOrders || 0}
                                        </dd>
                                    </dl>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white overflow-hidden shadow rounded-lg">
                        <div className="p-5">
                            <div className="flex items-center">
                                <div className="flex-shrink-0">
                                    <div className={`w-8 h-8 rounded-md ${colorClasses.primary.bg} flex items-center justify-center`}>
                                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                                        </svg>
                                    </div>
                                </div>
                                <div className="ml-5 w-0 flex-1">
                                    <dl>
                                        <dt className="text-sm font-medium text-gray-500 truncate">Total Users</dt>
                                        <dd className="text-lg font-medium text-gray-900">
                                            {isLoadingData ? '...' : dashboardData?.counts?.totalUsers || 0}
                                        </dd>
                                    </dl>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white overflow-hidden shadow rounded-lg">
                        <div className="p-5">
                            <div className="flex items-center">
                                <div className="flex-shrink-0">
                                    <div className={`w-8 h-8 rounded-md ${colorClasses.primary.bg} flex items-center justify-center`}>
                                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    </div>
                                </div>
                                <div className="ml-5 w-0 flex-1">
                                    <dl>
                                        <dt className="text-sm font-medium text-gray-500 truncate">Pending Orders</dt>
                                        <dd className="text-lg font-medium text-gray-900">
                                            {isLoadingData ? '...' : dashboardData?.counts?.pendingOrders || 0}
                                        </dd>
                                    </dl>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="bg-white shadow rounded-lg mb-8">
                    <div className="px-4 py-5 sm:p-6">
                        <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                            Quick Actions
                        </h3>
                        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            <Button
                                onClick={() => navigateTo('/admin/products')}
                                variant="outline"
                                className="w-full cursor-pointer"
                            >
                                Manage Products
                            </Button>
                            <Button
                                onClick={() => navigateTo('/admin/orders')}
                                variant="outline"
                                className="w-full cursor-pointer"
                            >
                                View Orders
                            </Button>
                            <Button
                                onClick={() => navigateTo('/admin/categories')}
                                variant="outline"
                                className="w-full cursor-pointer"
                            >
                                Manage Categories
                            </Button>
                            <Button
                                onClick={() => navigateTo('/admin/analytics')}
                                variant="outline"
                                className="w-full cursor-pointer"
                            >
                                View Analytics
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Recent Orders */}
                {dashboardData?.recentOrders && dashboardData.recentOrders.length > 0 && (
                    <div className="bg-white shadow rounded-lg mb-8">
                        <div className="px-4 py-5 sm:p-6">
                            <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                                Recent Orders
                            </h3>
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Order
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Customer
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Status
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Amount
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {dashboardData.recentOrders.map((order: Order) => (
                                            <tr key={order._id}>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                    {order.orderNumber}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {order.user?.name}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                                        order.status === 'confirmed' ? 'bg-blue-100 text-blue-800' :
                                                            order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                                                                'bg-red-100 text-red-800'
                                                        }`}>
                                                        {order.status}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    ₹{order.totalAmount}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                )}

                {/* Low Stock Alerts */}
                {dashboardData?.lowStockProducts && dashboardData.lowStockProducts.length > 0 && (
                    <div className="bg-white shadow rounded-lg">
                        <div className="px-4 py-5 sm:p-6">
                            <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                                Low Stock Alerts
                            </h3>
                            <div className="space-y-3">
                                {dashboardData.lowStockProducts.map((product: Product) => (
                                    <div key={product._id} className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                                        <div>
                                            <h4 className="text-sm font-medium text-gray-900">{product.title}</h4>
                                            <p className="text-sm text-gray-500">
                                                Low stock sizes: {product.sizes.filter((s) => s.stock <= 5).map((s) => `${s.size}(${s.stock})`).join(', ')}
                                            </p>
                                        </div>
                                        <Button
                                            onClick={() => navigateTo(`/admin/products/${product._id}/edit`)}
                                            variant="outline"
                                            size="sm"
                                            className="cursor-pointer"
                                        >
                                            Restock
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}
