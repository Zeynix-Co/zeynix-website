'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { useAdminStore } from '@/store';
import OrderList from '@/components/admin/OrderList';
import {
    ShoppingBag,
    ArrowLeft,
    ExternalLink,
    RefreshCw,
    LogOut,
    ShieldCheck,
    Package
} from 'lucide-react';

export default function AdminOrdersPage() {
    const router = useRouter();
    const { logout } = useAdminStore();

    const handleLogout = async () => {
        await logout();
        window.location.href = '/admin/login';
    };

    return (
        <div className="min-h-screen w-full relative bg-[#050B1E] text-white overflow-x-hidden selection:bg-[#B5945B]/30 selection:text-white">
            {/* Ambient Background Glows */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
                <div className="absolute -top-40 -right-40 w-[600px] h-[600px] rounded-full bg-gradient-to-br from-[#B5945B]/15 via-[#D4AF37]/10 to-transparent blur-[150px]" />
                <div className="absolute -bottom-40 -left-40 w-[700px] h-[700px] rounded-full bg-gradient-to-tr from-[#142352]/40 via-[#070F2B]/60 to-transparent blur-[160px]" />
                <div
                    className="absolute inset-0 opacity-[0.1]"
                    style={{
                        backgroundImage: `radial-gradient(circle, rgba(181, 148, 91, 0.35) 1px, transparent 1px)`,
                        backgroundSize: '36px 36px',
                    }}
                />
            </div>

            {/* Top Navigation Bar */}
            <header className="relative z-20 w-full border-b border-white/10 bg-[#070F2B]/85 backdrop-blur-xl sticky top-0">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-18">
                        {/* Brand Info & Back */}
                        <div className="flex items-center gap-3.5">
                            <Link
                                href="/admin/dashboard"
                                className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 hover:text-white transition-all flex items-center gap-1.5 text-xs font-bold"
                                title="Back to Dashboard"
                            >
                                <ArrowLeft className="w-4 h-4 text-[#B5945B]" />
                                <span className="hidden sm:inline">Dashboard</span>
                            </Link>

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
                                        Orders Console
                                    </h1>
                                    <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#B5945B]/15 border border-[#B5945B]/30 text-[9px] font-extrabold tracking-widest text-[#B5945B] uppercase">
                                        <ShieldCheck className="w-2.5 h-2.5" />
                                        Fulfillment Suite
                                    </span>
                                </div>
                                <p className="text-[10px] font-medium text-gray-400">
                                    Manage Customer Transactions, Shipping &amp; Order Status
                                </p>
                            </div>
                        </div>

                        {/* Top Actions */}
                        <div className="flex items-center gap-2 sm:gap-3">
                            <Link
                                href="/admin/products"
                                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-bold text-gray-300 hover:text-white transition-all"
                            >
                                <Package className="w-3.5 h-3.5 text-[#B5945B]" />
                                <span>Manage Products</span>
                            </Link>

                            <Link
                                href="/"
                                target="_blank"
                                className="hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-[#B5945B]/40 text-xs font-semibold text-gray-300 hover:text-white transition-all"
                            >
                                <ExternalLink className="w-3.5 h-3.5 text-[#B5945B]" />
                                <span>Live Store</span>
                            </Link>

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

            {/* Main Content Workspace */}
            <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
                <div className="rounded-3xl bg-[#070F2B]/90 border border-white/10 p-6 sm:p-8 shadow-xl">
                    <OrderList />
                </div>
            </main>

            {/* Footer */}
            <footer className="relative z-20 w-full px-6 py-6 text-center border-t border-white/5 mt-12">
                <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-gray-500">
                    Zeynix Atelier • Order Management Suite • Wear The Luxury
                </p>
            </footer>
        </div>
    );
}

