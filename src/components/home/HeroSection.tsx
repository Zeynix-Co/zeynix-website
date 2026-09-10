'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';

interface HeroSlide {
    id: string;
    badge: string;
    titlePart1: string;
    titlePart2: string;
    titleHighlight: string;
    subtitle: string;
    tagline: string;
    link: string;
    buttonText: string;
    image: string;
    fitTag: string;
    fabricTag: string;
    colorName: string;
}

const heroSlides: HeroSlide[] = [
    {
        id: 'downers-at-dusk',
        badge: 'VIRAL STREETWEAR // SS-26',
        titlePart1: 'YOUR MUSIC.',
        titlePart2: 'YOUR',
        titleHighlight: 'VIBE.',
        subtitle: '"Alag hi hain agar manzilein to kyu na alag hi rakhe hum raastein?" Heavyweight oversized graphic streetwear tee featuring the signature Downers At Dusk soundtrack atelier print.',
        tagline: 'Downers At Dusk Edition',
        link: '/products/casual',
        buttonText: 'SHOP STREETWEAR',
        image: '/images/hero/downers-at-dusk-tee.png',
        fitTag: 'OVERSIZED DROP-SHOULDER',
        fabricTag: '240 GSM HEAVYWEIGHT',
        colorName: 'PITCH BLACK'
    },
    {
        id: 'snake-graphic',
        badge: 'EXCLUSIVE DROP',
        titlePart1: 'SNAKES DON\'T HISS.',
        titlePart2: 'THEY',
        titleHighlight: 'KISS.',
        subtitle: 'Intricate monochromatic serpent tribal graphic screen-printed on premium organic combed cotton. Engineered with dropped shoulders for an effortless, confident street silhouette.',
        tagline: 'Serpent Graphic Edition',
        link: '/products/casual',
        buttonText: 'EXPLORE COLLECTION',
        image: '/images/hero/snake-graphic-tee.png',
        fitTag: 'RELAXED STREETWEAR',
        fabricTag: '100% ORGANIC COTTON',
        colorName: 'MIDNIGHT ONYX'
    },
    {
        id: 'guman-lavender',
        badge: 'SIGNATURE ATELIER',
        titlePart1: 'VINTAGE SOUND.',
        titlePart2: 'MODERN',
        titleHighlight: 'LUXURY.',
        subtitle: '"Woh Padhti Thi Kitaabein" Guman Spotify edition. Soft-washed pastel lilac heavyweight cotton with vinyl record soundtrack art on the back.',
        tagline: 'Guman Pastel Edition',
        link: '/products/casual',
        buttonText: 'SHOP PASTEL EDITION',
        image: '/images/hero/guman-lavender-tee.png',
        fitTag: 'STRUCTURED BOX FIT',
        fabricTag: 'SOFT-WASHED 240 GSM',
        colorName: 'LAVENDER PASTEL'
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
            {/* Custom keyframes for smooth progress bar and light shimmer */}
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

            {/* Subtle luxury geometric line accents */}
            <div className="absolute top-0 right-0 w-[300px] h-[300px] pointer-events-none opacity-20 hidden lg:block">
                <svg className="w-full h-full" viewBox="0 0 300 300" fill="none">
                    <circle cx="250" cy="50" r="180" stroke="#B5945B" strokeWidth="1" strokeDasharray="4 6" />
                    <circle cx="250" cy="50" r="220" stroke="#070F2B" strokeWidth="0.5" />
                </svg>
            </div>

            {/* Decorative dot matrix - desktop left margin */}
            <div className="absolute left-6 top-1/2 -translate-y-1/2 hidden xl:flex flex-col gap-3.5 opacity-20 pointer-events-none z-0">
                {[...Array(6)].map((_, r) => (
                    <div key={r} className="flex gap-3">
                        {[...Array(2)].map((_, c) => (
                            <div key={c} className="w-1.5 h-1.5 rounded-full bg-[#070F2B]" />
                        ))}
                    </div>
                ))}
            </div>

            <div className="container mx-auto max-w-6xl relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-8 items-center">
                    
                    {/* LEFT COLUMN: Editorial Typography & CTA (Smooth Fade & Slide-Up) */}
                    <div className="lg:col-span-5 relative min-h-[310px] xs:min-h-[330px] sm:min-h-[360px] md:min-h-[390px] lg:min-h-[440px] flex items-center text-left order-1">
                        {heroSlides.map((slide, index) => {
                            const isActive = currentSlide === index;
                            return (
                                <div
                                    key={slide.id}
                                    className={`w-full transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                                        isActive 
                                            ? 'opacity-100 translate-y-0 scale-100 pointer-events-auto z-10' 
                                            : 'opacity-0 translate-y-6 scale-[0.98] pointer-events-none absolute inset-x-0 top-1/2 -translate-y-1/2 z-0'
                                    }`}
                                >
                                    {/* 1. Collection Label / Micro-Badge */}
                                    <div className="inline-flex items-center gap-2.5 mb-3 sm:mb-4">
                                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#B5945B]/10 border border-[#B5945B]/30 text-[#070F2B] text-[10px] sm:text-[11px] font-black uppercase tracking-widest">
                                            <span className="w-1.5 h-1.5 rounded-full bg-[#B5945B] animate-pulse" />
                                            {slide.badge}
                                        </span>
                                        <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-widest text-[#B5945B]">
                                            {slide.fitTag}
                                        </span>
                                    </div>

                                    {/* 2. Bold Editorial Headline */}
                                    <h1 className="text-3xl xs:text-4xl sm:text-5xl md:text-6xl lg:text-[62px] font-black tracking-tight leading-[1.04] uppercase text-[#070F2B]">
                                        {slide.titlePart1}<br />
                                        {slide.titlePart2}{' '}
                                        <span className="text-[#B5945B] relative inline-block">
                                            {slide.titleHighlight}
                                            {/* Subtle gold brush underline */}
                                            <svg 
                                                className="absolute -bottom-1 sm:-bottom-2 left-0 w-full h-2 sm:h-3 text-[#B5945B]" 
                                                viewBox="0 0 100 10" 
                                                fill="none" 
                                                xmlns="http://www.w3.org/2000/svg" 
                                                preserveAspectRatio="none"
                                            >
                                                <path d="M0 6 Q 30 1, 60 7 T 100 5" stroke="currentColor" strokeWidth="3" strokeLinecap="round" fill="none" />
                                            </svg>
                                        </span>
                                    </h1>

                                    {/* 3. Short Supporting Fashion Statement */}
                                    <p className="mt-3 sm:mt-4 text-xs sm:text-sm md:text-base text-[#070F2B]/75 font-medium leading-relaxed max-w-md">
                                        {slide.subtitle}
                                    </p>

                                    {/* 4. Primary CTA & Secondary Quick Indicator */}
                                    <div className="mt-5 sm:mt-7 flex flex-wrap items-center gap-4">
                                        <Link 
                                            href={slide.link}
                                            className="bg-[#070F2B] text-white py-3 px-6 sm:py-3.5 sm:px-8 rounded-none font-black uppercase tracking-wider text-[11px] sm:text-xs shadow-[4px_4px_0px_#B5945B] hover:shadow-[0px_0px_0px_#B5945B] hover:bg-[#B5945B] hover:text-[#070F2B] transition-all duration-300 text-center inline-flex items-center gap-3 group border border-[#070F2B] hover:border-[#B5945B] active:scale-[0.98]"
                                        >
                                            <span>{slide.buttonText}</span>
                                            <ArrowRight className="w-4 h-4 text-[#B5945B] group-hover:text-[#070F2B] group-hover:translate-x-1 transition-transform" />
                                        </Link>

                                        <div className="flex items-center gap-2 text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-[#070F2B]/60 pl-1">
                                            <span className="w-1.5 h-1.5 rounded-full bg-[#070F2B]/30" />
                                            <span>{slide.colorName}</span>
                                        </div>
                                    </div>

                                    {/* 5. Minimalist Fabric & Craft Spec Tags */}
                                    <div className="mt-6 sm:mt-8 pt-4 sm:pt-5 border-t border-[#070F2B]/10 flex flex-wrap items-center gap-x-4 gap-y-2 text-[10px] sm:text-[11px] font-bold text-[#070F2B]/65 uppercase tracking-wider">
                                        <span className="flex items-center gap-1.5">
                                            <span className="text-[#B5945B]">✓</span> {slide.fabricTag}
                                        </span>
                                        <span className="hidden xs:inline text-[#070F2B]/20">•</span>
                                        <span className="flex items-center gap-1.5">
                                            <span className="text-[#B5945B]">✓</span> 100% Combed Cotton
                                        </span>
                                        <span className="hidden xs:inline text-[#070F2B]/20">•</span>
                                        <span className="flex items-center gap-1.5">
                                            <span className="text-[#B5945B]">✓</span> Pre-Shrunk Fit
                                        </span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* RIGHT COLUMN: Large Fashion Model Visual with Cinematic Editorial Motion */}
                    <div 
                        className="lg:col-span-7 relative w-full flex items-center justify-center order-2"
                        onTouchStart={handleTouchStart}
                        onTouchEnd={handleTouchEnd}
                    >
                        {/* Background Watermark & Framing */}
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
                            <div className="w-[85%] h-[85%] opacity-[0.04] select-none">
                                <Image
                                    src="/images/logos/zeynix-logo-rbg.png"
                                    alt="Zeynix Watermark"
                                    width={500}
                                    height={500}
                                    className="object-contain w-full h-full"
                                    priority
                                />
                            </div>
                            {/* Subtle gold framing lines */}
                            <div className="hidden lg:block absolute -right-3 -top-3 w-28 h-28 border-t-2 border-r-2 border-[#B5945B]/30 rounded-tr-3xl pointer-events-none" />
                            <div className="hidden lg:block absolute -left-3 -bottom-3 w-28 h-28 border-b-2 border-l-2 border-[#B5945B]/30 rounded-bl-3xl pointer-events-none" />
                        </div>

                        {/* Visual Container with Lookbook Frame */}
                        <div className="relative w-full max-w-[620px] lg:max-w-none aspect-[16/9] rounded-2xl sm:rounded-3xl overflow-hidden shadow-[0_24px_50px_-10px_rgba(7,15,43,0.14)] border border-[#070F2B]/10 bg-white z-10 group">
                            
                            {/* Shimmer Light Sweep on Slide Change */}
                            <div 
                                key={`shimmer-${progressKey}`}
                                className="absolute inset-0 w-[50%] h-full bg-gradient-to-r from-transparent via-white/30 to-transparent pointer-events-none z-20"
                                style={{ animation: 'hero-shimmer 850ms cubic-bezier(0.25, 1, 0.5, 1) forwards' }}
                            />

                            {/* Slides Stack with smooth horizontal slide & crossfade */}
                            {heroSlides.map((slide, index) => {
                                const isActive = currentSlide === index;
                                
                                // Directional translation
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
                                <span className="bg-[#070F2B]/85 backdrop-blur-md text-[#FFCB05] text-[9px] sm:text-[10px] font-black uppercase tracking-wider py-1 px-2.5 sm:px-3 rounded-md border border-white/10 shadow-sm transition-all duration-300">
                                    {heroSlides[currentSlide].tagline}
                                </span>
                            </div>

                            {/* Bottom-Left Fabric Badge */}
                            <div className="absolute bottom-3.5 sm:bottom-4 left-3 sm:left-4 z-20 hidden xs:block">
                                <div className="bg-[#FAF6F0]/90 backdrop-blur-md text-[#070F2B] text-[9px] sm:text-[10px] font-black uppercase tracking-wider py-1 px-2.5 rounded-md border border-[#070F2B]/10 shadow-sm">
                                    {heroSlides[currentSlide].fabricTag}
                                </div>
                            </div>

                            {/* Bottom-Right Controls Pill (Slide Counter & Prev/Next Chevrons) */}
                            <div className="absolute bottom-3 sm:bottom-4 right-3 sm:right-4 z-20 flex items-center gap-1.5 bg-[#070F2B]/85 backdrop-blur-md text-white py-1 px-2.5 sm:py-1.5 sm:px-3 rounded-full border border-white/15 shadow-lg">
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
