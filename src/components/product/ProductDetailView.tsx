'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
    Star, Heart, Share2, ShieldCheck, Truck, RotateCcw,
    ChevronLeft, ChevronRight, Check, ShoppingCart, Zap,
    Ruler, Sparkles, ZoomIn, X
} from 'lucide-react';
import { Product } from '@/data/products';
import { APP_CONFIG } from '@/lib/constants';
import { productAPI } from '@/lib/api';
import useCartStore from '@/store/cartStore';
import { useAuthStore, useWishlistStore } from '@/store';
import ProductCard from '@/components/product/ProductCard';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

interface ProductDetailViewProps {
    productIdOrSlug: string;
    categoryParam?: string;
}

export default function ProductDetailView({ productIdOrSlug, categoryParam }: ProductDetailViewProps) {
    const router = useRouter();
    const { addToCart, isInCart } = useCartStore();
    const { isAuthenticated } = useAuthStore();
    const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlistStore();

    const [product, setProduct] = useState<Product | null>(null);
    const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
    const [selectedSize, setSelectedSize] = useState<string>('');
    const [selectedImageIndex, setSelectedImageIndex] = useState<number>(0);
    const [quantity, setQuantity] = useState<number>(1);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    // Zoom & Lightbox state
    const [isZooming, setIsZooming] = useState<boolean>(false);
    const [zoomPosition, setZoomPosition] = useState<{ x: number; y: number }>({ x: 50, y: 50 });
    const [isLightboxOpen, setIsLightboxOpen] = useState<boolean>(false);
    const [isSizeGuideOpen, setIsSizeGuideOpen] = useState<boolean>(false);
    const [copiedLink, setCopiedLink] = useState<boolean>(false);

    // Cart action states
    const [isAddingToCart, setIsAddingToCart] = useState<boolean>(false);
    const [justAddedToCart, setJustAddedToCart] = useState<boolean>(false);
    const [isBuyingNow, setIsBuyingNow] = useState<boolean>(false);

    const imageContainerRef = useRef<HTMLDivElement>(null);

    // Fetch product details
    useEffect(() => {
        let isMounted = true;

        const loadProduct = async () => {
            try {
                setIsLoading(true);
                setError(null);
                const response = await productAPI.getProduct(productIdOrSlug);

                if (response.success && response.data) {
                    if (!isMounted) return;
                    setProduct(response.data);

                    // Default to first size that is in stock
                    if (response.data.sizes && response.data.sizes.length > 0) {
                        const inStockSize = response.data.sizes.find(s => s.inStock);
                        setSelectedSize(inStockSize ? inStockSize.size : response.data.sizes[0].size);
                    } else if (response.data.size && response.data.size.length > 0) {
                        setSelectedSize(response.data.size[0]);
                    } else {
                        setSelectedSize('M');
                    }
                } else {
                    setError('Product not found');
                }
            } catch (err: any) {
                console.error('Error fetching product:', err);
                if (isMounted) setError(err.message || 'Failed to load product');
            } finally {
                if (isMounted) setIsLoading(false);
            }
        };

        if (productIdOrSlug) {
            loadProduct();
        }

        return () => {
            isMounted = false;
        };
    }, [productIdOrSlug]);

    // Fetch related products from active catalog
    useEffect(() => {
        const fetchRelated = async () => {
            try {
                const response = await productAPI.getAllProducts({ limit: 4 });
                if (response.success && response.data?.products) {
                    // Filter out current product
                    const others = response.data.products.filter(
                        p => p.id !== productIdOrSlug && p.slug !== productIdOrSlug
                    );
                    setRelatedProducts(others.slice(0, 4));
                }
            } catch (e) {
                console.error('Error loading related products:', e);
            }
        };

        fetchRelated();
    }, [productIdOrSlug]);

    if (isLoading) {
        return (
            <div className="min-h-screen bg-[#FBF9F5] flex flex-col justify-between">
                <Header />
                <div className="flex-1 flex flex-col items-center justify-center p-8">
                    <div className="w-12 h-12 border-3 border-[#070F2B] border-t-[#B5945B] rounded-full animate-spin mb-4" />
                    <p className="text-xs font-black tracking-widest text-[#070F2B] uppercase">
                        Loading Luxury Collection...
                    </p>
                </div>
                <Footer />
            </div>
        );
    }

    if (error || !product) {
        return (
            <div className="min-h-screen bg-[#FBF9F5] flex flex-col justify-between">
                <Header />
                <div className="flex-1 max-w-lg mx-auto flex flex-col items-center justify-center text-center p-8">
                    <div className="w-16 h-16 bg-red-50 text-red-600 rounded-full flex items-center justify-center mb-4 font-black text-2xl">
                        !
                    </div>
                    <h1 className="text-2xl font-black uppercase tracking-tight text-[#070F2B] mb-2">
                        Product Unavailable
                    </h1>
                    <p className="text-sm text-gray-500 mb-6">
                        {error || "The requested item is currently not available in our collection."}
                    </p>
                    <Link
                        href="/products"
                        className="px-6 py-3 bg-[#070F2B] text-white hover:bg-[#B5945B] hover:text-[#070F2B] text-xs font-black uppercase tracking-wider rounded-xl transition-all shadow-md"
                    >
                        Browse All Products
                    </Link>
                </div>
                <Footer />
            </div>
        );
    }

    // Prepare images array
    const productImages: string[] = (product.images && product.images.length > 0)
        ? product.images
        : [product.mainImage || product.image || '/images/products/placeholder.jpg'];

    const currentImage = productImages[selectedImageIndex] || productImages[0];

    const originalPrice = product.originalPrice || product.price || 1999;
    const currentPrice = product.price || 999;
    const hasDiscount = originalPrice > currentPrice;
    const discountPercent = product.discount || (hasDiscount
        ? Math.round(((originalPrice - currentPrice) / originalPrice) * 100)
        : 0);

    const isWishlisted = isInWishlist(product.id, selectedSize || 'M');
    const isAlreadyInCart = isInCart(product.id, selectedSize);

    // Size data & stock computation
    const currentSizeData = product.sizes?.find(s => s.size === selectedSize);
    const sizeStock = currentSizeData?.stock !== undefined ? currentSizeData.stock : 100;
    const sizeInStock = currentSizeData?.inStock !== undefined ? currentSizeData.inStock : true;

    // Handle mouse move for interactive zoom
    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!imageContainerRef.current) return;
        const { left, top, width, height } = imageContainerRef.current.getBoundingClientRect();
        const x = Math.max(0, Math.min(100, ((e.clientX - left) / width) * 100));
        const y = Math.max(0, Math.min(100, ((e.clientY - top) / height) * 100));
        setZoomPosition({ x, y });
    };

    const nextImage = () => {
        setSelectedImageIndex((prev) => (prev === productImages.length - 1 ? 0 : prev + 1));
    };

    const prevImage = () => {
        setSelectedImageIndex((prev) => (prev === 0 ? productImages.length - 1 : prev - 1));
    };

    const handleAddToCart = async () => {
        if (!isAuthenticated) {
            router.push('/login');
            return;
        }

        if (!selectedSize || !sizeInStock || isAddingToCart) return;

        setIsAddingToCart(true);

        try {
            await new Promise((res) => setTimeout(res, 400));

            addToCart({
                product: {
                    id: product.id,
                    title: product.name,
                    images: productImages,
                    price: originalPrice,
                    discountPrice: currentPrice
                },
                size: selectedSize as any,
                quantity: quantity,
                totalPrice: currentPrice * quantity
            });

            setIsAddingToCart(false);
            setJustAddedToCart(true);
            setTimeout(() => setJustAddedToCart(false), 3000);
        } catch (e) {
            console.error('Add to cart error:', e);
            setIsAddingToCart(false);
        }
    };

    const handleBuyNow = async () => {
        if (!isAuthenticated) {
            router.push('/login');
            return;
        }

        if (!selectedSize || !sizeInStock || isBuyingNow) return;

        setIsBuyingNow(true);

        try {
            addToCart({
                product: {
                    id: product.id,
                    title: product.name,
                    images: productImages,
                    price: originalPrice,
                    discountPrice: currentPrice
                },
                size: selectedSize as any,
                quantity: quantity,
                totalPrice: currentPrice * quantity
            });

            router.push('/checkout');
        } catch (e) {
            console.error('Buy Now error:', e);
            setIsBuyingNow(false);
        }
    };

    const toggleWishlist = () => {
        if (isWishlisted) {
            removeFromWishlist(product.id, selectedSize || 'M');
        } else {
            addToWishlist({
                id: product.id,
                title: product.name,
                images: productImages,
                price: currentPrice,
                originalPrice: originalPrice,
                discountPrice: currentPrice,
                category: product.category,
                brand: product.brand || 'Zeynix'
            }, selectedSize || 'M');
        }
    };

    const handleShare = () => {
        if (typeof window !== 'undefined') {
            if (navigator.share) {
                navigator.share({
                    title: `Zeynix - ${product.name}`,
                    text: product.description || `Check out ${product.name} on Zeynix`,
                    url: window.location.href,
                }).catch(() => {});
            } else {
                navigator.clipboard.writeText(window.location.href);
                setCopiedLink(true);
                setTimeout(() => setCopiedLink(false), 2500);
            }
        }
    };

    // Label for thumbnail
    const getThumbnailLabel = (index: number) => {
        const labels = ['Front View', 'Back View', 'Angle View', 'Graphic Detail', 'Full Showcase'];
        return labels[index] || `View ${index + 1}`;
    };

    return (
        <div className="min-h-screen bg-[#FAF8F5] text-[#070F2B]">
            <Header />

            {/* Breadcrumbs Header */}
            <div className="bg-white/80 border-b border-gray-200/80 backdrop-blur-xs sticky top-16 z-30">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between text-[11px] font-bold text-gray-500 uppercase tracking-wider">
                    <div className="flex items-center gap-2 truncate">
                        <Link href="/" className="hover:text-[#B5945B] transition-colors">Home</Link>
                        <span>/</span>
                        <Link href="/products" className="hover:text-[#B5945B] transition-colors">Products</Link>
                        <span>/</span>
                        <Link href={`/products/${product.category.toLowerCase()}`} className="hover:text-[#B5945B] transition-colors">
                            {product.category}
                        </Link>
                        <span>/</span>
                        <span className="text-[#070F2B] font-extrabold truncate max-w-[200px] sm:max-w-md">
                            {product.name}
                        </span>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                        <button
                            onClick={handleShare}
                            className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-[#070F2B] hover:text-[#B5945B] transition-colors cursor-pointer"
                        >
                            <Share2 className="w-3.5 h-3.5" />
                            <span className="hidden sm:inline">{copiedLink ? 'Link Copied!' : 'Share'}</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* Main Product Showcase Section */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 md:py-12">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-start">

                    {/* ================= LEFT SIDE: IMAGE GALLERY ================= */}
                    <div className="lg:col-span-7 flex flex-col-reverse lg:flex-row gap-4 items-start">
                        
                        {/* Vertical Thumbnail Strip (Desktop) / Horizontal (Mobile) */}
                        {productImages.length > 1 && (
                            <div className="w-full lg:w-24 shrink-0 flex lg:flex-col gap-2.5 overflow-x-auto lg:overflow-y-auto max-h-[620px] pb-2 lg:pb-0 scrollbar-none">
                                {productImages.map((img, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => setSelectedImageIndex(idx)}
                                        className={`group relative w-16 h-20 sm:w-20 sm:h-24 lg:w-full lg:h-28 rounded-xl overflow-hidden bg-[#F2EFE9] border-2 transition-all duration-200 shrink-0 cursor-pointer p-1 ${
                                            selectedImageIndex === idx
                                                ? 'border-[#070F2B] shadow-md ring-2 ring-[#070F2B]/10 scale-102'
                                                : 'border-transparent hover:border-gray-300 opacity-80 hover:opacity-100'
                                        }`}
                                        title={getThumbnailLabel(idx)}
                                    >
                                        <Image
                                            src={img}
                                            alt={`${product.name} view ${idx + 1}`}
                                            fill
                                            sizes="100px"
                                            className="object-contain p-1"
                                            quality={80}
                                        />
                                        <span className="absolute bottom-0 inset-x-0 bg-[#070F2B]/85 text-[#FAF8F5] text-[7px] font-black uppercase text-center py-0.5 tracking-tighter opacity-0 group-hover:opacity-100 transition-opacity">
                                            {getThumbnailLabel(idx)}
                                        </span>
                                    </button>
                                ))}
                            </div>
                        )}

                        {/* Main Image Stage */}
                        <div className="flex-1 w-full relative">
                            <div
                                ref={imageContainerRef}
                                onMouseEnter={() => setIsZooming(true)}
                                onMouseLeave={() => setIsZooming(false)}
                                onMouseMove={handleMouseMove}
                                onClick={() => setIsLightboxOpen(true)}
                                className="relative aspect-[4/5] sm:aspect-square w-full rounded-2xl bg-[#F4F1EA] border border-gray-200/80 overflow-hidden shadow-sm cursor-zoom-in flex items-center justify-center p-4 sm:p-8 select-none group"
                            >
                                {/* Subtle ambient radial lighting */}
                                <div className="absolute inset-0 bg-radial from-white/60 via-transparent to-black/[0.04] pointer-events-none" />

                                {/* Main High-Res Image */}
                                <div className="relative w-full h-full">
                                    <Image
                                        src={currentImage}
                                        alt={product.name}
                                        fill
                                        sizes="(max-width: 1024px) 100vw, 60vw"
                                        priority
                                        quality={95}
                                        className={`object-contain transition-transform duration-200 ${
                                            isZooming ? 'scale-150' : 'scale-100'
                                        }`}
                                        style={
                                            isZooming
                                                ? {
                                                    transformOrigin: `${zoomPosition.x}% ${zoomPosition.y}%`,
                                                }
                                                : undefined
                                        }
                                    />
                                </div>

                                {/* Floating Badges on Stage */}
                                <div className="absolute top-4 left-4 flex flex-col gap-2 z-20 pointer-events-none">
                                    {discountPercent > 0 && (
                                        <span className="bg-[#DC2626] text-white text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full shadow-md">
                                            -{discountPercent}% OFF
                                        </span>
                                    )}
                                    <span className="bg-[#070F2B] text-[#E5D7B5] text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full shadow-md border border-white/10">
                                        {product.label || product.productFit || 'OVERSIZED FIT'}
                                    </span>
                                </div>

                                {/* Click to Enlarge Cue */}
                                <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-xs text-[#070F2B] text-[10px] font-black uppercase tracking-wider px-2.5 py-1.5 rounded-xl shadow-md border border-gray-200 flex items-center gap-1.5 opacity-90 group-hover:opacity-100 transition-opacity">
                                    <ZoomIn className="w-3.5 h-3.5" />
                                    <span className="hidden sm:inline">Click to Enlarge</span>
                                </div>

                                {/* Navigation Arrows */}
                                {productImages.length > 1 && (
                                    <>
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                prevImage();
                                            }}
                                            className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/95 hover:bg-white text-[#070F2B] shadow-lg flex items-center justify-center transition-all duration-200 hover:scale-110 active:scale-95 border border-gray-200 z-20 cursor-pointer"
                                            aria-label="Previous view"
                                        >
                                            <ChevronLeft className="w-5 h-5" />
                                        </button>
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                nextImage();
                                            }}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/95 hover:bg-white text-[#070F2B] shadow-lg flex items-center justify-center transition-all duration-200 hover:scale-110 active:scale-95 border border-gray-200 z-20 cursor-pointer"
                                            aria-label="Next view"
                                        >
                                            <ChevronRight className="w-5 h-5" />
                                        </button>
                                    </>
                                )}
                            </div>

                            {/* View caption */}
                            <div className="mt-2.5 flex items-center justify-between text-[10px] font-extrabold uppercase tracking-widest text-gray-400 px-1">
                                <span>Showing: {getThumbnailLabel(selectedImageIndex)}</span>
                                <span>{selectedImageIndex + 1} of {productImages.length} Views</span>
                            </div>
                        </div>
                    </div>

                    {/* ================= RIGHT SIDE: PRODUCT INFORMATION ================= */}
                    <div className="lg:col-span-5 flex flex-col space-y-6">

                        {/* Brand & Collection Header */}
                        <div>
                            <div className="flex items-center gap-2 mb-2">
                                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#B5945B]/15 text-[#8E713E] text-[10px] font-black uppercase tracking-widest rounded-full border border-[#B5945B]/30">
                                    <Sparkles className="w-3 h-3 text-[#B5945B]" />
                                    {product.brand || 'ZEYNIX'} • OFFICIAL COLLECTION
                                </span>
                                {product.featured && (
                                    <span className="px-2.5 py-1 bg-emerald-100 text-emerald-800 text-[9px] font-black uppercase tracking-widest rounded-full">
                                        LIMITED EDITION
                                    </span>
                                )}
                            </div>

                            {/* Title */}
                            <h1 className="text-2xl sm:text-3xl md:text-4xl font-black uppercase tracking-tight text-[#070F2B] leading-tight mb-2.5">
                                {product.name}
                            </h1>

                            {/* Ratings & Reviews */}
                            <div className="flex items-center gap-3">
                                <div className="flex items-center gap-1 bg-amber-50 border border-amber-200/60 px-2 py-0.5 rounded-md">
                                    <div className="flex items-center">
                                        {[...Array(5)].map((_, i) => (
                                            <Star
                                                key={i}
                                                className={`w-3.5 h-3.5 ${
                                                    i < Math.floor(product.rating || 5)
                                                        ? 'text-amber-500 fill-amber-500'
                                                        : 'text-gray-200'
                                                }`}
                                            />
                                        ))}
                                    </div>
                                    <span className="text-xs font-black text-amber-900 ml-1">
                                        {product.rating || 4.9}
                                    </span>
                                </div>
                                <span className="text-xs font-bold text-gray-500">
                                    ({product.totalRatings || 128} Verified Reviews)
                                </span>
                            </div>
                        </div>

                        {/* Price & Savings Box */}
                        <div className="p-4 rounded-2xl bg-white border border-gray-200 shadow-xs">
                            <div className="flex items-baseline gap-3">
                                <span className="text-3xl sm:text-4xl font-black text-[#070F2B] tracking-tight">
                                    {APP_CONFIG.currency}{currentPrice.toLocaleString('en-IN')}
                                </span>
                                {hasDiscount && (
                                    <span className="text-base sm:text-lg text-gray-400 line-through font-bold">
                                        {APP_CONFIG.currency}{originalPrice.toLocaleString('en-IN')}
                                    </span>
                                )}
                                {discountPercent > 0 && (
                                    <span className="px-2.5 py-1 bg-emerald-500 text-white text-[11px] font-black uppercase tracking-wider rounded-lg shadow-xs">
                                        SAVE {discountPercent}%
                                    </span>
                                )}
                            </div>
                            <p className="text-[11px] font-bold text-gray-500 mt-1.5">
                                Inclusive of all taxes • Free shipping on orders over ₹999
                            </p>
                        </div>

                        {/* Description Summary */}
                        {product.description && (
                            <div className="text-xs sm:text-sm text-gray-600 leading-relaxed font-medium">
                                <p>{product.description}</p>
                            </div>
                        )}

                        {/* Size Selection */}
                        <div className="space-y-3 pt-2">
                            <div className="flex items-center justify-between">
                                <span className="text-xs font-black uppercase tracking-wider text-[#070F2B] flex items-center gap-1.5">
                                    Select Size:
                                    <span className="text-[#B5945B] font-black">{selectedSize}</span>
                                </span>
                                <button
                                    onClick={() => setIsSizeGuideOpen(true)}
                                    className="text-[11px] font-black uppercase tracking-wider text-gray-500 hover:text-[#070F2B] flex items-center gap-1 cursor-pointer transition-colors border-b border-gray-300 pb-0.5"
                                >
                                    <Ruler className="w-3.5 h-3.5" />
                                    Size Guide
                                </button>
                            </div>

                            {/* Size Buttons Grid */}
                            <div className="grid grid-cols-6 gap-2">
                                {(product.sizes && product.sizes.length > 0 ? product.sizes : [
                                    { size: 'XS', stock: 50, inStock: true },
                                    { size: 'S', stock: 80, inStock: true },
                                    { size: 'M', stock: 140, inStock: true },
                                    { size: 'L', stock: 160, inStock: true },
                                    { size: 'XL', stock: 110, inStock: true },
                                    { size: 'XXL', stock: 65, inStock: true },
                                ]).map((s) => {
                                    const isSelected = selectedSize === s.size;
                                    const isAvailable = s.inStock && s.stock > 0;

                                    return (
                                        <button
                                            key={s.size}
                                            type="button"
                                            disabled={!isAvailable}
                                            onClick={() => setSelectedSize(s.size)}
                                            className={`h-12 rounded-xl text-xs font-black uppercase transition-all duration-200 flex flex-col items-center justify-center border cursor-pointer relative ${
                                                isSelected
                                                    ? 'bg-[#070F2B] text-white border-[#070F2B] shadow-md scale-103'
                                                    : isAvailable
                                                        ? 'bg-white text-gray-800 border-gray-200 hover:border-[#070F2B]/60 hover:bg-gray-50'
                                                        : 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed line-through'
                                            }`}
                                        >
                                            <span>{s.size}</span>
                                            {s.stock > 0 && s.stock <= 10 && (
                                                <span className="text-[7px] text-amber-500 font-bold uppercase tracking-tighter">
                                                    Few left
                                                </span>
                                            )}
                                        </button>
                                    );
                                })}
                            </div>

                            {/* Stock Indicator Banner */}
                            <div className="flex items-center gap-2 text-xs font-bold pt-1">
                                {sizeInStock ? (
                                    <div className="flex items-center gap-1.5 text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200/60 w-full">
                                        <Zap className="w-3.5 h-3.5 text-emerald-600 fill-emerald-600" />
                                        <span>In Stock • Ready to dispatch in 24 hours ({sizeStock} pieces remaining)</span>
                                    </div>
                                ) : (
                                    <div className="text-red-700 bg-red-50 px-3 py-1.5 rounded-lg border border-red-200/60 w-full">
                                        Currently Out of Stock in this size
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Quantity & CTA Buttons */}
                        <div className="space-y-3 pt-2">
                            <div className="flex items-center gap-3">
                                {/* Quantity Stepper */}
                                <div className="flex items-center bg-white border border-gray-200 rounded-xl h-12 px-2 shadow-xs shrink-0">
                                    <button
                                        type="button"
                                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                        disabled={quantity <= 1}
                                        className="w-8 h-full flex items-center justify-center text-lg font-black text-gray-600 hover:text-[#070F2B] disabled:opacity-30 cursor-pointer"
                                    >
                                        -
                                    </button>
                                    <span className="w-8 text-center font-black text-sm text-[#070F2B]">
                                        {quantity}
                                    </span>
                                    <button
                                        type="button"
                                        onClick={() => setQuantity(Math.min(sizeStock, quantity + 1))}
                                        disabled={quantity >= sizeStock}
                                        className="w-8 h-full flex items-center justify-center text-lg font-black text-gray-600 hover:text-[#070F2B] disabled:opacity-30 cursor-pointer"
                                    >
                                        +
                                    </button>
                                </div>

                                {/* Add to Cart Button */}
                                <button
                                    onClick={handleAddToCart}
                                    disabled={!sizeInStock || isAddingToCart}
                                    className={`flex-1 h-12 px-5 rounded-xl font-black uppercase tracking-wider text-xs transition-all duration-300 flex items-center justify-center gap-2 shadow-md cursor-pointer active:scale-98 ${
                                        justAddedToCart
                                            ? 'bg-emerald-600 text-white'
                                            : isAlreadyInCart
                                                ? 'bg-[#070F2B] text-white hover:bg-[#B5945B] hover:text-[#070F2B]'
                                                : 'bg-[#070F2B] hover:bg-[#B5945B] text-white hover:text-[#070F2B] border border-[#070F2B] hover:border-[#B5945B]'
                                    }`}
                                >
                                    {isAddingToCart ? (
                                        <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                                    ) : justAddedToCart ? (
                                        <>
                                            <Check className="w-4 h-4" />
                                            <span>Added To Cart!</span>
                                        </>
                                    ) : isAlreadyInCart ? (
                                        <>
                                            <ShoppingCart className="w-4 h-4" />
                                            <span>Add More ({selectedSize})</span>
                                        </>
                                    ) : (
                                        <>
                                            <ShoppingCart className="w-4 h-4" />
                                            <span>Add to Cart</span>
                                        </>
                                    )}
                                </button>

                                {/* Wishlist Heart */}
                                <button
                                    onClick={toggleWishlist}
                                    className={`w-12 h-12 rounded-xl border flex items-center justify-center transition-all duration-200 cursor-pointer shadow-xs ${
                                        isWishlisted
                                            ? 'bg-red-50 text-red-600 border-red-200'
                                            : 'bg-white text-gray-500 border-gray-200 hover:text-red-500 hover:border-red-200'
                                    }`}
                                    aria-label="Wishlist"
                                >
                                    <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-red-500 text-red-500' : ''}`} />
                                </button>
                            </div>

                            {/* Buy Now Button */}
                            <button
                                onClick={handleBuyNow}
                                disabled={!sizeInStock || isBuyingNow}
                                className="w-full h-12 rounded-xl bg-[#FFCB05] hover:bg-[#E5B700] text-[#070F2B] font-black uppercase tracking-wider text-xs transition-all duration-300 flex items-center justify-center gap-2 shadow-md cursor-pointer active:scale-98"
                            >
                                {isBuyingNow ? (
                                    <div className="w-4 h-4 border-2 border-[#070F2B] border-t-transparent rounded-full animate-spin" />
                                ) : (
                                    <>
                                        <Zap className="w-4 h-4 fill-current" />
                                        <span>Buy Now — Instant Checkout</span>
                                    </>
                                )}
                            </button>
                        </div>

                        {/* Value Proposition & Quality Guarantees */}
                        <div className="grid grid-cols-2 gap-3 pt-4 border-t border-gray-200">
                            <div className="flex items-center gap-3 p-3 bg-white rounded-xl border border-gray-200">
                                <Truck className="w-5 h-5 text-[#B5945B] shrink-0" />
                                <div>
                                    <p className="text-[11px] font-black uppercase tracking-wide text-[#070F2B]">Fast Delivery</p>
                                    <p className="text-[10px] text-gray-500 font-medium">Ships within 24 Hours</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 p-3 bg-white rounded-xl border border-gray-200">
                                <RotateCcw className="w-5 h-5 text-[#B5945B] shrink-0" />
                                <div>
                                    <p className="text-[11px] font-black uppercase tracking-wide text-[#070F2B]">7-Day Returns</p>
                                    <p className="text-[10px] text-gray-500 font-medium">Hassle-free Exchanges</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 p-3 bg-white rounded-xl border border-gray-200">
                                <ShieldCheck className="w-5 h-5 text-[#B5945B] shrink-0" />
                                <div>
                                    <p className="text-[11px] font-black uppercase tracking-wide text-[#070F2B]">100% Genuine</p>
                                    <p className="text-[10px] text-gray-500 font-medium">240 GSM Combed Cotton</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 p-3 bg-white rounded-xl border border-gray-200">
                                <Sparkles className="w-5 h-5 text-[#B5945B] shrink-0" />
                                <div>
                                    <p className="text-[11px] font-black uppercase tracking-wide text-[#070F2B]">Secure Checkout</p>
                                    <p className="text-[10px] text-gray-500 font-medium">Razorpay & UPI Verified</p>
                                </div>
                            </div>
                        </div>

                        {/* Product Technical Specifications */}
                        <div className="bg-white rounded-2xl p-5 border border-gray-200 shadow-xs space-y-3">
                            <h3 className="text-xs font-black uppercase tracking-wider text-[#070F2B]">
                                Product Details & Specifications
                            </h3>
                            <div className="grid grid-cols-2 gap-y-2.5 text-xs">
                                <div>
                                    <span className="text-gray-400 font-bold block text-[10px] uppercase">Fabric</span>
                                    <span className="font-extrabold text-[#070F2B]">100% Combed Cotton (240 GSM)</span>
                                </div>
                                <div>
                                    <span className="text-gray-400 font-bold block text-[10px] uppercase">Fit Type</span>
                                    <span className="font-extrabold text-[#070F2B]">{product.productFit || 'Oversized Boxy Silhouette'}</span>
                                </div>
                                <div>
                                    <span className="text-gray-400 font-bold block text-[10px] uppercase">Print Technique</span>
                                    <span className="font-extrabold text-[#070F2B]">High-Density Screen Graphic</span>
                                </div>
                                <div>
                                    <span className="text-gray-400 font-bold block text-[10px] uppercase">Origin</span>
                                    <span className="font-extrabold text-[#070F2B]">Proudly Made in India</span>
                                </div>
                                <div>
                                    <span className="text-gray-400 font-bold block text-[10px] uppercase">Neckline</span>
                                    <span className="font-extrabold text-[#070F2B]">Lycra Ribbed Crew Neck</span>
                                </div>
                                <div>
                                    <span className="text-gray-400 font-bold block text-[10px] uppercase">Wash Care</span>
                                    <span className="font-extrabold text-[#070F2B]">Machine wash cold, inside out</span>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>

                {/* ================= RELATED PRODUCTS ================= */}
                {relatedProducts.length > 0 && (
                    <section className="mt-16 sm:mt-24 pt-12 border-t border-gray-200">
                        <div className="flex items-end justify-between mb-8">
                            <div>
                                <span className="text-[10px] font-black uppercase tracking-widest text-[#B5945B] block mb-1">
                                    More From Zeynix
                                </span>
                                <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-[#070F2B]">
                                    Complete The Look
                                </h2>
                            </div>
                            <Link
                                href="/products"
                                className="text-xs font-black uppercase tracking-wider text-[#070F2B] hover:text-[#B5945B] transition-colors border-b-2 border-[#070F2B] pb-0.5"
                            >
                                View All Collection
                            </Link>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-6">
                            {relatedProducts.map((rel) => (
                                <ProductCard key={rel.id} product={rel} />
                            ))}
                        </div>
                    </section>
                )}
            </main>

            <Footer />

            {/* ================= LIGHTBOX MODAL ================= */}
            {isLightboxOpen && (
                <div
                    className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4 backdrop-blur-sm"
                    onClick={() => setIsLightboxOpen(false)}
                >
                    <button
                        onClick={() => setIsLightboxOpen(false)}
                        className="absolute top-6 right-6 w-10 h-10 rounded-full bg-white/20 hover:bg-white text-white hover:text-black flex items-center justify-center transition-all cursor-pointer z-50"
                        aria-label="Close"
                    >
                        <X className="w-6 h-6" />
                    </button>

                    <div
                        className="relative max-w-4xl max-h-[85vh] w-full h-full flex items-center justify-center"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <Image
                            src={currentImage}
                            alt={product.name}
                            fill
                            className="object-contain"
                            quality={100}
                        />

                        {/* Arrows in Lightbox */}
                        {productImages.length > 1 && (
                            <>
                                <button
                                    onClick={prevImage}
                                    className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-black/50 hover:bg-black text-white flex items-center justify-center transition-all cursor-pointer"
                                >
                                    <ChevronLeft className="w-6 h-6" />
                                </button>
                                <button
                                    onClick={nextImage}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-black/50 hover:bg-black text-white flex items-center justify-center transition-all cursor-pointer"
                                >
                                    <ChevronRight className="w-6 h-6" />
                                </button>
                            </>
                        )}
                    </div>
                </div>
            )}

            {/* ================= SIZE GUIDE MODAL ================= */}
            {isSizeGuideOpen && (
                <div
                    className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-xs"
                    onClick={() => setIsSizeGuideOpen(false)}
                >
                    <div
                        className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl relative"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex items-center justify-between pb-4 border-b border-gray-100">
                            <div>
                                <h3 className="text-lg font-black uppercase text-[#070F2B]">Oversized Fit Size Chart</h3>
                                <p className="text-xs text-gray-500 font-medium">All measurements are in inches</p>
                            </div>
                            <button
                                onClick={() => setIsSizeGuideOpen(false)}
                                className="p-2 rounded-full hover:bg-gray-100 cursor-pointer"
                            >
                                <X className="w-5 h-5 text-gray-500" />
                            </button>
                        </div>

                        <div className="mt-4 overflow-x-auto">
                            <table className="w-full text-left text-xs">
                                <thead>
                                    <tr className="bg-[#070F2B] text-white">
                                        <th className="p-2.5 font-black uppercase">Size</th>
                                        <th className="p-2.5 font-black uppercase">Chest</th>
                                        <th className="p-2.5 font-black uppercase">Length</th>
                                        <th className="p-2.5 font-black uppercase">Shoulder</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100 font-medium text-gray-700">
                                    <tr><td className="p-2.5 font-black text-[#070F2B]">XS</td><td className="p-2.5">40"</td><td className="p-2.5">27.5"</td><td className="p-2.5">20.5"</td></tr>
                                    <tr className="bg-gray-50/50"><td className="p-2.5 font-black text-[#070F2B]">S</td><td className="p-2.5">42"</td><td className="p-2.5">28.5"</td><td className="p-2.5">21.5"</td></tr>
                                    <tr><td className="p-2.5 font-black text-[#070F2B]">M</td><td className="p-2.5">44"</td><td className="p-2.5">29.5"</td><td className="p-2.5">22.5"</td></tr>
                                    <tr className="bg-gray-50/50"><td className="p-2.5 font-black text-[#070F2B]">L</td><td className="p-2.5">46"</td><td className="p-2.5">30.5"</td><td className="p-2.5">23.5"</td></tr>
                                    <tr><td className="p-2.5 font-black text-[#070F2B]">XL</td><td className="p-2.5">48"</td><td className="p-2.5">31.5"</td><td className="p-2.5">24.5"</td></tr>
                                    <tr className="bg-gray-50/50"><td className="p-2.5 font-black text-[#070F2B]">XXL</td><td className="p-2.5">50"</td><td className="p-2.5">32.5"</td><td className="p-2.5">25.5"</td></tr>
                                </tbody>
                            </table>
                        </div>

                        <div className="mt-4 p-3 bg-amber-50 rounded-xl border border-amber-200/60 text-[11px] text-amber-900 font-medium">
                            <span className="font-bold">Fit Tip:</span> Our t-shirts are tailored with an oversized drop-shoulder fit. If you prefer a standard fitted silhouette, we recommend choosing one size down.
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
