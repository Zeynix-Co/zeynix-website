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
            className="relative w-full h-[100svh] min-h-[580px] max-h-[820px] lg:max-h-[880px] bg-[#070F2B] overflow-hidden flex flex-col justify-between"
            aria-label="Zeynix Streetwear Campaign"
        >
            {/* 1. PHOTOGRAPHY BACKGROUND LAYER */}
            <div className="absolute inset-0 w-full h-full pointer-events-none">
                {/* Desktop & Tablet View (Model positioned on right with seamless midnight navy background on left) */}
                <div className="hidden md:block absolute inset-0 w-full h-full">
                    <Image
                        src="/images/hero/zeynix-hero-model-desktop.webp"
                        alt="Zeynix Streetwear Model - Quiet Minds Move Strong Oversized Tee"
                        fill
                        priority
                        unoptimized
                        sizes="100vw"
                        className="object-cover object-[right_top] lg:object-[85%_top] xl:object-[88%_top]"
                    />
                    {/* Subtle Left Scrim for crisp typography contrast */}
                    <div className="absolute inset-0 bg-gradient-to-r from-[#070F2B] via-[#070F2B]/90 via-35% lg:via-42% to-transparent pointer-events-none" />
                </div>

                {/* Mobile View (Model in upper portion, natural dark navy extension below) */}
                <div className="block md:hidden absolute inset-0 w-full h-full">
                    <Image
                        src="/images/hero/zeynix-hero-model-mobile.webp"
                        alt="Zeynix Streetwear Model - Quiet Minds Move Strong Oversized Tee"
                        fill
                        priority
                        unoptimized
                        sizes="100vw"
                        className="object-cover object-top"
                    />
                    {/* Bottom-to-middle midnight navy gradient so headline and button sit on clean canvas */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#070F2B] via-[#070F2B]/95 via-48% to-transparent pointer-events-none" />
                    {/* Very subtle top scrim for navbar legibility without hiding model's face/hair */}
                    <div className="absolute top-0 inset-x-0 h-16 bg-gradient-to-b from-[#070F2B]/40 to-transparent pointer-events-none" />
                </div>

                {/* Bottom Edge subtle blend into page */}
                <div className="absolute bottom-0 inset-x-0 h-16 bg-gradient-to-t from-[#070F2B] to-transparent pointer-events-none" />
            </div>

            {/* 2. FOREGROUND EDITORIAL CONTENT */}
            {/* Responsive padding: mobile starts with space for fixed header, desktop has generous breathing room */}
            <div className="relative z-20 w-full max-w-7xl mx-auto px-5 sm:px-10 lg:px-16 pt-20 sm:pt-24 lg:pt-28 pb-5 sm:pb-8 flex flex-col justify-between h-full">
                
                {/* Top Subtle Status Tag */}
                <div className="w-full flex items-center justify-between">
                    <span className="text-[10px] sm:text-xs font-mono uppercase tracking-[0.25em] text-[#B5945B] font-semibold">
                        NEW DROP 01 / 2026
                    </span>
                    <span className="hidden sm:inline-block text-[10px] sm:text-xs font-mono uppercase tracking-[0.25em] text-white/40">
                        ZEYNIX ATELIER
                    </span>
                </div>

                {/* Center / Lower Content Block */}
                {/* On mobile: placed at bottom above the footer bar. On desktop: vertically centered on left. */}
                <div className="mt-auto md:my-auto max-w-lg lg:max-w-xl pb-2 sm:pb-4 md:py-6">
                    {/* Main Headline */}
                    <h1 className="font-black uppercase text-white tracking-tight leading-[0.96] text-3xl xs:text-4xl sm:text-5xl lg:text-[4rem] xl:text-[4.5rem] text-balance">
                        NOT FOR EVERYONE.<br />
                        THAT&apos;S THE POINT.
                    </h1>

                    {/* Supporting Line */}
                    <p className="mt-2.5 sm:mt-3.5 text-xs sm:text-sm md:text-base text-white/70 font-normal leading-relaxed max-w-sm">
                        Independent streetwear. Made for your frequency.
                    </p>

                    {/* Call to Action Buttons */}
                    <div className="mt-4 sm:mt-6 flex flex-wrap items-center gap-3 sm:gap-4">
                        {/* Primary Button */}
                        <Link
                            href="/products"
                            className="group inline-flex items-center justify-center gap-2.5 bg-[#FAF6F0] text-[#070F2B] hover:bg-white px-6 sm:px-8 py-3 sm:py-3.5 font-bold text-xs sm:text-sm uppercase tracking-[0.16em] transition-colors duration-200 shadow-lg active:scale-[0.98]"
                        >
                            <span>SHOP THE DROP</span>
                            <ArrowRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-1" />
                        </Link>

                        {/* Secondary Link */}
                        <button
                            onClick={scrollToContent}
                            className="text-white/75 hover:text-white text-xs sm:text-sm font-semibold uppercase tracking-[0.16em] transition-colors underline underline-offset-6 decoration-white/30 hover:decoration-white cursor-pointer py-2 px-1"
                        >
                            EXPLORE ZEYNIX
                        </button>
                    </div>
                </div>

                {/* Bottom Editorial Bar */}
                <div className="w-full flex items-center justify-between pt-2.5 sm:pt-3 border-t border-white/10 text-[9px] sm:text-[10px] font-mono uppercase tracking-[0.2em] text-white/45">
                    <span>ZEYNIX STUDIO // INDIA</span>

                    <button
                        onClick={scrollToContent}
                        className="hover:text-white transition-colors cursor-pointer flex items-center gap-1.5"
                        aria-label="Scroll to discover collection"
                    >
                        <span>SCROLL</span>
                        <span>↓</span>
                    </button>
                </div>
            </div>
        </section>
    );
}
