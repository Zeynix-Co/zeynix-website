'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowRight, Flame, Sparkles, Clock, Calendar } from 'lucide-react';

interface TimeLeft {
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
}

export default function LaunchBannerCard() {
    // Calculate time remaining until October 13th
    const calculateTimeLeft = (): TimeLeft => {
        const launchDate = new Date('2026-10-13T00:00:00+05:30').getTime();
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

    const scrollToProducts = () => {
        const section = document.getElementById('products-section') || document.querySelector('section:nth-of-type(2)');
        if (section) {
            section.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <div className="relative z-20 -mt-5 sm:-mt-8 md:-mt-10 mb-6 sm:mb-10 max-w-6xl mx-auto px-3 sm:px-6">
            {/* Outer Card with ambient glow & border gradient */}
            <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#070F2B] via-[#0B1536] to-[#070F2B] text-white p-4 sm:p-6 md:p-7 shadow-[0_15px_45px_rgba(7,15,43,0.35)] border border-[#B5945B]/40 hover:border-[#FFCB05]/70 transition-all duration-500">
                
                {/* Background ambient lighting effects */}
                <div className="absolute top-0 right-1/4 w-72 h-36 bg-[#FFCB05]/10 rounded-full blur-3xl pointer-events-none group-hover:bg-[#FFCB05]/15 transition-all duration-500" />
                <div className="absolute -bottom-10 -left-10 w-48 h-48 bg-[#00274C]/80 rounded-full blur-2xl pointer-events-none" />
                
                {/* Top subtle golden shimmer accent bar */}
                <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-[#FFCB05] to-transparent opacity-80" />

                <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-5 sm:gap-6">
                    
                    {/* Left: Launch & Pre-Order Messaging */}
                    <div className="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-3.5 sm:gap-4 flex-1">
                        
                        {/* Animated Badge Icon */}
                        <div className="relative w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-gradient-to-br from-[#FFCB05]/20 to-[#B5945B]/5 border border-[#FFCB05]/40 flex items-center justify-center text-[#FFCB05] shrink-0 shadow-[0_0_20px_rgba(255,203,5,0.2)] group-hover:scale-105 transition-transform duration-300">
                            <Sparkles className="w-6 h-6 animate-pulse" />
                            <span className="absolute -top-1 -right-1 flex h-3 w-3">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#FFCB05] opacity-75" />
                                <span className="relative inline-flex rounded-full h-3 w-3 bg-[#FFCB05]" />
                            </span>
                        </div>

                        <div>
                            {/* Status tag */}
                            <div className="flex items-center justify-center sm:justify-start gap-2 mb-1">
                                <span className="text-[10px] sm:text-[11px] font-mono uppercase tracking-[0.25em] text-[#FFCB05] font-semibold">
                                    OFFICIAL LAUNCH • 13TH OCTOBER
                                </span>
                                <span className="hidden xs:inline-block px-2 py-0.5 rounded-full bg-white/10 text-white/70 text-[9px] font-mono uppercase tracking-wider">
                                    LIMITED DROP
                                </span>
                            </div>

                            {/* Headline */}
                            <h3 className="text-lg xs:text-xl sm:text-2xl font-black uppercase tracking-tight text-white leading-tight">
                                PRE-ORDER YOUR FITS TODAY
                            </h3>

                            {/* Supporting text */}
                            <p className="text-xs sm:text-sm text-white/70 mt-1 max-w-md leading-relaxed">
                                Our website officially goes live on <span className="text-white font-medium">October 13th</span>. 
                                Secure early-bird stock now with guaranteed first-batch priority dispatch.
                            </p>
                        </div>
                    </div>

                    {/* Middle: Live Compact Countdown */}
                    <div className="shrink-0 bg-black/40 border border-white/10 rounded-xl px-3 sm:px-4 py-2 sm:py-2.5 backdrop-blur-sm">
                        <div className="text-[9px] sm:text-[10px] font-mono uppercase tracking-[0.2em] text-[#FCF8DD]/60 mb-1.5 flex items-center justify-center gap-1.5">
                            <Clock className="w-3 h-3 text-[#FFCB05]" />
                            <span>LAUNCH COUNTDOWN</span>
                        </div>

                        <div className="flex items-center gap-1.5 sm:gap-2">
                            {/* Days */}
                            <div className="flex flex-col items-center min-w-[36px] sm:min-w-[42px] py-1 px-1.5 rounded-md bg-white/[0.04] border border-white/5">
                                <span className="font-mono font-bold text-base sm:text-lg text-[#FFCB05] leading-none">
                                    {String(timeLeft.days).padStart(2, '0')}
                                </span>
                                <span className="text-[8px] sm:text-[9px] font-mono text-white/40 uppercase mt-0.5">DAYS</span>
                            </div>

                            <span className="font-mono text-[#FFCB05] font-bold text-xs pb-2">:</span>

                            {/* Hours */}
                            <div className="flex flex-col items-center min-w-[36px] sm:min-w-[42px] py-1 px-1.5 rounded-md bg-white/[0.04] border border-white/5">
                                <span className="font-mono font-bold text-base sm:text-lg text-white leading-none">
                                    {String(timeLeft.hours).padStart(2, '0')}
                                </span>
                                <span className="text-[8px] sm:text-[9px] font-mono text-white/40 uppercase mt-0.5">HRS</span>
                            </div>

                            <span className="font-mono text-white/40 font-bold text-xs pb-2">:</span>

                            {/* Mins */}
                            <div className="flex flex-col items-center min-w-[36px] sm:min-w-[42px] py-1 px-1.5 rounded-md bg-white/[0.04] border border-white/5">
                                <span className="font-mono font-bold text-base sm:text-lg text-white leading-none">
                                    {String(timeLeft.minutes).padStart(2, '0')}
                                </span>
                                <span className="text-[8px] sm:text-[9px] font-mono text-white/40 uppercase mt-0.5">MIN</span>
                            </div>

                            <span className="font-mono text-white/40 font-bold text-xs pb-2">:</span>

                            {/* Secs */}
                            <div className="flex flex-col items-center min-w-[36px] sm:min-w-[42px] py-1 px-1.5 rounded-md bg-white/[0.04] border border-white/5">
                                <span className="font-mono font-bold text-base sm:text-lg text-[#FFCB05] leading-none">
                                    {String(timeLeft.seconds).padStart(2, '0')}
                                </span>
                                <span className="text-[8px] sm:text-[9px] font-mono text-white/40 uppercase mt-0.5">SEC</span>
                            </div>
                        </div>
                    </div>

                    {/* Right: Pre-Order Call to Action Button */}
                    <div className="w-full lg:w-auto shrink-0 flex items-center justify-center">
                        <Link
                            href="/products"
                            className="group/btn relative w-full lg:w-auto inline-flex items-center justify-center gap-2.5 bg-gradient-to-r from-[#FFCB05] via-[#FFE279] to-[#FFCB05] text-[#070F2B] font-bold text-xs sm:text-sm uppercase tracking-[0.16em] py-3 sm:py-3.5 px-6 sm:px-8 rounded-xl transition-all duration-300 shadow-[0_4px_20px_rgba(255,203,5,0.3)] hover:shadow-[0_6px_30px_rgba(255,203,5,0.5)] active:scale-[0.98] overflow-hidden cursor-pointer"
                        >
                            {/* Sweeping Shimmer light effect */}
                            <div className="absolute inset-0 -translate-x-full group-hover/btn:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/50 to-transparent pointer-events-none" />
                            
                            <span>PRE-ORDER NOW</span>
                            <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover/btn:translate-x-1" />
                        </Link>
                    </div>

                </div>

            </div>
        </div>
    );
}
