'use client';

import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';

export default function HeroSection() {
    const scrollToContent = () => {
        const nextSection = document.getElementById('products-section') || document.querySelector('section');
        if (nextSection) {
            nextSection.scrollIntoView({ behavior: 'smooth' });
        } else {
            window.scrollBy({ top: window.innerHeight * 0.9, behavior: 'smooth' });
        }
    };

    return (
        <section 
            className="relative w-full h-[100svh] min-h-[560px] max-h-[850px] lg:max-h-[900px] bg-[#070F2B] overflow-hidden flex flex-col justify-between pt-20 sm:pt-24 lg:pt-28 pb-6 sm:pb-8 px-6 sm:px-12 lg:px-16"
            aria-label="Zeynix Streetwear Campaign"
        >
            {/* 1. REAL FASHION CAMPAIGN PHOTOGRAPHY */}
            <div className="absolute inset-0 w-full h-full">
                {/* Desktop & Tablet Lookbook Photo (Real Indian Model on Urban Rooftop in Zeynix Oversized Tee) */}
                <div className="hidden sm:block absolute inset-0 w-full h-full">
                    <Image
                        src="/images/hero/zeynix-campaign-desktop.webp"
                        alt="Zeynix Streetwear Campaign — Modern Indian Fashion Lookbook"
                        fill
                        priority
                        unoptimized
                        sizes="100vw"
                        className="object-cover object-[72%_center] lg:object-[75%_center] xl:object-[78%_center]"
                    />
                </div>

                {/* Mobile Lookbook Photo (Real Indian Model Vertical Campaign) */}
                <div className="block sm:hidden absolute inset-0 w-full h-full">
                    <Image
                        src="/images/hero/zeynix-campaign-mobile.webp"
                        alt="Zeynix Streetwear Campaign — Modern Indian Fashion Lookbook"
                        fill
                        priority
                        unoptimized
                        sizes="100vw"
                        className="object-cover object-[center_20%]"
                    />
                </div>

                {/* Editorial Contrast Scrims (Preserving Brand Dark Identity & Legibility) */}
                {/* Desktop Left Scrim: Seamlessly merges image with dark canvas for crisp headline contrast */}
                <div className="hidden sm:block absolute inset-0 bg-gradient-to-r from-[#070F2B] via-[#070F2B]/90 via-38% md:via-46% to-transparent pointer-events-none z-10" />

                {/* Mobile Contrast Scrim: Top and bottom gradients keeping model visible in center */}
                <div className="block sm:hidden absolute inset-0 bg-gradient-to-t from-[#070F2B] via-[#070F2B]/75 via-45% to-transparent pointer-events-none z-10" />
                <div className="block sm:hidden absolute inset-0 bg-gradient-to-b from-[#070F2B]/80 via-transparent to-transparent pointer-events-none z-10" />

                {/* Bottom Edge Fade */}
                <div className="absolute bottom-0 inset-x-0 h-20 bg-gradient-to-t from-[#070F2B] to-transparent pointer-events-none z-10" />
            </div>

            {/* 2. FOREGROUND EDITORIAL CONTENT (Authentic Streetwear Art Direction) */}
            <div className="relative z-20 w-full max-w-7xl mx-auto flex flex-col justify-between h-full">
                
                {/* Top Subtle Label */}
                <div className="w-full flex items-center justify-between">
                    <span className="text-[11px] sm:text-xs font-mono uppercase tracking-[0.25em] text-white/60">
                        NEW DROP 01 / 2026
                    </span>
                    <span className="hidden sm:inline-block text-[11px] sm:text-xs font-mono uppercase tracking-[0.25em] text-white/40">
                        ZEYNIX ATELIER
                    </span>
                </div>

                {/* Center / Lower-Left Campaign Statement & Action */}
                <div className="my-auto max-w-xl lg:max-w-2xl py-4 sm:py-6">
                    {/* Main Headline */}
                    <h1 className="font-black uppercase text-white tracking-tight leading-[0.95] text-3xl sm:text-5xl md:text-[3.5rem] lg:text-[4.25rem] xl:text-[4.75rem] text-balance">
                        NOT FOR EVERYONE.<br />
                        THAT&apos;S THE POINT.
                    </h1>

                    {/* Supporting Line */}
                    <p className="mt-3.5 sm:mt-4 text-sm sm:text-base text-white/70 font-normal leading-relaxed max-w-sm">
                        Independent streetwear. Made for your frequency.
                    </p>

                    {/* Clean Streetwear CTA (Refined Rectangular, No Generic Pill Shape) */}
                    <div className="mt-6 sm:mt-8 flex items-center">
                        <Link
                            href="/products"
                            className="group inline-flex items-center gap-3 bg-white text-[#070F2B] hover:bg-[#FAF6F0] px-7 py-3.5 sm:px-8 sm:py-4 font-bold text-xs sm:text-sm uppercase tracking-[0.16em] transition-colors duration-200"
                        >
                            <span>SHOP THE DROP</span>
                            <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
                        </Link>

                        <button
                            onClick={scrollToContent}
                            className="ml-6 sm:ml-8 text-white/75 hover:text-white text-xs sm:text-sm font-semibold uppercase tracking-[0.16em] transition-colors underline underline-offset-8 decoration-white/30 hover:decoration-white cursor-pointer"
                        >
                            EXPLORE ZEYNIX
                        </button>
                    </div>
                </div>

                {/* Bottom Editorial Bar */}
                <div className="w-full flex items-center justify-between pt-3 border-t border-white/10 text-[10px] sm:text-[11px] font-mono uppercase tracking-[0.2em] text-white/45">
                    <span>ZEYNIX STUDIO // INDIA</span>

                    <button
                        onClick={scrollToContent}
                        className="hover:text-white transition-colors cursor-pointer flex items-center gap-1.5"
                    >
                        <span>SCROLL</span>
                        <span>↓</span>
                    </button>
                </div>
            </div>
        </section>
    );
}
