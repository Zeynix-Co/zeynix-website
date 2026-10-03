'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { X, Sparkles, ArrowRight, ShieldCheck, Flame, Calendar, Clock } from 'lucide-react';

interface TimeLeft {
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
}

export default function LaunchAnnouncementModal() {
    const [isOpen, setIsOpen] = useState(false);
    const [isFloatingVisible, setIsFloatingVisible] = useState(false);

    // Calculate time remaining until October 13th
    const calculateTimeLeft = (): TimeLeft => {
        // Target: October 13, 2026 00:00:00 IST
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

    // Countdown interval
    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft(calculateTimeLeft());
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    // Initial popup trigger after slight delay
    useEffect(() => {
        const hasDismissed = sessionStorage.getItem('zeynix_launch_modal_dismissed');

        // Show popup automatically after 700ms if not dismissed in current session
        const initialDelay = setTimeout(() => {
            if (!hasDismissed) {
                setIsOpen(true);
            } else {
                setIsFloatingVisible(true);
            }
        }, 700);

        return () => clearTimeout(initialDelay);
    }, []);

    // Handle ESC key & body overflow
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && isOpen) {
                handleClose();
            }
        };

        if (isOpen) {
            document.addEventListener('keydown', handleKeyDown);
            document.body.style.overflow = 'hidden';
        }

        return () => {
            document.removeEventListener('keydown', handleKeyDown);
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    const handleClose = () => {
        setIsOpen(false);
        setIsFloatingVisible(true);
        sessionStorage.setItem('zeynix_launch_modal_dismissed', 'true');
    };

    const handleOpen = () => {
        setIsOpen(true);
        setIsFloatingVisible(false);
    };

    const handlePreOrderClick = () => {
        setIsOpen(false);
        setIsFloatingVisible(true);
        sessionStorage.setItem('zeynix_launch_modal_dismissed', 'true');

        // Smooth scroll to products section if on home, or navigate
        const productsSection = document.getElementById('products-section') || document.querySelector('section:nth-of-type(2)');
        if (productsSection) {
            productsSection.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <>
            {/* 1. MAIN POPUP MODAL */}
            {isOpen && (
                <div 
                    className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 overflow-y-auto"
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="launch-modal-title"
                >
                    {/* Dark Glassmorphic Backdrop with Fade-In */}
                    <div 
                        className="fixed inset-0 bg-[#040817]/80 backdrop-blur-md transition-opacity duration-300 animate-fadeIn"
                        onClick={handleClose}
                    />

                    {/* Pop-up Card Container with Glow & Scale-In Animation */}
                    <div 
                        className="relative w-full max-w-lg my-auto bg-gradient-to-b from-[#0F172A] via-[#070F2B] to-[#030717] text-white rounded-2xl sm:rounded-3xl shadow-[0_0_60px_rgba(212,175,55,0.25)] border border-[#B5945B]/40 overflow-hidden transform transition-all duration-300 animate-modalScale"
                    >
                        {/* Ambient Top Golden Radial Aura */}
                        <div className="absolute top-0 inset-x-0 h-48 bg-gradient-to-b from-[#D4AF37]/15 via-[#B5945B]/5 to-transparent pointer-events-none" />
                        <div className="absolute -top-12 -right-12 w-44 h-44 rounded-full bg-[#FFCB05]/10 blur-3xl pointer-events-none" />
                        <div className="absolute -bottom-12 -left-12 w-44 h-44 rounded-full bg-[#00274C]/60 blur-3xl pointer-events-none" />

                        {/* Top Accent Ribbon */}
                        <div className="h-1 w-full bg-gradient-to-r from-transparent via-[#FFCB05] to-transparent opacity-80" />

                        {/* Close Button */}
                        <button
                            onClick={handleClose}
                            aria-label="Close Announcement"
                            className="absolute top-3.5 right-3.5 sm:top-5 sm:right-5 z-20 w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center rounded-full bg-white/5 hover:bg-white/15 text-white/70 hover:text-white border border-white/10 hover:border-[#B5945B]/50 transition-all duration-200 cursor-pointer group"
                        >
                            <X className="w-4 h-4 sm:w-4.5 sm:h-4.5 transition-transform duration-200 group-hover:rotate-90" />
                        </button>

                        {/* Modal Body */}
                        <div className="relative z-10 px-5 sm:px-8 pt-6 sm:pt-8 pb-6 sm:pb-8 flex flex-col items-center text-center">
                            
                            {/* Live Badge */}
                            <div className="inline-flex items-center gap-2 px-3 py-1 sm:px-3.5 sm:py-1.5 rounded-full bg-[#FFCB05]/10 border border-[#FFCB05]/30 text-[#FFCB05] text-[10px] sm:text-xs font-mono uppercase tracking-[0.2em] mb-4 shadow-[0_0_15px_rgba(255,203,5,0.15)] animate-pulse">
                                <span className="w-1.5 h-1.5 rounded-full bg-[#FFCB05] animate-ping" />
                                <span>OFFICIAL DROP // 13TH OCTOBER</span>
                            </div>

                            {/* Brand Tagline */}
                            <p className="text-[11px] sm:text-xs font-mono uppercase tracking-[0.3em] text-[#FCF8DD]/60 mb-1">
                                ZEYNIX ATELIER • WORLDWIDE RELEASE
                            </p>

                            {/* Main Headline */}
                            <h2 
                                id="launch-modal-title"
                                className="font-black uppercase tracking-tight text-2xl xs:text-3xl sm:text-4xl text-white leading-[1.08] mb-2 drop-shadow-[0_2px_15px_rgba(0,0,0,0.8)]"
                            >
                                LAUNCHING ON <br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FFCB05] via-[#FCF8DD] to-[#E5C06E] underline decoration-[#FFCB05]/40 decoration-2 underline-offset-4">
                                    13TH OCTOBER
                                </span>
                            </h2>

                            {/* Subtitle */}
                            <p className="text-xs sm:text-sm text-white/80 max-w-sm font-normal leading-relaxed mb-5 sm:mb-6">
                                The official website goes live on <span className="text-white font-semibold">October 13th</span>. 
                                Secure your exclusive heavyweight fits early with VIP priority shipping.
                            </p>

                            {/* Countdown Timer Block */}
                            <div className="w-full bg-[#070F2B]/90 border border-[#B5945B]/30 rounded-xl p-3 sm:p-4 mb-5 sm:mb-6 shadow-inner backdrop-blur-sm">
                                <div className="text-[10px] sm:text-[11px] font-mono uppercase tracking-[0.2em] text-[#FCF8DD]/60 mb-2 flex items-center justify-center gap-1.5">
                                    <Clock className="w-3.5 h-3.5 text-[#FFCB05]" />
                                    <span>COUNTDOWN TO OFFICIAL LAUNCH</span>
                                </div>

                                <div className="grid grid-cols-4 gap-2 sm:gap-3">
                                    {/* Days */}
                                    <div className="flex flex-col items-center justify-center p-2 sm:p-2.5 rounded-lg bg-black/40 border border-white/5 shadow-md">
                                        <span className="font-mono font-bold text-xl sm:text-2xl text-[#FFCB05] tracking-tight">
                                            {String(timeLeft.days).padStart(2, '0')}
                                        </span>
                                        <span className="text-[9px] sm:text-[10px] font-mono text-white/50 tracking-widest uppercase mt-0.5">
                                            DAYS
                                        </span>
                                    </div>

                                    {/* Hours */}
                                    <div className="flex flex-col items-center justify-center p-2 sm:p-2.5 rounded-lg bg-black/40 border border-white/5 shadow-md">
                                        <span className="font-mono font-bold text-xl sm:text-2xl text-white tracking-tight">
                                            {String(timeLeft.hours).padStart(2, '0')}
                                        </span>
                                        <span className="text-[9px] sm:text-[10px] font-mono text-white/50 tracking-widest uppercase mt-0.5">
                                            HOURS
                                        </span>
                                    </div>

                                    {/* Mins */}
                                    <div className="flex flex-col items-center justify-center p-2 sm:p-2.5 rounded-lg bg-black/40 border border-white/5 shadow-md">
                                        <span className="font-mono font-bold text-xl sm:text-2xl text-white tracking-tight">
                                            {String(timeLeft.minutes).padStart(2, '0')}
                                        </span>
                                        <span className="text-[9px] sm:text-[10px] font-mono text-white/50 tracking-widest uppercase mt-0.5">
                                            MINS
                                        </span>
                                    </div>

                                    {/* Secs */}
                                    <div className="flex flex-col items-center justify-center p-2 sm:p-2.5 rounded-lg bg-black/40 border border-white/5 shadow-md">
                                        <span className="font-mono font-bold text-xl sm:text-2xl text-[#FFCB05] tracking-tight">
                                            {String(timeLeft.seconds).padStart(2, '0')}
                                        </span>
                                        <span className="text-[9px] sm:text-[10px] font-mono text-white/50 tracking-widest uppercase mt-0.5">
                                            SECS
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Perks Checklist */}
                            <div className="w-full grid grid-cols-1 xs:grid-cols-2 gap-2 text-left mb-6 text-[11px] sm:text-xs text-white/75">
                                <div className="flex items-center gap-2 bg-white/[0.03] px-2.5 py-1.5 rounded-lg border border-white/5">
                                    <Flame className="w-3.5 h-3.5 text-[#FFCB05] flex-shrink-0" />
                                    <span>First 100 Fits: Priority Dispatch</span>
                                </div>
                                <div className="flex items-center gap-2 bg-white/[0.03] px-2.5 py-1.5 rounded-lg border border-white/5">
                                    <Sparkles className="w-3.5 h-3.5 text-[#FFCB05] flex-shrink-0" />
                                    <span>Exclusive Luxury Box Unboxing</span>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="w-full space-y-2.5">
                                {/* Primary Pre-Order CTA */}
                                <Link
                                    href="/products"
                                    onClick={handlePreOrderClick}
                                    className="group relative w-full inline-flex items-center justify-center gap-2.5 bg-gradient-to-r from-[#FFCB05] via-[#FFE279] to-[#FFCB05] text-[#070F2B] font-bold text-xs sm:text-sm uppercase tracking-[0.18em] py-3.5 sm:py-4 px-6 rounded-xl transition-all duration-300 shadow-[0_4px_25px_rgba(255,203,5,0.35)] hover:shadow-[0_6px_35px_rgba(255,203,5,0.5)] active:scale-[0.98] overflow-hidden"
                                >
                                    {/* Shimmer sweep effect */}
                                    <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/40 to-transparent pointer-events-none" />
                                    <span>PRE-ORDER NOW</span>
                                    <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
                                </Link>

                                {/* Secondary Action */}
                                <button
                                    onClick={handleClose}
                                    className="w-full py-2.5 text-center text-xs font-mono uppercase tracking-[0.18em] text-white/50 hover:text-white/90 transition-colors duration-200 cursor-pointer"
                                >
                                    Continue to Store
                                </button>
                            </div>

                        </div>
                    </div>
                </div>
            )}

            {/* 2. RE-OPEN FLOATING PILL (Appears on bottom-right when modal is dismissed) */}
            {isFloatingVisible && !isOpen && (
                <button
                    onClick={handleOpen}
                    aria-label="View Launch Offer"
                    className="fixed bottom-5 right-5 z-40 group flex items-center gap-2.5 bg-[#070F2B]/90 hover:bg-[#070F2B] text-white border border-[#B5945B]/60 hover:border-[#FFCB05] px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-full shadow-[0_4px_25px_rgba(0,0,0,0.6)] backdrop-blur-md transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer"
                >
                    <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#FFCB05] opacity-75" />
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-[#FFCB05]" />
                    </span>
                    <span className="text-[11px] sm:text-xs font-mono uppercase tracking-widest text-[#FCF8DD] font-semibold">
                        LAUNCHING OCT 13 // PRE-ORDER
                    </span>
                    <Calendar className="w-3.5 h-3.5 text-[#FFCB05] transition-transform duration-200 group-hover:rotate-12" />
                </button>
            )}
        </>
    );
}
