'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, ArrowRight, Sparkles } from 'lucide-react';

interface HeroSlide {
    id: string;
    badge: string;
    fitTag: string;
    titlePart1: string;
    titleHighlight: string;
    subtitle: string;
    tagline: string;
    link: string;
    buttonText: string;
    image: string;
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
        badge: 'SIGNATURE COLLECTION',
        fitTag: 'OVERSIZED FIT',
        titlePart1: 'WEAR THE',
        titleHighlight: 'LUXURY.',
        subtitle: 'Heavyweight 240 GSM organic cotton with an engineered drop-shoulder cut that holds its boxy drape wash after wash.',
        tagline: '240 GSM Heavyweight Edition',
        link: '/products',
        buttonText: 'SHOP THE DROP',
        image: '/images/hero/downers-at-dusk-tee.png',
        stat1Label: 'Fabric',
        stat1Value: '240 GSM',
        stat2Label: 'Silhouette',
        stat2Value: 'Drop-Shoulder',
        stat3Label: 'Quality',
        stat3Value: 'Pre-Shrunk'
    },
    {
        id: 'snake-graphic',
        badge: 'ATELIER PRINT SERIES',
        fitTag: 'CRACK-RESISTANT',
        titlePart1: 'STREETWEAR',
        titleHighlight: 'ELEVATED.',
        subtitle: 'High-density screen prints on breathable combed cotton. Engineered with reinforced ribbed collar and zero-shrink tailoring.',
        tagline: 'High-Density Graphic Series',
        link: '/products/casual',
        buttonText: 'EXPLORE COLLECTION',
        image: '/images/hero/snake-graphic-tee.png',
        stat1Label: 'Print Craft',
        stat1Value: 'High-Density',
        stat2Label: 'Material',
        stat2Value: '100% Combed',
        stat3Label: 'Neckline',
        stat3Value: 'Ribbed Crew'
    },
    {
        id: 'guman-lavender',
        badge: 'EXPRESS DISPATCH',
        fitTag: '30-MIN DELIVERY',
        titlePart1: 'PERFECT FIT.',
        titleHighlight: 'BUILT TO LAST.',
        subtitle: 'Soft-washed pastel heavyweight fabric with zero sheer. Double-needle stitched hems ensure lasting everyday luxury.',
        tagline: 'Pastel Streetwear Series',
        link: '/products',
        buttonText: 'VIEW PASTEL FITS',
        image: '/images/hero/guman-lavender-tee.png',
        stat1Label: 'Finish',
        stat1Value: 'Soft-Washed',
        stat2Label: 'Feel',
        stat2Value: 'Zero Sheer',
        stat3Label: 'Dispatch',
        stat3Value: '30 Minutes'
    }
];

