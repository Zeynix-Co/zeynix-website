'use client';

import { useState, useEffect, useRef } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import HeroSection from '@/components/home/HeroSection';
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

// Module-level client cache for instant return visits with 0ms delay
let clientHomeCache: {
    casualProducts: any[];
    newArrivals: any[];
} | null = null;

export default function HomePage() {
    const [casualProducts, setCasualProducts] = useState<any[]>(() => clientHomeCache?.casualProducts || []);
    const [newArrivals, setNewArrivals] = useState<any[]>(() => clientHomeCache?.newArrivals || []);
    const [isLoading, setIsLoading] = useState(!clientHomeCache);

    // Carousel State for New Arrivals
    const [carouselIndex, setCarouselIndex] = useState(0);
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
                // Slugs to exclude from showcase and arrivals
                const HALLOWEEN_SLUGS = [
                    'spooky-boo-graveyard-ghost-cream-tee',
                    'slashers-dream-play-scream-repeat-black-tee',
                    'kawaii-pink-bow-ghost-halloween-white-tee',
                    'mystic-haunted-mansion-harvest-moon-purple-tee',
                    'halloween-rip-still-dead-tee',
                    'spookie-peeking-cat-skeletons-tee',
                    'halloween-i-scream-spooky-season-black-tee',
                    'halloween-kawaii-pink-bow-ghosts-cherry-blossom-pink-tee'
                ];

                // Curated sequence for Section 1 (Streetwear Essentials) - Left to Right:
                // 1st: Zeynix & Co. Botanical Sunflower T-Shirt
                // 2nd: Zeynix 'Make Money Not Hoes' Oversized Streetwear T-Shirt
                // 3rd: Urban Grunge 'Hustle Never Settle - Stay Grinding' Oversized Black T-Shirt
                // 4th: Desi Pop 'Cutie Patola' Lotus Buttercream Yellow Oversized T-Shirt
                const STREETWEAR_FEATURED_SLUGS = [
                    'sunflower-collection-tee',
                    'make-money-not-hoes-tee',
                    'hustle-never-settle-stay-grinding-black-tee',
                    'cutie-patola-lotus-tee'
                ];

                const prodRes = await fetch('/api/customer/products?limit=100');
                const prodJson = await prodRes.json();
                if (prodJson.success && prodJson.data.products?.length > 0) {
                    const allProds = prodJson.data.products;

                    // Section 1: Exact 4 Streetwear Essentials in curated sequence (left to right)
                    const curatedStreetwear = STREETWEAR_FEATURED_SLUGS.map((slug) =>
                        allProds.find((p: any) =>
                            p.slug === slug ||
                            (slug === 'sunflower-collection-tee' && p.title?.toLowerCase().includes('botanical sunflower')) ||
                            (slug === 'make-money-not-hoes-tee' && p.title?.toLowerCase().includes('make money not hoes')) ||
                            (slug === 'hustle-never-settle-stay-grinding-black-tee' && p.title?.toLowerCase().includes('hustle never settle')) ||
                            (slug === 'cutie-patola-lotus-tee' && p.title?.toLowerCase().includes('cutie patola'))
                        )
                    ).filter(Boolean);

                    const isHalloweenSlug = (slug: string) =>
                        HALLOWEEN_SLUGS.includes(slug) || (slug || '').toLowerCase().includes('halloween');

                    const nonHalloween = allProds.filter(
                        (p: any) => !isHalloweenSlug(p.slug) &&
                                    !curatedStreetwear.some((cp: any) => cp.slug === p.slug)
                    );

                    const finalCasual = [...curatedStreetwear, ...nonHalloween].slice(0, 4);

                    // New arrivals: Use top products directly from allProds (excluding Halloween drops)
                    const filteredArrivals = allProds.filter(
                        (p: any) => !isHalloweenSlug(p.slug)
                    );
                    const finalArrivals = filteredArrivals.slice(0, 8);

                    setCasualProducts(finalCasual);
                    setNewArrivals(finalArrivals);

                    clientHomeCache = {
                        casualProducts: finalCasual,
                        newArrivals: finalArrivals
                    };
                }
            } catch (err) {
                console.error('Failed to load homepage products:', err);
            } finally {
                setIsLoading(false);
            }
        };
        loadHomeData();
    }, []);

    const restoredScrollRef = useRef(false);

    // Restore scroll position or highlight the product the user just visited on Homepage
    useEffect(() => {
        if (isLoading || casualProducts.length === 0 || restoredScrollRef.current) return;
        if (typeof window === 'undefined') return;

        try {
            const lastClickedId = sessionStorage.getItem('zeynix_last_clicked_product');
            const savedScroll = sessionStorage.getItem('zeynix_scroll_/');

            if (lastClickedId) {
                const timer = setTimeout(() => {
                    const el = document.getElementById(`product-card-${lastClickedId}`);
                    if (el) {
                        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
                        el.classList.add('ring-4', 'ring-[#B5945B]/80', 'ring-offset-2', 'transition-all');
                        setTimeout(() => {
                            el.classList.remove('ring-4', 'ring-[#B5945B]/80', 'ring-offset-2');
                        }, 2500);
                        restoredScrollRef.current = true;
                        sessionStorage.removeItem('zeynix_last_clicked_product');
                    } else if (savedScroll) {
                        const y = parseInt(savedScroll, 10);
                        if (!isNaN(y)) {
                            window.scrollTo({ top: y, behavior: 'smooth' });
                            restoredScrollRef.current = true;
                        }
                    }
                }, 120);
                return () => clearTimeout(timer);
            } else if (savedScroll) {
                const y = parseInt(savedScroll, 10);
                if (!isNaN(y) && y > 0) {
                    const timer = setTimeout(() => {
                        window.scrollTo({ top: y, behavior: 'smooth' });
                        restoredScrollRef.current = true;
                    }, 120);
                    return () => clearTimeout(timer);
                }
            }
        } catch (e) {
            // Ignore
        }
    }, [isLoading, casualProducts.length]);

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

            {/* 1. HERO SECTION */}
            <HeroSection />

            {/* 2. Floating rounded benefits panel separated cleanly from the Hero section */}
            <div className="relative z-20 mt-8 sm:mt-12 lg:mt-14 mb-6 sm:mb-8 max-w-6xl mx-auto px-3 sm:px-4">
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
                                sizes="(max-width: 1024px) 100vw, 50vw"
                                className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                            />

                            <div className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-md rounded-xl p-4 border border-[#070F2B]/10 flex items-center gap-3.5 z-20 shadow-lg">
                                <div className="w-9 h-9 rounded-full bg-[#070F2B] text-[#FFCB05] flex items-center justify-center text-[12px] font-black shadow-md flex-shrink-0">
                                    ★
                                </div>
                                <div>
                                    <span className="text-[10px] font-black uppercase block tracking-wider text-[#070F2B]">Bespoke Print Studio</span>
                                    <span className="text-[9px] text-gray-500 block leading-tight">High-end custom screen printing on luxury cotton</span>
                                </div>
                            </div>
                        </div>

                        {/* Right: Premium Dark Navy Panel */}
                        <div className="lg:col-span-6 bg-[#070F2B] text-white p-6 md:p-12 flex flex-col justify-center space-y-4 border-l border-white/5">
                            <span className="text-[10px] font-black uppercase tracking-widest text-[#FFCB05]">
                                Signature Print Studio
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
                                    href="/print-studio"
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

            {/* 4. STREETWEAR ESSENTIALS GRID (1st Section of Products) */}
            <section className="py-10 md:py-14 px-4 bg-white border-t border-b border-[#070F2B]/5 relative z-10">
                <div className="container mx-auto max-w-6xl">

                    {/* Header */}
                    <div className="flex items-end justify-between mb-8">
                        <div>
                            <span className="text-[10px] font-black uppercase tracking-widest text-[#FFCB05] block mb-0.5">Streetwear Atelier</span>
                            <h2 className="text-2xl md:text-3xl font-black uppercase tracking-tight text-[#070F2B]">
                                Streetwear Essentials
                            </h2>
                        </div>
                        <Link
                            href="/products/casual"
                            className="inline-flex items-center gap-1.5 sm:gap-2 px-3.5 py-2 sm:px-5 sm:py-2.5 rounded-xl bg-[#070F2B] text-white hover:bg-[#B5945B] hover:text-[#070F2B] font-extrabold text-xs sm:text-sm uppercase tracking-wider transition-all duration-300 shadow-sm hover:shadow-md active:scale-95 group cursor-pointer border border-[#070F2B] shrink-0"
                        >
                            <span>View All</span>
                            <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 group-hover:translate-x-1 transition-transform text-[#FFCB05] group-hover:text-[#070F2B]" />
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
                            No streetwear products available. Check back soon!
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

                    {/* Bottom CTA Button - especially prominent on mobile */}
                    <div className="mt-8 sm:mt-10 flex justify-center">
                        <Link
                            href="/products"
                            className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-3.5 sm:py-4 rounded-xl bg-[#070F2B] text-white hover:bg-[#B5945B] hover:text-[#070F2B] font-black text-xs sm:text-sm uppercase tracking-widest transition-all duration-300 shadow-[0_4px_14px_rgba(7,15,43,0.18)] hover:shadow-[0_6px_20px_rgba(181,148,91,0.3)] active:scale-95 group cursor-pointer border border-[#070F2B]"
                        >
                            <span>Explore All Streetwear Essentials</span>
                            <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform text-[#FFCB05] group-hover:text-[#070F2B]" />
                        </Link>
                    </div>

                </div>
            </section>

            {/* 7. FLASH DELIVERY WITHIN 3 DAYS PROMOTION BANNER */}
            <section className="py-12 sm:py-16 md:py-20 px-4 sm:px-6 lg:px-8 bg-[#FAF6F0] relative z-10 select-none">
                <style dangerouslySetInnerHTML={{
                    __html: `
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

                <div className="container mx-auto max-w-6xl">
                    <div className="bg-[#070F2B] text-white rounded-3xl p-6 sm:p-10 md:p-12 shadow-[0_25px_60px_rgba(7,15,43,0.22)] border border-white/10 relative overflow-hidden">

                        {/* Decorative circles in background */}
                        <div className="absolute top-1/2 left-10 -translate-y-1/2 w-48 h-48 border border-white/5 rounded-full pointer-events-none" />
                        <div className="absolute top-1/2 right-10 -translate-y-1/2 w-72 h-72 border border-white/5 rounded-full pointer-events-none" />

                        <div className="relative z-10">
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
                                            <text x="42.5" y="34" fill="#B5945B" fontSize="4.5" fontWeight="900" textAnchor="middle" letterSpacing="0.3">3-DAY FLASH EXPRESS</text>

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
                                        Zeynix Flash Delivery
                                    </span>
                                    <h2 className="text-2xl md:text-4xl font-black uppercase tracking-tight leading-tight">
                                        Fresh Fits.<br />
                                        Delivered Within 3 Days.
                                    </h2>
                                    <p className="text-xs text-white/70 max-w-md mx-auto lg:mx-0 leading-relaxed font-semibold">
                                        Need a fresh style upgrade? Get your favorite streetwear essentials delivered straight to your door with our express flash delivery within 3 days. Rapid dispatch, premium packaging, zero delays.
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
                                image: '/images/instagram/marlboro.jpg',
                                postUrl: 'https://www.instagram.com/p/DeCwkuSiGjQ/',
                                title: "Marlboro • Die Anyway",
                                handle: '@zeynix.in',
                                likes: '3.4k',
                                category: '240 GSM Graphic Tee'
                            },
                            {
                                image: '/images/instagram/snakes-kiss.jpg',
                                postUrl: 'https://www.instagram.com/p/DeCv8FPiDVn/',
                                title: "Snakes Don't Hiss... Kiss",
                                handle: '@zeynix.in',
                                likes: '2.8k',
                                category: '240 GSM Oversized Fit'
                            },
                            {
                                image: '/images/instagram/kaun-talha.jpg',
                                postUrl: 'https://www.instagram.com/p/DeCvXlJE49M/',
                                title: 'Kaun Talha? Vintage Acid',
                                handle: '@zeynix.in',
                                likes: '4.1k',
                                category: '240 GSM Mineral Wash'
                            },
                            {
                                image: '/images/instagram/dead-fish.jpg',
                                postUrl: 'https://www.instagram.com/p/DeB8vIqGjpR/',
                                title: 'Only DEAD Fish Go With Flow',
                                handle: '@zeynix.in',
                                likes: '3.9k',
                                category: '240 GSM Japanese Koi'
                            }
                        ].map((item, idx) => (
                            <a
                                key={idx}
                                href={item.postUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label={`View ${item.title} post on Instagram`}
                                className="relative aspect-square rounded-2xl overflow-hidden shadow-md border border-[#070F2B]/5 group select-none cursor-pointer block"
                            >
                                <Image
                                    src={item.image}
                                    alt={`Zeynix Instagram Post - ${item.title}`}
                                    fill
                                    sizes="(max-width: 640px) 50vw, 25vw"
                                    loading="lazy"
                                    className="object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                                />
                                {/* Instagram Overlay */}
                                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-gradient-to-t from-[#070F2B]/95 via-[#070F2B]/50 to-transparent transition-all duration-300 backdrop-blur-xs flex flex-col justify-end p-3.5 sm:p-4 text-left z-20">
                                    <span className="text-[10px] font-black tracking-widest text-[#FAF6F0] block uppercase">{item.handle}</span>
                                    <span className="text-[9px] font-black text-[#FFCB05] block mt-0.5 uppercase tracking-wide leading-tight">{item.title}</span>
                                    <span className="text-[8px] font-semibold text-white/70 block mt-0.5">{item.category}</span>
                                    <div className="flex items-center justify-between mt-2.5">
                                        <div className="flex items-center gap-1 text-[9px] font-bold text-white/90">
                                            <Heart className="w-3 h-3 text-red-500 fill-current" />
                                            <span>{item.likes}</span>
                                        </div>
                                        <span className="text-[8px] font-bold uppercase tracking-wider text-[#FFCB05] flex items-center gap-0.5">
                                            View Post ↗
                                        </span>
                                    </div>
                                    <div className="absolute top-3.5 right-3.5 sm:top-4 sm:right-4 w-7 h-7 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20 group-hover:bg-[#FFCB05] group-hover:text-[#070F2B] text-[#FFCB05] transition-colors">
                                        <Instagram className="w-3.5 h-3.5" />
                                    </div>
                                </div>
                            </a>
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
