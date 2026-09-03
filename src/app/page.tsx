'use client';

import { useState, useEffect, useRef } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import Link from 'next/link';
import Image from 'next/image';
import { colorClasses, APP_CONFIG } from '@/lib/constants';
import { useWishlistStore, useAuthStore } from '@/store';
import useCartStore from '@/store/cartStore';
import WishlistConfirmationModal from '@/components/wishlist/WishlistConfirmationModal';
import ProductCard from '@/components/product/ProductCard';
import { 
    Award, 
    Sparkles, 
    Shield, 
    RotateCcw, 
    Heart, 
    ShoppingCart, 
    ArrowRight, 
    Star, 
    ChevronLeft, 
    ChevronRight,
    Play,
    Instagram
} from 'lucide-react';

const heroSlides = [
    {
        category: 'Casual',
        tagline: 'Timeless Casuals',
        titlePart1: 'Effortless Style.',
        titlePart2: 'Everyday',
        titleHighlight: 'You.',
        subtitle: 'Timeless casuals designed for comfort, made for you.',
        buttonText: 'Explore Casuals',
        link: '/products/casual',
        image: '/images/lookbook-1.jpg'
    },
    {
        category: 'Casual',
        tagline: 'Premium Layers',
        titlePart1: 'Modern Utility.',
        titlePart2: 'Aesthetic',
        titleHighlight: 'Fits.',
        subtitle: 'Cozy layers, utility jackets, and tailored bomber fits.',
        buttonText: 'Shop Utility',
        link: '/products/casual',
        image: '/images/lookbook-3.jpg'
    },
    {
        category: 'Casual',
        tagline: 'Vintage Washes',
        titlePart1: 'Classic Blue.',
        titlePart2: 'Lightweight',
        titleHighlight: 'Denim.',
        subtitle: 'Premium denim jackets and structured layers for casual luxury.',
        buttonText: 'Shop Denim',
        link: '/products/casual',
        image: '/images/lookbook-4.jpg'
    }
];