export default function HeroSection() {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [isHovered, setIsHovered] = useState(false);
    const [direction, setDirection] = useState<'next' | 'prev'>('next');
    const [progressKey, setProgressKey] = useState(0);
    const [touchStartX, setTouchStartX] = useState<number | null>(null);
    const timerRef = useRef<NodeJS.Timeout | null>(null);

    const nextSlide = useCallback(() => {
        setDirection('next');
        setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
        setProgressKey((k) => k + 1);
    }, []);

    const prevSlide = useCallback(() => {
        setDirection('prev');
        setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);
        setProgressKey((k) => k + 1);
    }, []);

    const goToSlide = useCallback((index: number) => {
        setDirection(index >= currentSlide ? 'next' : 'prev');
        setCurrentSlide(index);
        setProgressKey((k) => k + 1);
    }, [currentSlide]);

    // 6s Auto-advance timer (pauses on hover)
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

        if (diff > 50) {
            nextSlide();
        } else if (diff < -50) {
            prevSlide();
        }
        setTouchStartX(null);
    };

    return (
        <section 
            className="relative w-full bg-[#FAF6F0] text-[#070F2B] pt-4 pb-8 sm:pt-6 sm:pb-10 lg:pt-8 lg:pb-14 px-4 sm:px-8 md:px-12 xl:px-20 overflow-hidden border-b border-[#070F2B]/5 select-none"
            aria-label="Zeynix Editorial Streetwear Hero"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {/* Custom keyframes for progress bar and light sweep */}
            <style dangerouslySetInnerHTML={{__html: `
                @keyframes hero-progress {
                    from { width: 0%; }
                    to { width: 100%; }
                }
                @keyframes hero-shimmer {
                    0% { transform: translateX(-120%) skewX(-20deg); opacity: 0; }
                    30% { opacity: 0.35; }
                    100% { transform: translateX(250%) skewX(-20deg); opacity: 0; }
                }
            `}} />

            {/* Ambient Background Textures */}
            <div 
                className="absolute inset-0 opacity-40 pointer-events-none z-0"
                style={{
                    backgroundImage: `
                        radial-gradient(circle at 50% 30%, transparent 20%, #FAF6F0 90%),
                        linear-gradient(to right, rgba(181, 148, 91, 0.04) 1px, transparent 1px),
                        linear-gradient(to bottom, rgba(181, 148, 91, 0.04) 1px, transparent 1px)
                    `,
                    backgroundSize: '100% 100%, 40px 40px, 40px 40px'
                }}
            />

            <div className="container mx-auto max-w-6xl relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
                    
                    {/* LEFT COLUMN: Clean, High-Contrast Editorial Typography */}
                    <div className="lg:col-span-5 relative min-h-[300px] xs:min-h-[320px] sm:min-h-[350px] md:min-h-[380px] lg:min-h-[420px] flex items-center text-left order-1">
                        {heroSlides.map((slide, index) => {
                            const isActive = currentSlide === index;
                            return (
                                <div
                                    key={slide.id}
                                    className={`w-full transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                                        isActive 
                                            ? 'opacity-100 translate-y-0 scale-100 pointer-events-auto z-10 relative' 
                                            : 'opacity-0 translate-y-4 scale-[0.98] pointer-events-none absolute inset-0 flex flex-col justify-center z-0'
                                    }`}
                                >
                                    {/* 1. Sleek Feature Tag Pill */}
                                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-[#070F2B]/10 shadow-xs mb-3 sm:mb-4">
                                        <span className="w-1.5 h-1.5 rounded-full bg-[#B5945B] animate-pulse" />
                                        <span className="text-[10px] sm:text-[11px] font-black uppercase tracking-wider text-[#070F2B]">
                                            {slide.badge}
                                        </span>
                                        <span className="text-[#070F2B]/20">•</span>
                                        <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-[#B5945B]">
                                            {slide.fitTag}
                                        </span>
                                    </div>

                                    {/* 2. Clear, Bold Headline */}
                                    <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-[54px] font-black tracking-tight leading-[1.08] uppercase text-[#070F2B]">
                                        {slide.titlePart1} <span className="text-[#B5945B]">{slide.titleHighlight}</span>
                                    </h1>

                                    {/* 3. Short, Crisp, Highly Readable Feature Description */}
                                    <p className="mt-3 sm:mt-4 text-xs sm:text-sm md:text-[15px] text-[#070F2B]/80 font-medium leading-relaxed max-w-md">
                                        {slide.subtitle}
                                    </p>

                                    {/* 4. Luxury CTA Button */}
                                    <div className="mt-5 sm:mt-6 flex flex-wrap items-center gap-3 sm:gap-4">
                                        <Link 
                                            href={slide.link}
                                            className="bg-[#070F2B] text-white py-3 px-6 sm:py-3.5 sm:px-7 rounded-xl font-black uppercase tracking-wider text-xs shadow-md hover:shadow-xl hover:bg-[#B5945B] hover:text-[#070F2B] transition-all duration-300 text-center inline-flex items-center gap-2.5 group cursor-pointer active:scale-[0.98]"
                                        >
                                            <span>{slide.buttonText}</span>
                                            <ArrowRight className="w-4 h-4 text-[#B5945B] group-hover:text-[#070F2B] group-hover:translate-x-1 transition-transform" />
                                        </Link>

                                        <Link
                                            href="/products"
                                            className="text-xs font-bold uppercase tracking-wider text-[#070F2B]/70 hover:text-[#B5945B] transition-colors py-2 px-3 inline-flex items-center gap-1.5"
                                        >
                                            <span>View All</span>
                                            <span>→</span>
                                        </Link>
                                    </div>

                                    {/* 5. Clean 3-Card Feature Spec Matrix (Instant Readability) */}
                                    <div className="mt-6 pt-5 border-t border-[#070F2B]/10 grid grid-cols-3 gap-2.5 sm:gap-3 max-w-md">
                                        <div className="bg-white/85 backdrop-blur-xs rounded-xl p-2.5 sm:p-3 border border-[#070F2B]/8 shadow-xs">
                                            <span className="text-[9px] sm:text-[10px] text-[#B5945B] font-extrabold uppercase tracking-wider block">
                                                {slide.stat1Label}
                                            </span>
                                            <span className="text-xs sm:text-sm font-black text-[#070F2B] block mt-0.5">
                                                {slide.stat1Value}
                                            </span>
                                        </div>

                                        <div className="bg-white/85 backdrop-blur-xs rounded-xl p-2.5 sm:p-3 border border-[#070F2B]/8 shadow-xs">
                                            <span className="text-[9px] sm:text-[10px] text-[#B5945B] font-extrabold uppercase tracking-wider block">
                                                {slide.stat2Label}
                                            </span>
                                            <span className="text-xs sm:text-sm font-black text-[#070F2B] block mt-0.5">
                                                {slide.stat2Value}
                                            </span>
                                        </div>

                                        <div className="bg-white/85 backdrop-blur-xs rounded-xl p-2.5 sm:p-3 border border-[#070F2B]/8 shadow-xs">
                                            <span className="text-[9px] sm:text-[10px] text-[#B5945B] font-extrabold uppercase tracking-wider block">
                                                {slide.stat3Label}
                                            </span>
                                            <span className="text-xs sm:text-sm font-black text-[#070F2B] block mt-0.5">
                                                {slide.stat3Value}
                                            </span>
                                        </div>
                                    </div>

                                </div>
                            );
                        })}
                    </div>

                    {/* RIGHT COLUMN: Large Fashion Model Visual Frame */}
                    <div 
                        className="lg:col-span-7 relative w-full flex items-center justify-center order-2"
                        onTouchStart={handleTouchStart}
                        onTouchEnd={handleTouchEnd}
                    >
                        {/* Visual Container with Lookbook Frame */}
                        <div className="relative w-full max-w-[620px] lg:max-w-none aspect-[16/9] rounded-2xl sm:rounded-3xl overflow-hidden shadow-[0_20px_45px_rgba(7,15,43,0.12)] border border-[#070F2B]/10 bg-white z-10 group">
                            
                            {/* Shimmer Light Sweep on Slide Change */}
                            <div 
                                key={`shimmer-${progressKey}`}
                                className="absolute inset-0 w-[50%] h-full bg-gradient-to-r from-transparent via-white/30 to-transparent pointer-events-none z-20"
                                style={{ animation: 'hero-shimmer 850ms cubic-bezier(0.25, 1, 0.5, 1) forwards' }}
                            />

                            {/* Slides Stack with smooth horizontal slide & crossfade */}
                            {heroSlides.map((slide, index) => {
                                const isActive = currentSlide === index;
                                
                                let transformStyle = '';
                                if (isActive) {
                                    transformStyle = 'opacity-100 translate-x-0 scale-100 pointer-events-auto z-10';
                                } else {
                                    const isPast = (index < currentSlide && !(currentSlide === heroSlides.length - 1 && index === 0)) || (currentSlide === 0 && index === heroSlides.length - 1);
                                    transformStyle = isPast
                                        ? 'opacity-0 -translate-x-12 scale-[0.96] pointer-events-none z-0'
                                        : 'opacity-0 translate-x-12 scale-[0.96] pointer-events-none z-0';
                                }

                                return (
                                    <div
                                        key={slide.id}
                                        className={`absolute inset-0 transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] ${transformStyle}`}
                                    >
                                        <Image
                                            src={slide.image}
                                            alt={`Zeynix Model wearing ${slide.tagline}`}
                                            fill
                                            priority={index === 0}
                                            sizes="(max-width: 640px) 95vw, (max-width: 1024px) 90vw, 680px"
                                            className="object-cover object-center select-none transition-transform duration-1000 group-hover:scale-[1.03]"
                                        />
                                    </div>
                                );
                            })}

                            {/* Top Badge Overlay */}
                            <div className="absolute top-3 sm:top-4 left-3 sm:left-4 z-20">
                                <span className="bg-[#070F2B]/90 backdrop-blur-md text-[#FFCB05] text-[9px] sm:text-[10px] font-black uppercase tracking-wider py-1 px-2.5 sm:px-3 rounded-md border border-white/10 shadow-sm transition-all duration-300">
                                    {heroSlides[currentSlide].tagline}
                                </span>
                            </div>

                            {/* Bottom-Right Controls Pill (Slide Counter & Prev/Next Chevrons) */}
                            <div className="absolute bottom-3 sm:bottom-4 right-3 sm:right-4 z-20 flex items-center gap-1.5 bg-[#070F2B]/90 backdrop-blur-md text-white py-1 px-2.5 sm:py-1.5 sm:px-3 rounded-full border border-white/15 shadow-lg">
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
                                        aria-label="Previous Slide"
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
                                        aria-label="Next Slide"
                                    >
                                        <ChevronRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                                    </button>
                                </div>
                            </div>

                            {/* Slide Indicator with Smooth Animated Progress Bar */}
                            <div className="absolute top-3.5 sm:top-4 right-3 sm:right-4 z-20 flex items-center gap-1.5">
                                {heroSlides.map((_, i) => (
                                    <button
                                        key={i}
                                        onClick={(e) => {
                                            e.preventDefault();
                                            e.stopPropagation();
                                            goToSlide(i);
                                        }}
                                        className={`relative h-2 rounded-full overflow-hidden transition-all duration-400 cursor-pointer ${
                                            currentSlide === i 
                                                ? 'w-9 sm:w-12 bg-white/30' 
                                                : 'w-2 bg-white/50 hover:bg-white/80'
                                        }`}
                                        aria-label={`Go to slide ${i + 1}`}
                                    >
                                        {currentSlide === i && (
                                            <div 
                                                key={progressKey}
                                                className="absolute inset-y-0 left-0 bg-[#FFCB05] rounded-full"
                                                style={{
                                                    animation: 'hero-progress 6000ms linear forwards',
                                                    animationPlayState: isHovered ? 'paused' : 'running'
                                                }}
                                            />
                                        )}
                                    </button>
                                ))}
                            </div>

                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
}
