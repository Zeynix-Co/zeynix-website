'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { useAdminStore } from '@/store';
import {
    Package,
    ShoppingBag,
    Users,
    Clock,
    ArrowUpRight,
    LogOut,
    RefreshCw,
    ShieldCheck,
    AlertTriangle,
    ExternalLink,
    Sparkles,
    Layers,
    TrendingUp,
    ChevronRight,
    Eye
} from 'lucide-react';

interface Order {
    _id: string;
    orderNumber: string;
    user?: {
        name: string;
        email?: string;
    };
    status: 'pending' | 'confirmed' | 'delivered' | 'cancelled';
    totalAmount: number;
    createdAt?: string;
}

interface Product {
    _id: string;
    title: string;
    sizes: Array<{
        size: string;
        stock: number;
    }>;
}

export default function AdminDashboardPage() {
    const router = useRouter();
    const { user, dashboardData, getDashboardData, logout } = useAdminStore();
    const [isLoadingData, setIsLoadingData] = useState(false);

    // Fetch dashboard data
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

    useEffect(() => {
        fetchData();
    }, []);

    const handleLogout = async () => {
        await logout();
        window.location.href = '/admin/login';
    };

    const navigateTo = (path: string) => {
        router.push(path);
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'pending':
                return (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-500/15 text-amber-300 border border-amber-500/30">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                        Pending
                    </span>
                );
            case 'confirmed':
                return (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-sky-500/15 text-sky-300 border border-sky-500/30">
                        <span className="w-1.5 h-1.5 rounded-full bg-sky-400" />
                        Confirmed
                    </span>
                );
            case 'delivered':
                return (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                        Delivered
                    </span>
                );
            case 'cancelled':
                return (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-rose-500/15 text-rose-300 border border-rose-500/30">
                        <span className="w-1.5 h-1.5 rounded-full bg-rose-400" />
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

    if (!user) {
        return null;
    }

    return (
        <div className="min-h-screen w-full relative bg-[#050B1E] text-white overflow-x-hidden selection:bg-[#B5945B]/30 selection:text-white">
            {/* Ambient Background Glows */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
                <div 
                    className="absolute -top-40 -right-40 w-[600px] h-[600px] rounded-full bg-gradient-to-br from-[#B5945B]/15 via-[#D4AF37]/10 to-transparent blur-[150px] animate-pulse"
                    style={{ animationDuration: '10s' }}
                />
                <div className="absolute -bottom-40 -left-40 w-[700px] h-[700px] rounded-full bg-gradient-to-tr from-[#142352]/40 via-[#070F2B]/60 to-transparent blur-[160px]" />
                <div 
                    className="absolute inset-0 opacity-[0.12]"
                    style={{
                        backgroundImage: `radial-gradient(circle, rgba(181, 148, 91, 0.35) 1px, transparent 1px)`,
                        backgroundSize: '36px 36px',
                    }}
                />
                <div className="absolute inset-0 flex items-center justify-center select-none pointer-events-none opacity-[0.015]">
                    <span className="text-[20vw] font-serif font-black tracking-[0.25em] text-white uppercase">
                        ATELIER
                    </span>
                </div>
            </div>

            {/* Top Navigation Bar */}
            <header className="relative z-20 w-full border-b border-white/10 bg-[#070F2B]/80 backdrop-blur-xl sticky top-0">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-18">
                        {/* Brand Info */}
                        <div className="flex items-center gap-3.5">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-b from-[#B5945B]/20 to-transparent border border-[#B5945B]/40 flex items-center justify-center relative shadow-sm">
                                <Image
                                    src="/images/logos/zeynix-logo-rbg.png"
                                    alt="Zeynix Logo"
                                    width={28}
                                    height={28}
                                    className="object-contain drop-shadow"
                                    priority
                                />
                            </div>
                            <div>
                                <div className="flex items-center gap-2">
                                    <h1 className="text-base sm:text-lg font-black tracking-wider text-white font-serif uppercase">
                                        Zeynix Atelier
                                    </h1>
                                    <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#B5945B]/15 border border-[#B5945B]/30 text-[9px] font-extrabold tracking-widest text-[#B5945B] uppercase">
                                        <ShieldCheck className="w-2.5 h-2.5" />
                                        Admin Suite
                                    </span>
                                </div>
                                <p className="text-[10px] font-medium text-gray-400">
                                    Executive Management Console
                                </p>
                            </div>
                        </div>

                        {/* Actions & Profile */}
                        <div className="flex items-center gap-2 sm:gap-3">
                            {/* Live Store Link */}
                            <Link
                                href="/"
                                target="_blank"
                                className="hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-[#B5945B]/40 text-xs font-semibold text-gray-300 hover:text-white transition-all"
                            >
                                <ExternalLink className="w-3.5 h-3.5 text-[#B5945B]" />
                                <span>Live Store</span>
                            </Link>

                            {/* Refresh Button */}
                            <button
                                onClick={fetchData}
                                disabled={isLoadingData}
                                title="Refresh Dashboard Data"
                                className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 hover:text-white transition-all cursor-pointer disabled:opacity-50"
                            >
                                <RefreshCw className={`w-4 h-4 text-[#B5945B] ${isLoadingData ? 'animate-spin' : ''}`} />
                            </button>

                            {/* Admin Chip */}
                            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/5 border border-white/10">
                                <div className="w-6 h-6 rounded-full bg-gradient-to-r from-[#B5945B] to-[#D4AF37] flex items-center justify-center text-[#070F2B] font-black text-xs">
                                    {user.name.charAt(0).toUpperCase()}
                                </div>
                                <span className="text-xs font-bold text-gray-200">
                                    {user.name}
                                </span>
                            </div>

                            {/* Logout */}
                            <button
                                onClick={handleLogout}
                                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-200 hover:text-white text-xs font-semibold transition-all cursor-pointer"
                            >
                                <LogOut className="w-3.5 h-3.5" />
                                <span className="hidden sm:inline">Sign Out</span>
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Dashboard Workspace */}
            <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
                {/* Hero Welcome Banner */}
                <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#070F2B] via-[#0E1B48] to-[#070F2B] border border-[#B5945B]/30 p-6 sm:p-8 shadow-2xl">
                    <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-[#B5945B] to-transparent" />
                    <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                            <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-[#B5945B] mb-2">
                                <Sparkles className="w-3.5 h-3.5" />
                                Atelier Control Center
                            </div>
                            <h2 className="text-2xl sm:text-3xl font-black font-serif uppercase tracking-tight text-white">
                                Welcome back, {user.name}
                            </h2>
                            <p className="text-xs sm:text-sm text-gray-300 mt-1 max-w-2xl leading-relaxed">
                                Monitor live customer orders, update high-fashion streetwear catalog drops, and maintain luxury boutique operations.
                            </p>
                        </div>

                        <div className="flex items-center gap-3">
                            <button
                                onClick={() => navigateTo('/admin/products')}
                                className="h-10 px-4 rounded-xl text-xs font-extrabold uppercase tracking-wider text-[#070F2B] bg-gradient-to-r from-[#B5945B] to-[#D4AF37] hover:from-[#A3834E] hover:to-[#B5945B] transition-all flex items-center gap-1.5 shadow-md cursor-pointer"
                            >
                                <Package className="w-3.5 h-3.5" />
                                <span>Catalog Management</span>
                            </button>
                            <button
                                onClick={() => navigateTo('/admin/orders')}
                                className="h-10 px-4 rounded-xl text-xs font-extrabold uppercase tracking-wider bg-white/10 hover:bg-white/15 border border-white/15 text-white transition-all flex items-center gap-1.5 cursor-pointer"
                            >
                                <ShoppingBag className="w-3.5 h-3.5 text-[#B5945B]" />
                                <span>View Orders</span>
                            </button>
                        </div>
                    </div>
                </div>

                {/* 4 Executive KPI Stat Cards */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                    {/* Stat: Products */}
                    <div className="bg-[#070F2B]/85 backdrop-blur-xl rounded-2xl p-5 border border-[#B5945B]/25 hover:border-[#B5945B]/60 transition-all shadow-lg relative overflow-hidden group">
                        <div className="flex items-center justify-between mb-3">
                            <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400">Total Products</span>
                            <div className="w-9 h-9 rounded-xl bg-[#B5945B]/15 border border-[#B5945B]/30 flex items-center justify-center text-[#B5945B] group-hover:scale-110 transition-transform">
                                <Package className="w-4 h-4" />
                            </div>
                        </div>
                        <div className="text-2xl sm:text-3xl font-black font-serif text-white">
                            {isLoadingData ? '...' : dashboardData?.stats?.totalProducts ?? 0}
                        </div>
                        <p className="text-[10px] font-medium text-[#B5945B] mt-1 flex items-center gap-1">
                            <span>Catalog drops live</span>
                        </p>
                    </div>

                    {/* Stat: Orders */}
                    <div className="bg-[#070F2B]/85 backdrop-blur-xl rounded-2xl p-5 border border-[#B5945B]/25 hover:border-[#B5945B]/60 transition-all shadow-lg relative overflow-hidden group">
                        <div className="flex items-center justify-between mb-3">
                            <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400">Total Orders</span>
                            <div className="w-9 h-9 rounded-xl bg-[#B5945B]/15 border border-[#B5945B]/30 flex items-center justify-center text-[#B5945B] group-hover:scale-110 transition-transform">
                                <ShoppingBag className="w-4 h-4" />
                            </div>
                        </div>
                        <div className="text-2xl sm:text-3xl font-black font-serif text-white">
                            {isLoadingData ? '...' : dashboardData?.stats?.totalOrders ?? 0}
                        </div>
                        <p className="text-[10px] font-medium text-emerald-400 mt-1 flex items-center gap-1">
                            <span>Processed orders</span>
                        </p>
                    </div>

                    {/* Stat: Users */}
                    <div className="bg-[#070F2B]/85 backdrop-blur-xl rounded-2xl p-5 border border-[#B5945B]/25 hover:border-[#B5945B]/60 transition-all shadow-lg relative overflow-hidden group">
                        <div className="flex items-center justify-between mb-3">
                            <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400">VIP Members</span>
                            <div className="w-9 h-9 rounded-xl bg-[#B5945B]/15 border border-[#B5945B]/30 flex items-center justify-center text-[#B5945B] group-hover:scale-110 transition-transform">
                                <Users className="w-4 h-4" />
                            </div>
                        </div>
                        <div className="text-2xl sm:text-3xl font-black font-serif text-white">
                            {isLoadingData ? '...' : dashboardData?.stats?.totalUsers ?? 0}
                        </div>
                        <p className="text-[10px] font-medium text-sky-400 mt-1 flex items-center gap-1">
                            <span>Registered clientele</span>
                        </p>
                    </div>

                    {/* Stat: Pending Orders */}
                    <div className="bg-[#070F2B]/85 backdrop-blur-xl rounded-2xl p-5 border border-[#B5945B]/25 hover:border-[#B5945B]/60 transition-all shadow-lg relative overflow-hidden group">
                        <div className="flex items-center justify-between mb-3">
                            <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400">Pending Orders</span>
                            <div className="w-9 h-9 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400 group-hover:scale-110 transition-transform">
                                <Clock className="w-4 h-4" />
                            </div>
                        </div>
                        <div className="text-2xl sm:text-3xl font-black font-serif text-white">
                            {isLoadingData ? '...' : dashboardData?.stats?.pendingOrders ?? 0}
                        </div>
                        <p className="text-[10px] font-medium text-amber-300 mt-1 flex items-center gap-1">
                            <span>Awaiting shipment</span>
                        </p>
                    </div>
                </div>

                {/* Quick Command Suite */}
                <div className="bg-[#070F2B]/85 backdrop-blur-xl rounded-3xl p-6 sm:p-8 border border-white/10 shadow-xl">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h3 className="text-lg font-black text-white font-serif uppercase tracking-tight">
                                Quick Actions
                            </h3>
                            <p className="text-xs text-gray-400 mt-0.5">
                                Direct shortcuts to core administrative modules
                            </p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        {/* Action 1: Manage Products */}
                        <button
                            onClick={() => navigateTo('/admin/products')}
                            className="group p-5 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-[#B5945B]/50 transition-all text-left flex flex-col justify-between h-36 cursor-pointer"
                        >
                            <div className="flex items-center justify-between w-full">
                                <div className="w-10 h-10 rounded-xl bg-[#B5945B]/15 border border-[#B5945B]/30 flex items-center justify-center text-[#B5945B]">
                                    <Package className="w-5 h-5" />
                                </div>
                                <ArrowUpRight className="w-4 h-4 text-gray-500 group-hover:text-[#B5945B] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                            </div>
                            <div>
                                <h4 className="text-sm font-extrabold text-white group-hover:text-[#B5945B] transition-colors">
                                    Manage Products
                                </h4>
                                <p className="text-[11px] text-gray-400 mt-0.5">
                                    Add, edit, restock &amp; discount items
                                </p>
                            </div>
                        </button>

                        {/* Action 2: View Orders */}
                        <button
                            onClick={() => navigateTo('/admin/orders')}
                            className="group p-5 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-[#B5945B]/50 transition-all text-left flex flex-col justify-between h-36 cursor-pointer"
                        >
                            <div className="flex items-center justify-between w-full">
                                <div className="w-10 h-10 rounded-xl bg-[#B5945B]/15 border border-[#B5945B]/30 flex items-center justify-center text-[#B5945B]">
                                    <ShoppingBag className="w-5 h-5" />
                                </div>
                                <ArrowUpRight className="w-4 h-4 text-gray-500 group-hover:text-[#B5945B] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                            </div>
                            <div>
                                <h4 className="text-sm font-extrabold text-white group-hover:text-[#B5945B] transition-colors">
                                    View Orders
                                </h4>
                                <p className="text-[11px] text-gray-400 mt-0.5">
                                    Track shipments &amp; update fulfillment
                                </p>
                            </div>
                        </button>

                        {/* Action 3: Categories */}
                        <button
                            onClick={() => navigateTo('/admin/products')}
                            className="group p-5 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-[#B5945B]/50 transition-all text-left flex flex-col justify-between h-36 cursor-pointer"
                        >
                            <div className="flex items-center justify-between w-full">
                                <div className="w-10 h-10 rounded-xl bg-[#B5945B]/15 border border-[#B5945B]/30 flex items-center justify-center text-[#B5945B]">
                                    <Layers className="w-5 h-5" />
                                </div>
                                <ArrowUpRight className="w-4 h-4 text-gray-500 group-hover:text-[#B5945B] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                            </div>
                            <div>
                                <h4 className="text-sm font-extrabold text-white group-hover:text-[#B5945B] transition-colors">
                                    Collections
                                </h4>
                                <p className="text-[11px] text-gray-400 mt-0.5">
                                    Organize drops, hoodies, tees &amp; jeans
                                </p>
                            </div>
                        </button>

                        {/* Action 4: Analytics */}
                        <button
                            onClick={() => navigateTo('/admin/orders')}
                            className="group p-5 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-[#B5945B]/50 transition-all text-left flex flex-col justify-between h-36 cursor-pointer"
                        >
                            <div className="flex items-center justify-between w-full">
                                <div className="w-10 h-10 rounded-xl bg-[#B5945B]/15 border border-[#B5945B]/30 flex items-center justify-center text-[#B5945B]">
                                    <TrendingUp className="w-5 h-5" />
                                </div>
                                <ArrowUpRight className="w-4 h-4 text-gray-500 group-hover:text-[#B5945B] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                            </div>
                            <div>
                                <h4 className="text-sm font-extrabold text-white group-hover:text-[#B5945B] transition-colors">
                                    Sales Metrics
                                </h4>
                                <p className="text-[11px] text-gray-400 mt-0.5">
                                    Revenue reports &amp; order trends
                                </p>
                            </div>
                        </button>
                    </div>
                </div>

                {/* Recent Orders Section */}
                <div className="bg-[#070F2B]/85 backdrop-blur-xl rounded-3xl p-6 sm:p-8 border border-white/10 shadow-xl">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                        <div>
                            <h3 className="text-lg font-black text-white font-serif uppercase tracking-tight">
                                Recent Orders
                            </h3>
                            <p className="text-xs text-gray-400 mt-0.5">
                                Latest atelier transactions placed by customers
                            </p>
                        </div>
                        <button
                            onClick={() => navigateTo('/admin/orders')}
                            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/15 hover:border-[#B5945B]/50 text-xs font-bold text-gray-300 hover:text-white transition-all cursor-pointer self-start sm:self-auto"
                        >
                            <span>View All Orders</span>
                            <ChevronRight className="w-3.5 h-3.5 text-[#B5945B]" />
                        </button>
                    </div>

                    {!dashboardData?.recentOrders || dashboardData.recentOrders.length === 0 ? (
                        <div className="text-center py-12 rounded-2xl bg-white/5 border border-white/5">
                            <ShoppingBag className="w-10 h-10 text-gray-500 mx-auto mb-3" />
                            <h4 className="text-sm font-bold text-gray-300">No Orders Yet</h4>
                            <p className="text-xs text-gray-500 mt-1 max-w-sm mx-auto">
                                New orders placed by customers will automatically synchronize in this section.
                            </p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto rounded-2xl border border-white/10">
                            <table className="min-w-full divide-y divide-white/10 text-left">
                                <thead className="bg-white/5">
                                    <tr>
                                        <th className="px-5 py-3.5 text-[10px] font-extrabold text-[#B5945B] uppercase tracking-wider">
                                            Order
                                        </th>
                                        <th className="px-5 py-3.5 text-[10px] font-extrabold text-[#B5945B] uppercase tracking-wider">
                                            Client
                                        </th>
                                        <th className="px-5 py-3.5 text-[10px] font-extrabold text-[#B5945B] uppercase tracking-wider">
                                            Status
                                        </th>
                                        <th className="px-5 py-3.5 text-[10px] font-extrabold text-[#B5945B] uppercase tracking-wider">
                                            Amount
                                        </th>
                                        <th className="px-5 py-3.5 text-[10px] font-extrabold text-[#B5945B] uppercase tracking-wider text-right">
                                            Action
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5 text-xs">
                                    {dashboardData.recentOrders.map((order: Order) => (
                                        <tr key={order._id} className="hover:bg-white/5 transition-colors">
                                            <td className="px-5 py-4 font-mono font-bold text-gray-200">
                                                #{order.orderNumber || order._id.slice(-6).toUpperCase()}
                                            </td>
                                            <td className="px-5 py-4">
                                                <div className="font-semibold text-white">
                                                    {order.user?.name || 'Guest Customer'}
                                                </div>
                                                {order.user?.email && (
                                                    <div className="text-[10px] text-gray-400">
                                                        {order.user.email}
                                                    </div>
                                                )}
                                            </td>
                                            <td className="px-5 py-4">
                                                {getStatusBadge(order.status)}
                                            </td>
                                            <td className="px-5 py-4 font-bold text-white">
                                                ₹{order.totalAmount?.toLocaleString('en-IN')}
                                            </td>
                                            <td className="px-5 py-4 text-right">
                                                <button
                                                    onClick={() => navigateTo(`/admin/orders/${order._id}`)}
                                                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white/5 hover:bg-[#B5945B]/20 border border-white/10 hover:border-[#B5945B]/40 text-[11px] font-semibold text-gray-300 hover:text-white transition-all cursor-pointer"
                                                >
                                                    <Eye className="w-3 h-3 text-[#B5945B]" />
                                                    <span>View</span>
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>

                {/* Low Stock Alerts */}
                {dashboardData?.lowStockProducts && dashboardData.lowStockProducts.length > 0 && (
                    <div className="bg-[#070F2B]/85 backdrop-blur-xl rounded-3xl p-6 sm:p-8 border border-amber-500/30 shadow-xl">
                        <div className="flex items-center justify-between mb-5">
                            <div className="flex items-center gap-2.5">
                                <div className="w-8 h-8 rounded-lg bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400">
                                    <AlertTriangle className="w-4 h-4" />
                                </div>
                                <div>
                                    <h3 className="text-base font-black text-white font-serif uppercase tracking-tight">
                                        Inventory Restock Alerts
                                    </h3>
                                    <p className="text-xs text-gray-400">
                                        Products nearing zero stock in specific sizing
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                            {dashboardData.lowStockProducts.map((product: Product) => (
                                <div
                                    key={product._id}
                                    className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/10 hover:border-amber-500/40 transition-all"
                                >
                                    <div>
                                        <h4 className="text-xs font-bold text-white">
                                            {product.title}
                                        </h4>
                                        <div className="flex flex-wrap gap-1.5 mt-1.5">
                                            {product.sizes.map((s, idx) => (
                                                <span
                                                    key={idx}
                                                    className="px-2 py-0.5 rounded-md bg-amber-500/15 border border-amber-500/30 text-[10px] font-mono font-bold text-amber-300"
                                                >
                                                    {s.size}: {s.stock} left
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => navigateTo(`/admin/products`)}
                                        className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-[#B5945B] hover:text-[#070F2B] text-xs font-bold text-gray-300 transition-all cursor-pointer"
                                    >
                                        Restock
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </main>

            {/* Footer */}
            <footer className="relative z-20 w-full px-6 py-6 text-center border-t border-white/5 mt-12">
                <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-gray-500">
                    Zeynix Atelier • Administrative Management Suite • Wear The Luxury
                </p>
            </footer>
        </div>
    );
}