export default function HomePage() {
    const [casualProducts, setCasualProducts] = useState<any[]>([]);
    const [newArrivals, setNewArrivals] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    // Carousel & Hero Slider State
    const [carouselIndex, setCarouselIndex] = useState(0);
    const [activeHeroSlide, setActiveHeroSlide] = useState(0);
    const [hoveredButton, setHoveredButton] = useState<number | null>(null);
    const carouselRef = useRef<HTMLDivElement>(null);

    // Wishlist context
    const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlistStore();
    const { isAuthenticated } = useAuthStore();
    const { addToCart } = useCartStore();
    const [showWishlistModal, setShowWishlistModal] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState<any>(null);

    useEffect(() => {
        const loadHomeData = async () => {
            try {
                // Fetch casual products
                const casualRes = await fetch('/api/customer/products?category=casual&limit=8');
                const casualJson = await casualRes.json();
                if (casualJson.success && casualJson.data.products?.length > 0) {
                    setCasualProducts(casualJson.data.products.slice(0, 4));
                }

                // Fetch new arrivals
                const newRes = await fetch('/api/customer/products?limit=8');
                const newJson = await newRes.json();
                if (newJson.success && newJson.data.products?.length > 0) {
                    setNewArrivals(newJson.data.products);
                }
            } catch (err) {
                console.error('Failed to load homepage products:', err);
            } finally {
                setIsLoading(false);
            }
        };
        loadHomeData();
    }, []);

    // Hero Slider Auto-Play with pause on hover
    const [isHoveringHero, setIsHoveringHero] = useState(false);
    useEffect(() => {
        if (isHoveringHero) return;
        const timer = setInterval(() => {
            setActiveHeroSlide((prev) => (prev + 1) % heroSlides.length);
        }, 6000);
        return () => clearInterval(timer);
    }, [isHoveringHero]);

    const handleWishlistToggle = (e: React.MouseEvent, product: any) => {
        e.preventDefault();
        e.stopPropagation();

        const defaultSize = product.size?.[0] || 'M';
        const isWishlisted = isInWishlist(product.id, defaultSize);

        if (isWishlisted) {
            removeFromWishlist(product.id, defaultSize);
        } else {
            addToWishlist({
                id: product.id,
                title: product.name,
                images: product.images || [product.image],
                price: product.price,
                originalPrice: product.originalPrice,
                discountPrice: product.price,
                category: product.category,
                brand: product.brand || 'Zeynix'
            }, defaultSize);

            setSelectedProduct(product);
            setShowWishlistModal(true);
        }
    };

    const handleQuickAddToCart = async (e: React.MouseEvent, product: any) => {
        e.preventDefault();
        e.stopPropagation();

        if (!isAuthenticated) {
            window.location.href = '/login?redirect=/';
            return;
        }

        const defaultSize = product.size?.[0] || 'M';
        
        addToCart({
            product: {
                id: product.id,
                title: product.name,
                images: product.images || [product.image],
                price: product.price,
                discountPrice: product.price
            },
            size: defaultSize,
            quantity: 1,
            totalPrice: product.price
        });
    };

    // Carousel calculations
    const slideNext = () => {
        if (newArrivals.length === 0) return;
        setCarouselIndex((prev) => (prev + 1) % Math.max(1, newArrivals.length - 4));
    };

    const slidePrev = () => {
        if (newArrivals.length === 0) return;
        setCarouselIndex((prev) => (prev - 1 + Math.max(1, newArrivals.length - 4)) % Math.max(1, newArrivals.length - 4));
    };

    return (
        <div className="min-h-screen bg-[#FAF6F0] text-[#070F2B] overflow-x-hidden font-sans">
            <Header />

            {/* 1. HERO SECTION (Redesigned matching reference mockup exactly) */}
            <section 
                className="relative w-full min-h-[380px] md:min-h-[440px] lg:min-h-[490px] flex items-center pt-3 pb-8 md:pt-4 md:pb-10 px-4 sm:px-8 md:px-12 xl:px-20 overflow-hidden border-b border-[#070F2B]/5 select-none"
                style={{ backgroundColor: '#FAF6F0' }}
                onMouseEnter={() => setIsHoveringHero(true)}
                onMouseLeave={() => setIsHoveringHero(false)}
            >
                {/* Background Textures */}
                <div 
                    className="absolute inset-0 opacity-40 pointer-events-none z-0"
                    style={{
                        backgroundImage: `
                            radial-gradient(circle at center, transparent 30%, #FAF6F0 100%),
                            linear-gradient(to right, rgba(181, 148, 91, 0.04) 1px, transparent 1px),
                            linear-gradient(to bottom, rgba(181, 148, 91, 0.04) 1px, transparent 1px)
                        `,
                        backgroundSize: '100% 100%, 32px 32px, 32px 32px'
                    }}
                />
                
                {/* Top-Left gold slash and navy triangle (Scaled down & transparent on mobile to avoid overlapping text) */}
                <div className="absolute top-0 left-0 w-[90px] sm:w-[200px] md:w-[240px] lg:w-[280px] aspect-square pointer-events-none z-0 select-none opacity-40 sm:opacity-100">
                    <svg className="w-full h-full" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M-10 -10 C 45 20, 70 50, 90 100 C 75 110, 35 75, -10 40 Z" fill="#B5945B" opacity="0.85" />
                        <path d="M-10 20 C 15 40, 45 80, 60 125 C 50 130, 25 95, -10 65 Z" fill="#B5945B" opacity="0.6" />
                        <path d="M-10 -10 L80 -10 L-10 160 Z" fill="#070F2B" />
                    </svg>
                </div>

                {/* Bottom-Left gold brush slash */}
                <div className="absolute bottom-0 left-0 w-[140px] sm:w-[260px] md:w-[320px] aspect-[4/3] pointer-events-none z-0 select-none opacity-60 sm:opacity-100">
                    <svg className="w-full h-full" viewBox="0 0 200 150" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
                        <path d="M-10 160 C 45 125, 105 105, 165 160 Z" fill="#B5945B" opacity="0.85" />
                        <path d="M-10 105 C 25 75, 85 65, 125 160 Z" fill="#B5945B" opacity="0.55" />
                    </svg>
                </div>

                {/* Left margin 2x6 dot matrix */}
                <div className="absolute left-6 top-1/2 -translate-y-1/2 hidden xl:flex flex-col gap-3.5 opacity-25 z-0 select-none">
                    {[...Array(6)].map((_, r) => (
                        <div key={r} className="flex gap-3">
                            {[...Array(2)].map((_, c) => (
                                <div key={c} className="w-1.5 h-1.5 rounded-full bg-[#070F2B]" />
                            ))}
                        </div>
                    ))}
                </div>

                {/* Tilted background wireframe grid on the left */}
                <div className="absolute left-[12%] top-[22%] w-44 h-44 border border-[#B5945B]/15 rotate-[24deg] pointer-events-none z-0 hidden lg:grid grid-cols-4 grid-rows-4 select-none">
                    {[...Array(16)].map((_, i) => (
                        <div key={i} className="border border-[#B5945B]/5" />
                    ))}
                </div>

                <div className="container mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8 items-center relative z-10 max-w-6xl">
                    
                    {/* Left: Campaign typography */}
                    <div className="lg:col-span-6 relative min-h-[250px] xs:min-h-[270px] md:min-h-[270px] lg:min-h-[310px] flex items-center z-10 pl-1 sm:pl-8 lg:pl-12">
                        {heroSlides.map((slide, index) => {
                            const isActive = activeHeroSlide === index;
                            return (
                                <div 
                                    key={index}
                                    className={`absolute inset-x-0 top-1/2 -translate-y-1/2 transition-all duration-1000 ease-in-out space-y-3.5 sm:space-y-5 md:space-y-6 text-left ${
                                        isActive 
                                            ? 'opacity-100 translate-y-[-50%] pointer-events-auto z-10' 
                                            : 'opacity-0 translate-y-[-45%] pointer-events-none z-0'
                                    }`}
                                >
                                    {/* Category tag */}
                                    <div className="flex items-center gap-2">
                                        <span className="w-5 sm:w-6 h-[2px] bg-[#B5945B]" />
                                        <span className="text-[9px] sm:text-[10px] font-extrabold uppercase tracking-widest text-[#B5945B]">
                                            {slide.tagline}
                                        </span>
                                    </div>

                                    {/* Main Heading */}
                                    <h1 className="text-3xl xs:text-4xl sm:text-5xl md:text-6xl lg:text-[68px] font-black tracking-tight leading-[1.04] uppercase text-[#070F2B]">
                                        {slide.titlePart1}<br />
                                        {slide.titlePart2} <span className="text-[#B5945B] relative inline-block">
                                            {slide.titleHighlight}
                                            {/* Accent line under highlighted word */}
                                            <svg className="absolute -bottom-1.5 sm:-bottom-2 left-0 w-full h-2.5 sm:h-3 text-[#B5945B]" viewBox="0 0 100 10" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
                                                <path d="M0 5 Q 35 2, 70 8 T 100 4" stroke="currentColor" strokeWidth="3" strokeLinecap="round" fill="none" />
                                            </svg>
                                        </span>
                                    </h1>

                                    {/* Subtitle */}
                                    <p className="text-xs sm:text-sm md:text-base text-[#070F2B]/75 font-semibold leading-relaxed max-w-sm">
                                        {slide.subtitle}
                                    </p>
                                    
                                    {/* Single CTA button matching mockup */}
                                    <div className="pt-1 sm:pt-2">
                                        <Link 
                                            href={slide.link} 
                                            onMouseEnter={() => setHoveredButton(index)}
                                            onMouseLeave={() => setHoveredButton(null)}
                                            className="bg-[#070F2B] text-white py-2.5 px-6 sm:py-3.5 sm:px-8 rounded-none font-bold uppercase tracking-wider text-[10px] sm:text-[11px] shadow-[3px_3px_0px_#B5945B] sm:shadow-[4px_4px_0px_#B5945B] hover:shadow-[0px_0px_0px_#B5945B] hover:bg-[#B5945B] hover:text-[#070F2B] transition-all duration-300 text-center inline-flex items-center gap-2.5 sm:gap-3.5 group cursor-pointer border border-[#070F2B] hover:border-[#B5945B] active:scale-[0.98]"
                                        >
                                            {hoveredButton === index ? 'Explore Casuals' : slide.buttonText}
                                            <span className="text-[#B5945B] group-hover:translate-x-1 transition-transform font-bold">&rarr;</span>
                                        </Link>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Right: Lifestyle campaign visual (Unboxed style, directly overlays background brush strokes) */}
                    <div className="lg:col-span-6 relative w-full h-[260px] sm:h-[350px] lg:h-[430px] flex items-end justify-center z-10">
                        {/* Background Z and grid accents */}
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
                            {/* Real Zeynix Logo Watermark */}
                            <div className="absolute w-[80%] md:w-[90%] h-[80%] flex items-center justify-center opacity-[0.07] pointer-events-none select-none z-0">
                                <Image
                                    src="/images/logos/zeynix-logo-rbg.png"
                                    alt="Zeynix Logo Watermark"
                                    width={450}
                                    height={450}
                                    className="object-contain w-full h-full"
                                    priority
                                />
                            </div>
                            
                            {/* Diagonal gold lines on the right */}
                            <div className="absolute -right-6 top-1/4 w-32 h-[2px] bg-gradient-to-r from-transparent to-[#B5945B]/40 rotate-[-30deg]" />
                            <div className="absolute -right-12 top-1/3 w-40 h-[2px] bg-gradient-to-r from-transparent to-[#B5945B]/30 rotate-[-30deg]" />
                            
                            {/* Accent Dot pattern */}
                            <div className="absolute right-4 bottom-20 flex gap-2 opacity-35">
                                {[...Array(3)].map((_, r) => (
                                    <div key={r} className="flex flex-col gap-2">
                                        {[...Array(3)].map((_, c) => (
                                            <div key={c} className="w-1.5 h-1.5 rounded-full bg-[#070F2B]" />
                                        ))}
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Sliding Images */}
                        {heroSlides.map((slide, index) => {
                            const isActive = activeHeroSlide === index;
                            return (
                                <div 
                                    key={index}
                                    className={`absolute inset-0 flex items-end justify-center transition-all duration-1000 ease-in-out ${
                                        isActive 
                                            ? 'opacity-100 translate-x-0 scale-100 pointer-events-auto z-10' 
                                            : 'opacity-0 translate-x-12 scale-95 pointer-events-none z-0'
                                    }`}
                                >
                                    <div className="relative w-full h-[90%] max-h-[300px] lg:max-h-[410px] aspect-[4/5] md:aspect-[3/4] flex items-end justify-center">
                                        <Image 
                                            src={slide.image} 
                                            alt={`${slide.category} Campaign visual`}
                                            fill
                                            priority={index === 0}
                                            sizes="(max-width: 1024px) 100vw, 550px"
                                            className="object-contain object-bottom select-none drop-shadow-[0_20px_40px_rgba(7,15,43,0.18)]"
                                        />
                                    </div>
                                </div>
                            );
                        })}

                        {/* Carousel navigation controls */}
                        <div className="absolute bottom-2 right-2 sm:bottom-4 sm:right-12 flex items-center gap-2 sm:gap-3.5 z-20">
                            <button 
                                onClick={() => setActiveHeroSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length)}
                                className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-[#070F2B] text-white flex items-center justify-center hover:bg-[#B5945B] hover:scale-105 active:scale-95 transition-all shadow-lg border border-white/10 cursor-pointer"
                                aria-label="Previous Slide"
                            >
                                <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                            </button>
                            <button 
                                onClick={() => setActiveHeroSlide((prev) => (prev + 1) % heroSlides.length)}
                                className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-[#070F2B] text-white flex items-center justify-center hover:bg-[#B5945B] hover:scale-105 active:scale-95 transition-all shadow-lg border border-white/10 cursor-pointer"
                                aria-label="Next Slide"
                            >
                                <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            {/* 2. Floating rounded benefits panel overlapping the Hero section (2x2 on mobile, row on desktop) */}
            <div className="relative z-20 -mt-3 lg:-mt-4 max-w-6xl mx-auto px-3 sm:px-4">
                <div className="bg-[#070F2B] text-white rounded-2xl py-5 px-4 sm:py-7 sm:px-8 md:px-10 shadow-[0_20px_50px_rgba(7,15,43,0.28)] border border-white/10 grid grid-cols-2 lg:flex lg:flex-row items-stretch justify-between gap-3 sm:gap-4 lg:gap-0 backdrop-blur-md bg-opacity-95">
                    
                    {/* Benefit 1 */}
                    <div className="flex-1 flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-2 sm:gap-4 p-1.5 sm:p-2 transition-transform duration-300 hover:translate-y-[-2px] group">
                        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl border border-white/10 bg-white/5 flex items-center justify-center text-[#B5945B] shrink-0 group-hover:border-[#B5945B]/40 group-hover:bg-[#B5945B]/5 transition-all duration-300">
                            <Award className="w-5 h-5 sm:w-6 sm:h-6 stroke-[1.5] group-hover:scale-110 transition-transform duration-300" />
                        </div>
                        <div>
                            <h4 className="text-xs sm:text-sm font-extrabold uppercase tracking-wider text-[#FAF6F0] group-hover:text-[#B5945B] transition-colors duration-300">Premium Quality</h4>
                            <p className="text-[10px] sm:text-xs text-white/60 mt-0.5 sm:mt-1 leading-relaxed max-w-[220px]">Finest fabrics for lasting comfort.</p>
                        </div>
                    </div>

                    <div className="hidden lg:block w-px bg-white/10 self-stretch my-2 mx-4" />

                    {/* Benefit 2 */}
                    <div className="flex-1 flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-2 sm:gap-4 p-1.5 sm:p-2 lg:pl-6 transition-transform duration-300 hover:translate-y-[-2px] group">
                        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl border border-white/10 bg-white/5 flex items-center justify-center text-[#B5945B] shrink-0 group-hover:border-[#B5945B]/40 group-hover:bg-[#B5945B]/5 transition-all duration-300">
                            <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 stroke-[1.5] group-hover:scale-110 transition-transform duration-300" />
                        </div>
                        <div>
                            <h4 className="text-xs sm:text-sm font-extrabold uppercase tracking-wider text-[#FAF6F0] group-hover:text-[#B5945B] transition-colors duration-300">Modern Designs</h4>
                            <p className="text-[10px] sm:text-xs text-white/60 mt-0.5 sm:mt-1 leading-relaxed max-w-[220px]">Clean, minimal & on-trend styles.</p>
                        </div>
                    </div>

                    <div className="hidden lg:block w-px bg-white/10 self-stretch my-2 mx-4" />

                    {/* Benefit 3 */}
                    <div className="flex-1 flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-2 sm:gap-4 p-1.5 sm:p-2 lg:pl-6 transition-transform duration-300 hover:translate-y-[-2px] group">
                        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl border border-white/10 bg-white/5 flex items-center justify-center text-[#B5945B] shrink-0 group-hover:border-[#B5945B]/40 group-hover:bg-[#B5945B]/5 transition-all duration-300">
                            <Shield className="w-5 h-5 sm:w-6 sm:h-6 stroke-[1.5] group-hover:scale-110 transition-transform duration-300" />
                        </div>
                        <div>
                            <h4 className="text-xs sm:text-sm font-extrabold uppercase tracking-wider text-[#FAF6F0] group-hover:text-[#B5945B] transition-colors duration-300">Built to Last</h4>
                            <p className="text-[10px] sm:text-xs text-white/60 mt-0.5 sm:mt-1 leading-relaxed max-w-[220px]">Durable materials made to last.</p>
                        </div>
                    </div>

                    <div className="hidden lg:block w-px bg-white/10 self-stretch my-2 mx-4" />

                    {/* Benefit 4 */}
                    <div className="flex-1 flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-2 sm:gap-4 p-1.5 sm:p-2 lg:pl-6 transition-transform duration-300 hover:translate-y-[-2px] group">
                        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl border border-white/10 bg-white/5 flex items-center justify-center text-[#B5945B] shrink-0 group-hover:border-[#B5945B]/40 group-hover:bg-[#B5945B]/5 transition-all duration-300">
                            <RotateCcw className="w-5 h-5 sm:w-6 sm:h-6 stroke-[1.5] group-hover:scale-110 transition-transform duration-300" />
                        </div>
                        <div>
                            <h4 className="text-xs sm:text-sm font-extrabold uppercase tracking-wider text-[#FAF6F0] group-hover:text-[#B5945B] transition-colors duration-300">Easy Returns</h4>
                            <p className="text-[10px] sm:text-xs text-white/60 mt-0.5 sm:mt-1 leading-relaxed max-w-[220px]">Hassle-free returns & exchanges.</p>
                        </div>
                    </div>

                </div>
            </div>

            {/* 3. CUSTOM PRINTING BANNER (Compacted container) */}
            <section className="py-10 md:py-14 px-4 md:px-8 bg-[#FCF8DD]">
                <div className="container mx-auto max-w-6xl">
                    <div className="grid grid-cols-1 lg:grid-cols-12 rounded-2xl overflow-hidden shadow-xl border border-[#070F2B]/10">
                        
                        {/* Left: Visual representation (Print atelier flat lay) */}
                        <div className="lg:col-span-6 relative aspect-[4/3] lg:aspect-auto min-h-[280px] bg-white group overflow-hidden">
                            <div className="absolute inset-0 bg-[#070F2B]/5 group-hover:bg-transparent transition-all duration-300 z-10" />
                            <Image 
                                src="/images/custom-print-service.jpg" 
                                alt="Zeynix Custom Printing Service Flatlay" 
                                fill
                                className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                            />
                            
                            <div className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-md rounded-xl p-4 border border-[#070F2B]/10 flex items-center gap-3.5 z-20 shadow-lg">
                                <div className="w-9 h-9 rounded-full bg-[#070F2B] text-white flex items-center justify-center text-[11px] font-black shadow-md flex-shrink-0">
                                    B2B
                                </div>
                                <div>
                                    <span className="text-[10px] font-black uppercase block tracking-wider text-[#070F2B]">Bespoke Printing Atelier</span>
                                    <span className="text-[9px] text-gray-500 block leading-tight">High-end screen printing for teams & event merch</span>
                                </div>
                            </div>
                        </div>

                        {/* Right: Premium Dark Navy Panel */}
                        <div className="lg:col-span-6 bg-[#070F2B] text-white p-6 md:p-12 flex flex-col justify-center space-y-4 border-l border-white/5">
                            <span className="text-[10px] font-black uppercase tracking-widest text-[#FFCB05]">
                                Signature Print Atelier
                            </span>
                            <h2 className="text-2xl md:text-4xl font-black tracking-tight leading-tight uppercase">
                                Custom Printing.<br />
                                Crafted To Order.
                            </h2>
                            <p className="text-xs text-white/70 leading-relaxed font-semibold">
                                We bring your creative visions to life. From corporate branding to limited event merchandise, get high-quality custom printing on our premium organic cotton fabrics. Send us your designs, and we will handle the rest.
                            </p>
                            <div className="pt-2">
                                <Link 
                                    href="/contact" 
                                    className="inline-flex items-center gap-2 bg-[#FFCB05] text-[#070F2B] py-3.5 px-6 rounded-xl font-bold uppercase tracking-wider text-[10px] shadow-md hover:bg-white hover:scale-105 active:scale-95 transition-all duration-300 cursor-pointer"
                                >
                                    Inquire Bespoke Order
                                    <ArrowRight className="w-3.5 h-3.5 text-[#070F2B]" />
                                </Link>
                            </div>
                        </div>

                    </div>
                </div>
            </section>

            {/* 4. CASUAL ESSENTIALS GRID (Reduced margins & smaller cards) */}
            <section className="py-10 md:py-14 px-4 bg-white border-t border-b border-[#070F2B]/5 relative z-10">
                <div className="container mx-auto max-w-6xl">
                    
                    {/* Header */}
                    <div className="flex items-end justify-between mb-8">
                        <div>
                            <span className="text-[10px] font-black uppercase tracking-widest text-[#FFCB05] block mb-0.5">Ready to Wear</span>
                            <h2 className="text-2xl md:text-3xl font-black uppercase tracking-tight text-[#070F2B]">
                                Casual Essentials
                            </h2>
                        </div>
                        <Link href="/products/casual" className="text-[10px] font-extrabold uppercase tracking-wider hover:text-[#FFCB05] transition-colors border-b-2 border-[#070F2B] pb-0.5 flex items-center gap-1 cursor-pointer">
                            View All <ArrowRight className="w-3 h-3" />
                        </Link>
                    </div>

                    {/* Products Grid */}
                    {isLoading ? (
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4">
                            {[1, 2, 3, 4].map((i) => (
                                <div key={i} className="aspect-[3/4] bg-gray-50 rounded-xl animate-pulse" />
                            ))}
                        </div>
                    ) : casualProducts.length === 0 ? (
                        <div className="text-center py-8 text-gray-500 font-semibold text-xs">
                            No casual products available. Check back soon!
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4">
                            {casualProducts.map((product) => (
                                <ProductCard 
                                    key={product.id}
                                    product={{
                                        ...product,
                                        images: product.images || [product.image]
                                    }}
                                />
                            ))}
                        </div>
                    )}

                </div>
            </section>



            {/* 7. 30-MINUTE DELIVERY PROMOTION BANNER */}
            <section className="py-12 md:py-16 bg-[#070F2B] text-white px-4 md:px-8 border-b border-white/5 relative overflow-hidden select-none">
                <style dangerouslySetInnerHTML={{__html: `
                    @keyframes road-slide {
                        0% { background-position: 0 0; }
                        100% { background-position: -30px 0; }
                    }
                    @keyframes speed-line {
                        0% { transform: translateX(80px); opacity: 0; }
                        50% { opacity: 0.8; }
                        100% { transform: translateX(-150px); opacity: 0; }
                    }
                    @keyframes bounce-truck {
                        0%, 100% { transform: translateY(0); }
                        50% { transform: translateY(-2.5px); }
                    }
                    @keyframes wheel-spin {
                        0% { transform: rotate(0deg); }
                        100% { transform: rotate(360deg); }
                    }
                `}} />

                {/* Decorative circles in background */}
                <div className="absolute top-1/2 left-10 -translate-y-1/2 w-48 h-48 border border-white/5 rounded-full pointer-events-none" />
                <div className="absolute top-1/2 right-10 -translate-y-1/2 w-72 h-72 border border-white/5 rounded-full pointer-events-none" />

                <div className="container mx-auto max-w-5xl relative z-10">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                        
                        {/* Left Column: Speeding Delivery Truck Animation */}
                        <div className="lg:col-span-5 flex flex-col items-center justify-center relative min-h-[140px] md:min-h-[160px] overflow-hidden bg-[#070F2B]/40 rounded-2xl p-6 border border-white/5">
                            {/* Speed Lines */}
                            <div className="absolute left-[20%] top-[25%] w-24 h-[1.5px] bg-gradient-to-r from-transparent via-[#FFCB05] to-transparent animate-[speed-line_0.7s_linear_infinite]" />
                            <div className="absolute left-[10%] top-[45%] w-16 h-[1px] bg-gradient-to-r from-transparent via-white to-transparent animate-[speed-line_0.5s_linear_infinite] [animation-delay:150ms]" />
                            <div className="absolute left-[15%] top-[65%] w-28 h-[2px] bg-gradient-to-r from-transparent via-[#B5945B] to-transparent animate-[speed-line_0.9s_linear_infinite] [animation-delay:300ms]" />

                            {/* Truck */}
                            <div className="relative animate-[bounce-truck_0.35s_infinite_alternate] z-20 flex flex-col items-center">
                                <svg className="w-36 h-20 text-[#FFCB05]" viewBox="0 0 120 60" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                    {/* Cargo Box */}
                                    <rect x="5" y="5" width="75" height="40" rx="3" fill="#FAF6F0" className="stroke-[#070F2B] stroke-[2px]" />
                                    {/* Branding on cargo box */}
                                    <text x="42.5" y="24" fill="#070F2B" fontSize="8" fontWeight="900" textAnchor="middle" letterSpacing="1">ZEYNIX</text>
                                    <text x="42.5" y="34" fill="#B5945B" fontSize="5" fontWeight="900" textAnchor="middle" letterSpacing="0.5">30 MINS EXPRESS</text>
                                    
                                    {/* Cabin */}
                                    <path d="M 80 45 L 80 18 L 98 18 C 103 18, 107 22, 107 27 L 115 27 L 115 45 Z" fill="#070F2B" className="stroke-[#FAF6F0] stroke-[1.5px]" />
                                    {/* Cabin Window */}
                                    <path d="M 85 22 L 96 22 L 99 27 L 85 27 Z" fill="#FAF6F0" />
                                    
                                    {/* Wheels */}
                                    {/* Wheel 1 (Front) */}
                                    <g className="animate-[wheel-spin_0.25s_linear_infinite]" style={{ transformOrigin: '98px 45px' }}>
                                        <circle cx="98" cy="45" r="9" fill="#070F2B" stroke="#B5945B" strokeWidth="2" />
                                        <circle cx="98" cy="45" r="3" fill="#FAF6F0" />
                                        <line x1="98" y1="36" x2="98" y2="54" stroke="#FAF6F0" strokeWidth="1" />
                                        <line x1="89" y1="45" x2="107" y2="45" stroke="#FAF6F0" strokeWidth="1" />
                                    </g>
                                    {/* Wheel 2 (Rear) */}
                                    <g className="animate-[wheel-spin_0.25s_linear_infinite]" style={{ transformOrigin: '25px 45px' }}>
                                        <circle cx="25" cy="45" r="9" fill="#070F2B" stroke="#B5945B" strokeWidth="2" />
                                        <circle cx="25" cy="45" r="3" fill="#FAF6F0" />
                                        <line x1="25" y1="36" x2="25" y2="54" stroke="#FAF6F0" strokeWidth="1" />
                                        <line x1="16" y1="45" x2="34" y2="45" stroke="#FAF6F0" strokeWidth="1" />
                                    </g>
                                    {/* Wheel 3 (Mid-Rear) */}
                                    <g className="animate-[wheel-spin_0.25s_linear_infinite]" style={{ transformOrigin: '48px 45px' }}>
                                        <circle cx="48" cy="45" r="9" fill="#070F2B" stroke="#B5945B" strokeWidth="2" />
                                        <circle cx="48" cy="45" r="3" fill="#FAF6F0" />
                                        <line x1="48" y1="36" x2="48" y2="54" stroke="#FAF6F0" strokeWidth="1" />
                                        <line x1="39" y1="45" x2="57" y2="45" stroke="#FAF6F0" strokeWidth="1" />
                                    </g>
                                </svg>
                            </div>

                            {/* Speeding Road Line */}
                            <div className="w-48 h-[2px] bg-white/20 mt-2 relative overflow-hidden">
                                <div className="absolute inset-0 bg-repeat-x bg-[linear-gradient(to_right,white_50%,transparent_50%)] bg-[length:12px_100%] animate-[road-slide_0.4s_linear_infinite]" />
                            </div>
                        </div>

                        {/* Right Column: Text Information */}
                        <div className="lg:col-span-7 flex flex-col justify-center space-y-4 text-center lg:text-left">
                            <span className="text-[10px] font-black uppercase tracking-widest text-[#FFCB05]">
                                Zeynix Instant Delivery
                            </span>
                            <h2 className="text-2xl md:text-4xl font-black uppercase tracking-tight leading-tight">
                                Fresh Fits.<br />
                                Delivered in 30 Mins.
                            </h2>
                            <p className="text-xs text-white/70 max-w-md mx-auto lg:mx-0 leading-relaxed font-semibold">
                                Need a quick style upgrade? Get your favorite streetwear essentials delivered straight to your door in 30 minutes or less. Rapid dispatch, premium packaging, zero delays.
                            </p>
                            <div className="pt-2">
                                <Link 
                                    href="/products/casual" 
                                    className="inline-flex items-center gap-2 bg-[#FFCB05] text-[#070F2B] py-3.5 px-6 rounded-xl font-bold uppercase tracking-wider text-[10px] shadow-md hover:bg-white hover:scale-105 active:scale-95 transition-all duration-300 cursor-pointer"
                                >
                                    Order Now
                                    <ArrowRight className="w-3.5 h-3.5" />
                                </Link>
                            </div>
                        </div>

                    </div>
                </div>
            </section>

            {/* 8. STYLE YOUR WAY / SOCIAL SECTION */}
            <section className="py-12 md:py-16 bg-[#FAF6F0] px-4 border-t border-[#070F2B]/5">
                <div className="container mx-auto text-center space-y-8 max-w-5xl">
                    <div>
                        <span className="text-[10px] font-black uppercase tracking-widest text-[#B5945B] block mb-0.5">Zeynix Atelier</span>
                        <h2 className="text-2xl md:text-3xl font-black uppercase tracking-tight text-[#070F2B]">
                            Style Your Way
                        </h2>
                        <p className="text-[11px] text-gray-500 font-semibold max-w-md mx-auto mt-2 leading-relaxed">
                            Discover curated streetwear looks from our community. Mention @zeynix.in to be featured in our lookbook collection.
                        </p>
                    </div>

                    {/* Social Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 sm:gap-4 max-w-4xl mx-auto">
                        {[
                            {
                                image: '/images/lookbook-1.jpg',
                                handle: '@zeynix.casual',
                                likes: '2.5k',
                                category: 'Oversized Hoodie'
                            },
                            {
                                image: '/images/lookbook-2.jpg',
                                handle: '@zeynix.leather',
                                likes: '1.8k',
                                category: 'Suede Bomber'
                            },
                            {
                                image: '/images/lookbook-3.jpg',
                                handle: '@zeynix.utility',
                                likes: '3.1k',
                                category: 'Utility Jacket'
                            },
                            {
                                image: '/images/lookbook-4.jpg',
                                handle: '@zeynix.denim',
                                likes: '2.9k',
                                category: 'Denim Classic'
                            }
                        ].map((item, idx) => (
                            <div 
                                key={idx} 
                                className="relative aspect-square rounded-2xl overflow-hidden shadow-md border border-[#070F2B]/5 group select-none cursor-pointer"
                            >
                                <Image 
                                    src={item.image} 
                                    alt={`Zeynix Lookbook ${item.category}`} 
                                    fill
                                    className="object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                                />
                                {/* Instagram Overlay */}
                                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-gradient-to-t from-[#070F2B]/90 via-[#070F2B]/40 to-transparent transition-all duration-300 backdrop-blur-xs flex flex-col justify-end p-4 text-left z-20">
                                    <span className="text-[10px] font-black tracking-widest text-[#FAF6F0] block uppercase">{item.handle}</span>
                                    <span className="text-[8px] font-black text-[#B5945B] block mt-0.5 uppercase tracking-wide">{item.category}</span>
                                    <div className="flex items-center gap-1 text-[9px] font-bold text-white/80 mt-2.5">
                                        <Heart className="w-3 h-3 text-red-500 fill-current" />
                                        <span>{item.likes}</span>
                                    </div>
                                    <div className="absolute top-4 right-4 w-7 h-7 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20">
                                        <Instagram className="w-3.5 h-3.5 text-[#FFCB05]" />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="pt-2">
                        <a 
                            target="_blank" 
                            href="https://www.instagram.com/zeynix.in" 
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 bg-[#070F2B] text-white py-3.5 px-6 rounded-none font-bold uppercase tracking-wider text-[10px] shadow-[3px_3px_0px_#B5945B] hover:shadow-[0px_0px_0px_#B5945B] hover:bg-[#B5945B] hover:text-[#070F2B] border border-[#070F2B] hover:border-[#B5945B] transition-all duration-300 cursor-pointer"
                        >
                            Follow @ZEYNIX
                            <Instagram className="w-3.5 h-3.5" />
                        </a>
                    </div>
                </div>
            </section>

            <Footer />

            {/* Wishlist Modal */}
            <WishlistConfirmationModal
                isOpen={showWishlistModal}
                onClose={() => setShowWishlistModal(false)}
                onGoToWishlist={() => {
                    setShowWishlistModal(false);
                    window.location.href = '/wishlist';
                }}
                productName={selectedProduct?.name || ''}
            />
        </div>
    );
}
