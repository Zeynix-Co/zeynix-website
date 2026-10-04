'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

interface TimeLeft {
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
}

export default function LaunchBannerCard() {
    const calculateTimeLeft = (): TimeLeft => {
        const launchDate = new Date('2026-10-20T00:00:00+05:30').getTime();
        const now = new Date().getTime();
        const difference = launchDate - now;

        if (difference > 0) {
            return {
                days: Math.floor(difference / (1000 * 60 * 60 * 24)),
                hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
                minutes: Math.floor((difference / 1000 / 60) % 60),
                seconds: Math.floor((difference / 1000) % 60),
            };
        }

        return { days: 0, hours: 0, minutes: 0, seconds: 0 };
    };

    const [timeLeft, setTimeLeft] = useState<TimeLeft>(calculateTimeLeft());

    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft(calculateTimeLeft());
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    return (
        <div className="relative z-20 mt-4 sm:mt-6 mb-5 sm:mb-7 max-w-4xl mx-auto px-3 sm:px-6">
            {/* Slim, precise luxury launch strip with subtle elegant curves */}
            <div className="group relative overflow-hidden rounded-lg bg-gradient-to-r from-[#070F2B] via-[#0B1536] to-[#070F2B] text-white py-2.5 sm:py-3 px-4 sm:px-6 shadow-[0_8px_30px_rgba(7,15,43,0.25)] border border-[#B5945B]/40 hover:border-[#FFCB05]/80 transition-all duration-300">
                
                {/* Subtle top shimmer accent */}
                <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-[#FFCB05] to-transparent opacity-80" />

                <div className="relative z-10 flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4">
                    
                    {/* Left: Tag + Headline */}
                    <div className="flex items-center gap-2.5 text-center sm:text-left">
                        {/* Pulsing beacon */}
                        <span className="relative flex h-2 w-2 shrink-0">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#FFCB05] opacity-75" />
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#FFCB05]" />
                        </span>

                        <div className="flex flex-wrap items-center justify-center sm:justify-start gap-1.5 sm:gap-2">
                            <span className="text-[10px] sm:text-xs font-mono uppercase tracking-[0.25em] text-[#FFCB05] font-bold">
                                LAUNCHING 20TH OCT
                            </span>
                            <span className="hidden sm:inline text-white/30 text-xs">//</span>
                            <span className="text-xs sm:text-sm font-extrabold uppercase tracking-widest text-white">
                                PRE-ORDER NOW
                            </span>
                        </div>
                    </div>

                    {/* Middle: Compact Countdown with subtle curved box */}
                    <div className="flex items-center gap-1 sm:gap-1.5 bg-black/50 border border-white/10 px-3 py-1 text-xs font-mono rounded-md">
                        <div className="flex items-baseline gap-0.5">
                            <span className="text-[#FFCB05] font-bold text-xs sm:text-sm">{String(timeLeft.days).padStart(2, '0')}</span>
                            <span className="text-[9px] text-white/40 uppercase">d</span>
                        </div>
                        <span className="text-white/30 text-[10px]">:</span>
                        <div className="flex items-baseline gap-0.5">
                            <span className="text-white font-bold text-xs sm:text-sm">{String(timeLeft.hours).padStart(2, '0')}</span>
                            <span className="text-[9px] text-white/40 uppercase">h</span>
                        </div>
                        <span className="text-white/30 text-[10px]">:</span>
                        <div className="flex items-baseline gap-0.5">
                            <span className="text-white font-bold text-xs sm:text-sm">{String(timeLeft.minutes).padStart(2, '0')}</span>
                            <span className="text-[9px] text-white/40 uppercase">m</span>
                        </div>
                        <span className="text-white/30 text-[10px]">:</span>
                        <div className="flex items-baseline gap-0.5">
                            <span className="text-[#FFCB05] font-bold text-xs sm:text-sm">{String(timeLeft.seconds).padStart(2, '0')}</span>
                            <span className="text-[9px] text-white/40 uppercase">s</span>
                        </div>
                    </div>

                    {/* Right: Slightly curved luxury CTA Button */}
                    <Link
                        href="/products"
                        className="group/btn relative inline-flex items-center justify-center gap-2 bg-[#FAF6F0] hover:bg-white text-[#070F2B] font-bold text-[11px] sm:text-xs uppercase tracking-[0.18em] py-2 px-5 rounded-md transition-all duration-200 shadow-md active:scale-95 shrink-0 overflow-hidden cursor-pointer"
                    >
                        <div className="absolute inset-0 -translate-x-full group-hover/btn:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-[#FFCB05]/30 to-transparent pointer-events-none" />
                        <span>PRE-ORDER</span>
                        <ArrowRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover/btn:translate-x-1" />
                    </Link>

                </div>
            </div>
        </div>
    );
}
