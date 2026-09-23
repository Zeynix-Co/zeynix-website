'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
    ChevronLeft, 
    ChevronRight, 
    ArrowRight, 
    Sparkles, 
    Flame, 
    ShieldCheck, 
    Zap, 
    Star, 
    Layers,
    ArrowUpRight
} from 'lucide-react';

interface HeroSlide {
    id: string;
    dropCode: string;
    badge: string;
    fitTag: string;
    titlePart1: string;
    titleHighlight: string;
    subtitle: string;
    tagline: string;
    link: string;
    buttonText: string;
    image: string;
    price: string;
    edition: string;
    moodGlow: string;
    stat1Label: string;
    stat1Value: string;
    stat2Label: string;
    stat2Value: string;
    stat3Label: string;
    stat3Value: string;
}

const heroSlides: HeroSlide[] = [
    {
        id: 'downers-at-dusk',
        dropCode: 'DROP 01 // NOCTURNE',
        badge: 'SIGNATURE ATELIER DROP',
        fitTag: 'OVERSIZED 240 GSM',
        titlePart1: 'WEAR THE',
        titleHighlight: 'LUXURY.',
        subtitle: 'Engineered heavyweight 240 GSM organic French terry cotton with a relaxed drop-shoulder drape that holds its structured silhouette all day.',
        tagline: 'Downers At Dusk • Signature Graphic Edition',
        link: '/products',
        buttonText: 'SHOP THE DROP',
        image: '/images/hero/downers-at-dusk-tee.png',
        price: '₹1,499',
        edition: '1 OF 500 PIECES',
        moodGlow: 'rgba(212, 175, 55, 0.28)',
        stat1Label: 'Weight',
        stat1Value: '240 GSM',
        stat2Label: 'Silhouette',
        stat2Value: 'Drop-Shoulder',
        stat3Label: 'Treatment',
        stat3Value: 'Pre-Shrunk'
    },
    {
        id: 'snake-graphic',
        dropCode: 'DROP 02 // VIPER',
        badge: 'ATELIER PRINT SERIES',
        fitTag: 'CRACK-RESISTANT',
        titlePart1: 'STREETWEAR',
        titleHighlight: 'ELEVATED.',
        subtitle: 'High-density screen prints on breathable combed cotton with reinforced ribbed neckline and zero-shrink tailored seams.',
        tagline: 'Snakes Don\'t Hiss • High-Density Series',
        link: '/products/casual',
        buttonText: 'EXPLORE COLLECTION',
        image: '/images/hero/snake-graphic-tee.png',
        price: '₹1,599',
        edition: '1 OF 350 PIECES',
        moodGlow: 'rgba(239, 68, 68, 0.22)',
        stat1Label: 'Print Craft',
        stat1Value: 'High-Density',
        stat2Label: 'Cotton',
        stat2Value: '100% Combed',
        stat3Label: 'Collar',
        stat3Value: 'Reinforced Rib'
    },
    {
        id: 'guman-lavender',
        dropCode: 'DROP 03 // AURA',
        badge: 'EXPRESS DISPATCH',
        fitTag: 'PASTEL LUXE',
        titlePart1: 'PERFECT FIT.',
        titleHighlight: 'BUILT TO LAST.',
        subtitle: 'Soft-washed pastel heavyweight fabric with zero sheer. Double-needle flatlock hems ensure everyday luxury with zero compromise.',
        tagline: 'Guman Lavender • Soft-Washed Pastel Fit',
        link: '/products',
        buttonText: 'VIEW PASTEL FITS',
        image: '/images/hero/guman-lavender-tee.png',
        price: '₹1,499',
        edition: '1 OF 400 PIECES',
        moodGlow: 'rgba(168, 85, 247, 0.25)',
        stat1Label: 'Fabric Wash',
        stat1Value: 'Bio-Washed',
        stat2Label: 'Finish',
        stat2Value: 'Zero Sheer',
        stat3Label: 'Dispatch',
        stat3Value: '30 Minutes'
    }
];

