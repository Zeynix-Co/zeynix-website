import Link from 'next/link';
import { ArrowLeft, Sparkles } from 'lucide-react';

export default function AuthLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen w-full relative bg-[#050B1E] text-white flex flex-col justify-between overflow-x-hidden selection:bg-[#B5945B]/30 selection:text-white">
            {/* Ambient Background Glowing Orbs */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
                {/* Top-right golden ambient flare */}
                <div 
                    className="absolute -top-32 -right-32 w-[550px] h-[550px] rounded-full bg-gradient-to-br from-[#B5945B]/20 via-[#D4AF37]/10 to-transparent blur-[140px] animate-pulse" 
                    style={{ animationDuration: '8s' }} 
                />
                
                {/* Bottom-left royal indigo/navy ambient flare */}
                <div className="absolute -bottom-36 -left-36 w-[650px] h-[650px] rounded-full bg-gradient-to-tr from-[#142352]/40 via-[#070F2B]/60 to-transparent blur-[150px]" />
                
                {/* Center subtle warm highlight */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[420px] h-[420px] rounded-full bg-[#B5945B]/5 blur-[120px]" />

                {/* Luxury micro-dot grid pattern overlay */}
                <div 
                    className="absolute inset-0 opacity-[0.14]"
                    style={{
                        backgroundImage: `radial-gradient(circle, rgba(181, 148, 91, 0.4) 1px, transparent 1px)`,
                        backgroundSize: '36px 36px',
                    }}
                />

                {/* Atelier Diagonal Texture Lines */}
                <div 
                    className="absolute inset-0 opacity-[0.03]"
                    style={{
                        backgroundImage: `repeating-linear-gradient(45deg, #B5945B 0, #B5945B 1px, transparent 0, transparent 50%)`,
                        backgroundSize: '16px 16px',
                    }}
                />

                {/* Massive Architectural Typography Watermark */}
                <div className="absolute inset-0 flex items-center justify-center select-none pointer-events-none">
                    <span className="text-[19vw] font-serif font-black tracking-[0.25em] text-white/[0.018] uppercase whitespace-nowrap pl-[0.25em]">
                        ZEYNIX
                    </span>
                </div>
            </div>

            {/* Top Navigation Bar: Return to Store */}
            <header className="relative z-20 w-full px-6 py-5 sm:px-10 flex items-center justify-between">
                <Link
                    href="/"
                    className="group inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 hover:border-[#B5945B]/40 text-xs font-semibold tracking-wider uppercase text-gray-300 hover:text-white transition-all duration-300 backdrop-blur-md shadow-sm"
                >
                    <ArrowLeft className="w-3.5 h-3.5 text-[#B5945B] group-hover:-translate-x-1 transition-transform" />
                    <span>Return to Store</span>
                </Link>

                <div className="hidden sm:flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-[#B5945B]/80">
                    <Sparkles className="w-3 h-3 text-[#B5945B]" />
                    <span>Official Atelier</span>
                </div>
            </header>

            {/* Content Area */}
            <main className="relative z-10 flex-1 flex items-center justify-center px-4 py-6 sm:py-10">
                {children}
            </main>

            {/* Footer Subtle Brand Tagline */}
            <footer className="relative z-20 w-full px-6 py-4 text-center">
                <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-gray-500">
                    Zeynix Atelier • Wear The Luxury • All Rights Reserved
                </p>
            </footer>
        </div>
    );
}