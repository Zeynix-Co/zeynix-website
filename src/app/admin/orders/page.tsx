'use client';

import Link from 'next/link';
import OrderList from '@/components/admin/OrderList';
import { ArrowLeft, ShoppingBag, ExternalLink, ShieldCheck } from 'lucide-react';

export default function OrdersPage() {
    return (
        <div className="min-h-screen w-full relative bg-[#050B1E] text-white overflow-x-hidden selection:bg-[#B5945B]/30 selection:text-white">
            {/* Ambient Background Glowing Orbs */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
                <div 
                    className="absolute -top-32 -right-32 w-[550px] h-[550px] rounded-full bg-gradient-to-br from-[#B5945B]/15 via-[#D4AF37]/10 to-transparent blur-[140px]" 
                />
                <div className="absolute -bottom-36 -left-36 w-[650px] h-[650px] rounded-full bg-gradient-to-tr from-[#142352]/40 via-[#070F2B]/60 to-transparent blur-[150px]" />
                <div 
                    className="absolute inset-0 opacity-[0.12]"
                    style={{
                        backgroundImage: `radial-gradient(circle, rgba(181, 148, 91, 0.35) 1px, transparent 1px)`,
                        backgroundSize: '36px 36px',
                    }}
                />
            </div>

            {/* Top Navigation Bar */}
            <header className="relative z-20 w-full border-b border-white/10 bg-[#070F2B]/80 backdrop-blur-xl sticky top-0">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <Link
                            href="/admin/dashboard"
                            className="group inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-[#B5945B]/40 text-xs font-semibold text-gray-300 hover:text-white transition-all"
                        >
                            <ArrowLeft className="w-3.5 h-3.5 text-[#B5945B] group-hover:-translate-x-1 transition-transform" />
                            <span>Dashboard</span>
                        </Link>

                        <div className="flex items-center gap-2 text-xs font-bold text-[#B5945B] uppercase tracking-wider">
                            <ShieldCheck className="w-4 h-4 text-[#B5945B]" />
                            <span>Atelier Order Management</span>
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
                {/* Header Banner */}
                <div className="mb-8">
                    <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-[#B5945B] mb-2">
                        <ShoppingBag className="w-3.5 h-3.5" />
                        Executive Order Pipeline
                    </div>
                    <h1 className="text-2xl sm:text-3xl font-black font-serif uppercase tracking-tight text-white">
                        Client Orders &amp; Shipments
                    </h1>
                    <p className="text-xs sm:text-sm text-gray-400 mt-1 max-w-2xl">
                        Monitor customer transactions, track fulfillment progress, update delivery statuses, and oversee boutique orders.
                    </p>
                </div>

                {/* Order List Component */}
                <OrderList />
            </main>
        </div>
    );
}