export default function HeroSection() {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [isHovered, setIsHovered] = useState(false);
    const [progressKey, setProgressKey] = useState(0);
    const [touchStartX, setTouchStartX] = useState<number | null>(null);
    const timerRef = useRef<NodeJS.Timeout | null>(null);

    const nextSlide = useCallback(() => {
        setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
        setProgressKey((k) => k + 1);
    }, []);

    const prevSlide = useCallback(() => {
        setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);
        setProgressKey((k) => k + 1);
    }, []);

    const goToSlide = useCallback((index: number) => {
        setCurrentSlide(index);
        setProgressKey((k) => k + 1);
    }, []);

    // 6-second auto-advance timer, pauses gracefully when user hovers or interacts
    useEffect(() => {
        if (isHovered) return;

        timerRef.current = setInterval(() => {
            nextSlide();
        }, 6000);

        return () => {
            if (timerRef.current) clearInterval(timerRef.current);
        };
    }, [isHovered, nextSlide]);

    // Touch gesture handlers for mobile swipe
    const handleTouchStart = (e: React.TouchEvent) => {
        setTouchStartX(e.touches[0].clientX);
    };

    const handleTouchEnd = (e: React.TouchEvent) => {
        if (touchStartX === null) return;
        const touchEndX = e.changedTouches[0].clientX;
        const diff = touchStartX - touchEndX;

        if (diff > 45) {
            nextSlide();
        } else if (diff < -45) {
            prevSlide();
        }
        setTouchStartX(null);
    };

    const activeSlide = heroSlides[currentSlide];

    return (
        <section 
            className="relative w-full bg-[#FAF6F0] text-[#070F2B] pt-4 pb-8 sm:pt-6 sm:pb-12 lg:pt-10 lg:pb-16 px-4 sm:px-6 md:px-10 xl:px-16 overflow-hidden border-b border-[#070F2B]/8 select-none"
            aria-label="Zeynix Editorial Streetwear Hero"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {/* Custom Keyframe Animations */}
            <style dangerouslySetInnerHTML={{__html: `
                @keyframes hero-progress {
                    from { width: 0%; }
                    to { width: 100%; }
                }
                @keyframes hero-shimmer {
                    0% { transform: translateX(-150%) skewX(-20deg); opacity: 0; }
                    40% { opacity: 0.6; }
                    100% { transform: translateX(250%) skewX(-20deg); opacity: 0; }
                }
                @keyframes float-slow {
                    0%, 100% { transform: translateY(0px) rotate(0deg); }
                    50% { transform: translateY(-7px) rotate(0.5deg); }
                }
                @keyframes float-reverse {
                    0%, 100% { transform: translateY(0px) rotate(0deg); }
                    50% { transform: translateY(6px) rotate(-0.5deg); }
                }
                @keyframes pulse-glow {
                    0%, 100% { opacity: 0.45; transform: scale(1); }
                    50% { opacity: 0.85; transform: scale(1.08); }
                }
                @keyframes marquee-scroll {
                    0% { transform: translateX(0%); }
                    100% { transform: translateX(-50%); }
                }
                .animate-float-slow {
                    animation: float-slow 4.5s ease-in-out infinite;
                }
                .animate-float-reverse {
                    animation: float-reverse 5s ease-in-out infinite;
                }
                .animate-pulse-glow {
                    animation: pulse-glow 4s ease-in-out infinite;
                }
                .animate-marquee {
                    animation: marquee-scroll 32s linear infinite;
                }
            `}} />

            {/* 1. Kinetic Streetwear Runway Marquee (Subtle luxury watermark behind everything) */}
            <div className="absolute top-2 left-0 right-0 overflow-hidden pointer-events-none opacity-[0.06] select-none whitespace-nowrap z-0">
                <div className="inline-block animate-marquee font-black text-6xl sm:text-7xl lg:text-8xl tracking-widest uppercase text-[#070F2B]">
                    ZEYNIX ATELIER • LUXURY STREETWEAR • 240 GSM FRENCH TERRY • DROP SS25 • BESPOKE TAILORING • ZEYNIX ATELIER • LUXURY STREETWEAR • 240 GSM FRENCH TERRY • DROP SS25 • BESPOKE TAILORING •&nbsp;
                </div>
            </div>

            {/* 2. Ambient Dynamic Background Gradients */}
            <div 
                className="absolute inset-0 pointer-events-none transition-all duration-1000 z-0"
                style={{
                    backgroundImage: `
                        radial-gradient(circle at 75% 45%, ${activeSlide.moodGlow} 0%, transparent 55%),
                        radial-gradient(circle at 15% 20%, rgba(181, 148, 91, 0.12) 0%, transparent 40%),
                        linear-gradient(to right, rgba(181, 148, 91, 0.04) 1px, transparent 1px),
                        linear-gradient(to bottom, rgba(181, 148, 91, 0.04) 1px, transparent 1px)
                    `,
                    backgroundSize: '100% 100%, 100% 100%, 48px 48px, 48px 48px'
                }}
            />

            <div className="container mx-auto max-w-6xl relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
                    
                    {/* LEFT COLUMN: Editorial Streetwear Typography & High-Conversion Action Bar */}
                    <div className="lg:col-span-6 relative min-h-[360px] sm:min-h-[400px] flex flex-col justify-center text-left order-2 lg:order-1">
                        
                        {heroSlides.map((slide, index) => {
                            const isActive = currentSlide === index;
                            return (
                                <div
                                    key={slide.id}
                                    className={`w-full transition-all duration-600 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                                        isActive 
                                            ? 'opacity-100 translate-y-0 scale-100 pointer-events-auto z-10 relative' 
                                            : 'opacity-0 translate-y-5 scale-[0.97] pointer-events-none absolute inset-0 flex flex-col justify-center z-0'
                                    }`}
                                >
                                    {/* 1. Dynamic Drop Identifier & Status Tag */}
                                    <div className="flex flex-wrap items-center gap-2 mb-3 sm:mb-4">
                                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/95 backdrop-blur-md border border-[#070F2B]/12 shadow-xs">
                                            <span className="w-2 h-2 rounded-full bg-[#B5945B] animate-pulse" />
                                            <span className="text-[10px] sm:text-[11px] font-black uppercase tracking-wider text-[#070F2B]">
                                                {slide.dropCode}
                                            </span>
                                            <span className="text-[#070F2B]/20">•</span>
                                            <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-[#B5945B]">
                                                {slide.fitTag}
                                            </span>
                                        </div>

                                        <div className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#070F2B]/5 border border-[#070F2B]/8 text-[10px] font-bold tracking-wider uppercase text-[#070F2B]/80">
                                            <Sparkles className="w-3 h-3 text-[#B5945B]" />
                                            <span>{slide.edition}</span>
                                        </div>
                                    </div>

                                    {/* 2. Bold Streetwear Editorial Headline */}
                                    <h1 className="text-3xl xs:text-4xl sm:text-5xl lg:text-[56px] font-black tracking-tight leading-[1.05] uppercase text-[#070F2B]">
                                        {slide.titlePart1}{' '}
                                        <span className="relative inline-block">
                                            <span className="bg-gradient-to-r from-[#B5945B] via-[#D4AF37] to-[#8C6D37] bg-clip-text text-transparent">
                                                {slide.titleHighlight}
                                            </span>
                                            {/* Micro underline spark */}
                                            <span className="absolute -bottom-1 left-0 right-0 h-[3px] bg-gradient-to-r from-[#B5945B] via-[#D4AF37] to-transparent rounded-full opacity-70" />
                                        </span>
                                    </h1>

                                    {/* 3. Drop Narrative Description */}
                                    <p className="mt-3.5 sm:mt-4 text-xs sm:text-sm md:text-[15px] text-[#070F2B]/85 font-medium leading-relaxed max-w-lg">
                                        {slide.subtitle}
                                    </p>

                                    {/* 4. Luxury Action Buttons */}
                                    <div className="mt-6 sm:mt-7 flex flex-wrap items-center gap-3 sm:gap-4">
                                        <Link 
                                            href={slide.link}
                                            className="relative overflow-hidden bg-[#070F2B] text-white py-3.5 px-7 sm:py-4 sm:px-8 rounded-xl font-black uppercase tracking-wider text-xs shadow-lg hover:shadow-[0_12px_28px_rgba(7,15,43,0.28)] hover:bg-[#B5945B] hover:text-[#070F2B] transition-all duration-300 inline-flex items-center gap-2.5 group cursor-pointer active:scale-[0.98]"
                                        >
                                            {/* Button Light Sweep */}
                                            <div 
                                                className="absolute inset-0 w-1/2 h-full bg-gradient-to-r from-transparent via-white/25 to-transparent pointer-events-none"
                                                style={{ animation: 'hero-shimmer 2.5s infinite ease-in-out' }}
                                            />
                                            <span className="relative z-10">{slide.buttonText}</span>
                                            <ArrowRight className="w-4 h-4 text-[#FFCB05] group-hover:text-[#070F2B] group-hover:translate-x-1.5 transition-transform duration-300 relative z-10" />
                                        </Link>

                                        <Link
                                            href="/products"
                                            className="bg-white/80 hover:bg-white text-[#070F2B] py-3.5 px-5 sm:py-4 sm:px-6 rounded-xl font-bold uppercase tracking-wider text-xs border border-[#070F2B]/12 shadow-xs hover:border-[#B5945B] hover:shadow-md transition-all duration-300 inline-flex items-center gap-2 group cursor-pointer active:scale-[0.98]"
                                        >
                                            <span>Explore All Drops</span>
                                            <ArrowUpRight className="w-3.5 h-3.5 text-[#B5945B] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                                        </Link>
                                    </div>

                                    {/* 5. Precision Streetwear Specs Matrix */}
                                    <div className="mt-6 pt-5 border-t border-[#070F2B]/10 grid grid-cols-3 gap-2.5 sm:gap-3 max-w-lg">
                                        <div className="bg-white/90 backdrop-blur-md rounded-xl p-3 border border-[#070F2B]/8 shadow-xs hover:shadow-md hover:border-[#B5945B]/40 transition-all duration-300 group/spec">
                                            <div className="flex items-center justify-between">
                                                <span className="text-[9px] sm:text-[10px] text-[#B5945B] font-extrabold uppercase tracking-wider">
                                                    {slide.stat1Label}
                                                </span>
                                                <Layers className="w-3 h-3 text-[#B5945B]/60 group-hover/spec:scale-110 transition-transform" />
                                            </div>
                                            <span className="text-xs sm:text-[13px] font-black text-[#070F2B] block mt-1">
                                                {slide.stat1Value}
                                            </span>
                                        </div>

                                        <div className="bg-white/90 backdrop-blur-md rounded-xl p-3 border border-[#070F2B]/8 shadow-xs hover:shadow-md hover:border-[#B5945B]/40 transition-all duration-300 group/spec">
                                            <div className="flex items-center justify-between">
                                                <span className="text-[9px] sm:text-[10px] text-[#B5945B] font-extrabold uppercase tracking-wider">
                                                    {slide.stat2Label}
                                                </span>
                                                <Zap className="w-3 h-3 text-[#B5945B]/60 group-hover/spec:scale-110 transition-transform" />
                                            </div>
                                            <span className="text-xs sm:text-[13px] font-black text-[#070F2B] block mt-1">
                                                {slide.stat2Value}
                                            </span>
                                        </div>

                                        <div className="bg-white/90 backdrop-blur-md rounded-xl p-3 border border-[#070F2B]/8 shadow-xs hover:shadow-md hover:border-[#B5945B]/40 transition-all duration-300 group/spec">
                                            <div className="flex items-center justify-between">
                                                <span className="text-[9px] sm:text-[10px] text-[#B5945B] font-extrabold uppercase tracking-wider">
                                                    {slide.stat3Label}
                                                </span>
                                                <ShieldCheck className="w-3 h-3 text-[#B5945B]/60 group-hover/spec:scale-110 transition-transform" />
                                            </div>
                                            <span className="text-xs sm:text-[13px] font-black text-[#070F2B] block mt-1">
                                                {slide.stat3Value}
                                            </span>
                                        </div>
                                    </div>

                                    {/* 6. Quick Streetwear Proof Row */}
                                    <div className="mt-4 flex flex-wrap items-center gap-3 sm:gap-4 text-[10px] sm:text-[11px] font-semibold text-[#070F2B]/70">
                                        <div className="flex items-center gap-1">
                                            <div className="flex text-[#D4AF37]">
                                                {[...Array(5)].map((_, i) => (
                                                    <Star key={i} className="w-3 h-3 fill-current" />
                                                ))}
                                            </div>
                                            <span className="font-extrabold text-[#070F2B] ml-1">4.9/5</span>
                                            <span>(2.4k+ Verified Fits)</span>
                                        </div>
                                        <span className="text-[#070F2B]/30">•</span>
                                        <div className="flex items-center gap-1 text-[#070F2B] font-bold">
                                            <Zap className="w-3 h-3 text-[#B5945B]" />
                                            <span>30-Min Rapid Dispatch</span>
                                        </div>
                                    </div>

                                </div>
                            );
                        })}
                    </div>

                    {/* RIGHT COLUMN: Elevated Streetwear Model Stage with Floating Interactive Badges */}
                    <div 
                        className="lg:col-span-6 relative w-full flex flex-col items-center justify-center order-1 lg:order-2"
                        onTouchStart={handleTouchStart}
                        onTouchEnd={handleTouchEnd}
                    >
                        {/* Dynamic Radial Mood Spotlight behind the model frame */}
                        <div 
                            className="absolute -inset-4 sm:-inset-8 rounded-full blur-2xl transition-all duration-1000 pointer-events-none animate-pulse-glow z-0"
                            style={{
                                backgroundImage: `radial-gradient(circle, ${activeSlide.moodGlow} 0%, transparent 70%)`
                            }}
                        />

                        {/* Main Visual Frame with Architectural Streetwear Border */}
                        <div className="relative w-full aspect-[16/10] sm:aspect-[16/9] lg:aspect-[16/11] max-w-[620px] rounded-3xl overflow-hidden shadow-[0_25px_60px_-15px_rgba(7,15,43,0.22)] border-2 border-white/60 bg-gradient-to-b from-white via-white/95 to-[#FAF6F0] z-10 group">
                            
                            {/* Ambient Light Sweep on slide transition */}
                            <div 
                                key={`shimmer-${progressKey}`}
                                className="absolute inset-0 w-[60%] h-full bg-gradient-to-r from-transparent via-white/40 to-transparent pointer-events-none z-30"
                                style={{ animation: 'hero-shimmer 900ms cubic-bezier(0.25, 1, 0.5, 1) forwards' }}
                            />

                            {/* Slides Image Carousel */}
                            {heroSlides.map((slide, index) => {
                                const isActive = currentSlide === index;
                                return (
                                    <div
                                        key={slide.id}
                                        className={`absolute inset-0 transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                                            isActive 
                                                ? 'opacity-100 scale-100 pointer-events-auto z-10' 
                                                : 'opacity-0 scale-[1.04] pointer-events-none z-0'
                                        }`}
                                    >
                                        <Image
                                            src={slide.image}
                                            alt={`Zeynix Model wearing ${slide.tagline}`}
                                            fill
                                            priority={index === 0}
                                            sizes="(max-width: 640px) 95vw, (max-width: 1024px) 90vw, 650px"
                                            className="object-cover object-center select-none transition-transform duration-1000 group-hover:scale-[1.03]"
                                        />
                                        
                                        {/* Subtle atmospheric vignette over the photo corners for cinematic depth */}
                                        <div className="absolute inset-0 bg-gradient-to-t from-[#070F2B]/40 via-transparent to-[#070F2B]/15 pointer-events-none" />
                                    </div>
                                );
                            })}

                            {/* FLOATING BADGE 1: Top Left - Floating Fabric Quality Tag */}
                            <div className="absolute top-3.5 left-3.5 sm:top-5 sm:left-5 z-25 animate-float-slow">
                                <div className="bg-[#070F2B]/90 backdrop-blur-md text-white py-1.5 px-3 sm:py-2 sm:px-3.5 rounded-full border border-white/20 shadow-lg flex items-center gap-2">
                                    <span className="w-1.5 h-1.5 rounded-full bg-[#FFCB05] animate-ping" />
                                    <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-wider text-white">
                                        ✦ 240 GSM FRENCH TERRY
                                    </span>
                                </div>
                            </div>

                            {/* FLOATING BADGE 2: Top Right - Drop Edition Badge */}
                            <div className="absolute top-3.5 right-3.5 sm:top-5 sm:right-5 z-25 animate-float-reverse">
                                <div className="bg-white/90 backdrop-blur-md text-[#070F2B] py-1.5 px-3 rounded-full border border-[#070F2B]/10 shadow-lg flex items-center gap-1.5">
                                    <Flame className="w-3 h-3 text-[#B5945B]" />
                                    <span className="text-[9px] sm:text-[10px] font-extrabold uppercase tracking-wider">
                                        {activeSlide.edition}
                                    </span>
                                </div>
                            </div>

                            {/* FLOATING CARD 3: Bottom Left - Live Drop Price & Dispatch Pill */}
                            <div className="absolute bottom-3.5 left-3.5 sm:bottom-5 sm:left-5 z-25 max-w-[210px] sm:max-w-[240px]">
                                <div className="bg-[#070F2B]/92 backdrop-blur-md text-white p-2 sm:p-2.5 rounded-2xl border border-white/15 shadow-xl flex items-center gap-2.5">
                                    <div className="w-8 h-8 rounded-xl bg-[#B5945B]/20 border border-[#B5945B]/40 flex items-center justify-center shrink-0 text-[#FFCB05] font-black text-xs">
                                        ⚡
                                    </div>
                                    <div className="min-w-0">
                                        <div className="flex items-center gap-1.5">
                                            <span className="text-xs sm:text-sm font-black text-white">{activeSlide.price}</span>
                                            <span className="text-[8px] sm:text-[9px] font-bold text-[#FFCB05] uppercase tracking-wider">FREE DISPATCH</span>
                                        </div>
                                        <p className="text-[8px] sm:text-[9px] text-white/70 truncate font-medium">Delivered in 30 Mins in Select Areas</p>
                                    </div>
                                </div>
                            </div>

                            {/* Top Progress & Slide Controls */}
                            <div className="absolute bottom-3.5 right-3.5 sm:bottom-5 sm:right-5 z-25 flex items-center gap-1.5 bg-[#070F2B]/90 backdrop-blur-md text-white py-1 px-2.5 sm:py-1.5 sm:px-3 rounded-full border border-white/20 shadow-lg">
                                <span className="text-[10px] sm:text-[11px] font-extrabold text-white/90 tracking-widest pl-1">
                                    0{currentSlide + 1} / 0{heroSlides.length}
                                </span>
                                <div className="flex items-center gap-0.5 ml-1 border-l border-white/20 pl-1.5">
                                    <button 
                                        onClick={(e) => {
                                            e.preventDefault();
                                            e.stopPropagation();
                                            prevSlide();
                                        }}
                                        className="p-1 hover:text-[#FFCB05] text-white/90 transition-colors cursor-pointer active:scale-90"
                                        aria-label="Previous Drop"
                                    >
                                        <ChevronLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                                    </button>
                                    <button 
                                        onClick={(e) => {
                                            e.preventDefault();
                                            e.stopPropagation();
                                            nextSlide();
                                        }}
                                        className="p-1 hover:text-[#FFCB05] text-white/90 transition-colors cursor-pointer active:scale-90"
                                        aria-label="Next Drop"
                                    >
                                        <ChevronRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                                    </button>
                                </div>
                            </div>

                        </div>

                        {/* INTERACTIVE DROP SWITCHER DOCK (Direct Thumbnail Navigation) */}
                        <div className="w-full max-w-[620px] mt-3 sm:mt-4 grid grid-cols-3 gap-2 sm:gap-3 z-15">
                            {heroSlides.map((slide, idx) => {
                                const isCurrent = currentSlide === idx;
                                return (
                                    <button
                                        key={slide.id}
                                        onClick={() => goToSlide(idx)}
                                        className={`group relative flex items-center gap-2 p-1.5 sm:p-2 rounded-xl transition-all duration-300 text-left cursor-pointer border ${
                                            isCurrent 
                                                ? 'bg-white shadow-md border-[#B5945B] ring-2 ring-[#B5945B]/20' 
                                                : 'bg-white/60 hover:bg-white/90 border-[#070F2B]/10 hover:border-[#070F2B]/20'
                                        }`}
                                    >
                                        {/* Thumbnail Box */}
                                        <div className="relative w-8 h-8 sm:w-10 sm:h-10 rounded-lg overflow-hidden shrink-0 bg-white border border-[#070F2B]/10">
                                            <Image 
                                                src={slide.image} 
                                                alt={slide.tagline} 
                                                fill 
                                                className="object-cover" 
                                            />
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <span className={`text-[8px] sm:text-[9px] font-extrabold uppercase tracking-wider block ${
                                                isCurrent ? 'text-[#B5945B]' : 'text-[#070F2B]/60'
                                            }`}>
                                                {slide.dropCode.split(' // ')[0]}
                                            </span>
                                            <span className="text-[10px] sm:text-xs font-black text-[#070F2B] truncate block">
                                                {slide.id === 'downers-at-dusk' ? 'Downers' : slide.id === 'snake-graphic' ? 'Snake Print' : 'Lavender'}
                                            </span>
                                        </div>

                                        {/* Slide Progress indicator bar inside active thumbnail */}
                                        {isCurrent && (
                                            <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#FAF6F0] rounded-b-xl overflow-hidden">
                                                <div 
                                                    key={progressKey}
                                                    className="h-full bg-gradient-to-r from-[#B5945B] to-[#FFCB05]"
                                                    style={{
                                                        animation: 'hero-progress 6000ms linear forwards',
                                                        animationPlayState: isHovered ? 'paused' : 'running'
                                                    }}
                                                />
                                            </div>
                                        )}
                                    </button>
                                );
                            })}
                        </div>

                    </div>

                </div>
            </div>
        </section>
    );
}
