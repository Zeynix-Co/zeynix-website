import Link from 'next/link';
import AdminSetupPage from '@/components/admin/AdminSetupPage';
import { ArrowLeft, Lock } from 'lucide-react';

export default function AdminSetupRoute() {
    return (
        <div className="min-h-screen w-full relative bg-[#050B1E] text-white flex flex-col justify-between overflow-x-hidden selection:bg-[#B5945B]/30 selection:text-white">
            {/* Ambient Background Glowing Orbs */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
                <div 
                    className="absolute -top-32 -right-32 w-[550px] h-[550px] rounded-full bg-gradient-to-br from-[#B5945B]/20 via-[#D4AF37]/10 to-transparent blur-[140px] animate-pulse" 
                    style={{ animationDuration: '8s' }} 
                />
                <div className="absolute -bottom-36 -left-36 w-[650px] h-[650px] rounded-full bg-gradient-to-tr from-[#142352]/40 via-[#070F2B]/60 to-transparent blur-[150px]" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[420px] h-[420px] rounded-full bg-[#B5945B]/5 blur-[120px]" />

                <div 
                    className="absolute inset-0 opacity-[0.14]"
                    style={{
                        backgroundImage: `radial-gradient(circle, rgba(181, 148, 91, 0.4) 1px, transparent 1px)`,
                        backgroundSize: '36px 36px',
                    }}
                />
            </div>

            {/* Top Navigation Bar */}
            <header className="relative z-20 w-full px-6 py-5 sm:px-10 flex items-center justify-between">
                <Link
                    href="/"
                    className="group inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 hover:border-[#B5945B]/40 text-xs font-semibold tracking-wider uppercase text-gray-300 hover:text-white transition-all duration-300 backdrop-blur-md shadow-sm"
                >
                    <ArrowLeft className="w-3.5 h-3.5 text-[#B5945B] group-hover:-translate-x-1 transition-transform" />
                    <span>Return to Store</span>
                </Link>

                <div className="hidden sm:flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-[#B5945B]/80">
                    <Lock className="w-3 h-3 text-[#B5945B]" />
                    <span>Administrator Provisioning</span>
                </div>
            </header>

            {/* Content Area */}
            <main className="relative z-10 flex-1 flex items-center justify-center px-4 py-6 sm:py-10">
                <AdminSetupPage />
            </main>

            {/* Footer */}
            <footer className="relative z-20 w-full px-6 py-4 text-center">
                <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-gray-500">
                    Zeynix Atelier • Executive Administration • Confidential Access Only
                </p>
            </footer>
        </div>
    );
}
