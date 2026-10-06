'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ShoppingCart, Star, Eye } from 'lucide-react';
import { Product } from '@/data/products';
import { APP_CONFIG } from '@/lib/constants';
import useCartStore from '@/store/cartStore';
import { useAuthStore } from '@/store';
import WishlistHeart from '@/components/wishlist/WishlistHeart';

interface ProductCardProps {
    product: Product;
    onAddToCart?: (product: Product, size: string) => void;
    theme?: 'default' | 'halloween';
}

export default function ProductCard({ product, theme = 'default' }: ProductCardProps) {
    const router = useRouter();
    const { addToCart, isInCart } = useCartStore();
    const { isAuthenticated } = useAuthStore();
    const isHalloween = theme === 'halloween';

    const availableSizes = product.size && product.size.length > 0
        ? product.size
        : ['S', 'M', 'L', 'XL', 'XXL'];

    const [selectedSize, setSelectedSize] = useState<string>(availableSizes[0] || 'M');
    const [isHovered, setIsHovered] = useState(false);
    const [isAddingToCart, setIsAddingToCart] = useState(false);
    const [imageLoaded, setImageLoaded] = useState(false);

    // Product link destination - prefer category + id or slug
    const productHref = `/products/${(product.category || 'casual').toLowerCase()}/${product.slug || product.id}`;

    const originalPrice = product.originalPrice || product.price || 1999;
    const currentPrice = product.price || 999;
    const discountPercent = product.discount || (originalPrice > currentPrice
        ? Math.round(((originalPrice - currentPrice) / originalPrice) * 100)
        : 0);

    const isAlreadyInCart = isInCart(product.id, selectedSize);

    const handleCardClick = (e: React.MouseEvent) => {
        const target = e.target as HTMLElement;
        if (target.closest('button') || target.closest('input') || target.closest('select') || target.closest('[data-stop-propagation="true"]')) {
            return;
        }
        router.push(productHref);
    };

    const handleAddToCart = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        if (!isAuthenticated) {
            router.push('/login');
            return;
        }

        if (isAlreadyInCart || isAddingToCart) return;

        setIsAddingToCart(true);

        try {
            await new Promise((res) => setTimeout(res, 400));

            addToCart({
                product: {
                    id: product.id,
                    title: product.name,
                    images: product.images && product.images.length > 0 ? product.images : [product.image],
                    price: originalPrice,
                    discountPrice: currentPrice
                },
                size: selectedSize as any,
                quantity: 1,
                totalPrice: currentPrice
            });

            setIsAddingToCart(false);
        } catch (error) {
            console.error('Error adding to cart:', error);
            setIsAddingToCart(false);
        }
    };

    const mainImageUrl = product.mainImage || product.image || (product.images && product.images[0]) || '/images/products/placeholder.jpg';
    const secondaryImageUrl = product.images && product.images.length > 1 ? product.images[1] : null;

    return (
        <div
            onClick={handleCardClick}
            className={`cursor-pointer group relative rounded-2xl transition-all duration-300 flex flex-col justify-between h-full overflow-hidden ${
                isHalloween
                    ? 'bg-[#0E0A1E]/95 border border-purple-500/25 hover:border-[#FF7518] hover:shadow-[0_20px_45px_rgba(255,117,24,0.22)] shadow-[0_10px_30px_rgba(0,0,0,0.6)] backdrop-blur-md'
                    : 'bg-white border border-gray-150/80 hover:border-[#B5945B]/50 hover:shadow-[0_20px_45px_rgba(7,15,43,0.08)]'
            }`}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {/* Top Image Studio Frame */}
            <div className={`relative aspect-[4/5] w-full overflow-hidden flex items-center justify-center p-3 sm:p-4 ${
                isHalloween ? 'bg-[#181133]/70' : 'bg-[#F6F4EE]/60'
            }`}>
                {/* Background ambient lighting */}
                <div className={`absolute inset-0 pointer-events-none ${
                    isHalloween
                        ? 'bg-radial from-purple-500/10 via-transparent to-black/40'
                        : 'bg-radial from-white/40 via-transparent to-black/[0.02]'
                }`} />

                {/* Loading skeleton placeholder */}
                {!imageLoaded && (
                    <div className={`absolute inset-0 animate-pulse ${
                        isHalloween
                            ? 'bg-gradient-to-r from-purple-950/40 via-purple-900/30 to-purple-950/40'
                            : 'bg-gradient-to-r from-gray-100 via-gray-200/60 to-gray-100'
                    }`} />
                )}

                {/* High-Resolution Product Image with object-contain & Hover Back-View */}
                <Link href={productHref} className="relative w-full h-full block">
                    <Image
                        src={mainImageUrl}
                        alt={product.name}
                        fill
                        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                        unoptimized
                        priority={false}
                        className={`object-contain transition-all duration-500 ease-out group-hover:scale-105 ${
                            secondaryImageUrl && isHovered ? 'opacity-0' : (imageLoaded ? 'opacity-100' : 'opacity-0')
                        }`}
                        onLoad={() => setImageLoaded(true)}
                    />
                    {secondaryImageUrl && (
                        <Image
                            src={secondaryImageUrl}
                            alt={`${product.name} - Back View`}
                            fill
                            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                            unoptimized
                            priority={false}
                            className={`object-contain transition-all duration-500 ease-out group-hover:scale-105 ${
                                isHovered ? 'opacity-100' : 'opacity-0 pointer-events-none'
                            }`}
                        />
                    )}
                </Link>

                {/* Discount Badge */}
                {discountPercent > 0 && (
                    <div className={`absolute top-2.5 left-2.5 text-[9px] sm:text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full z-20 ${
                        isHalloween
                            ? 'bg-gradient-to-r from-[#FF7518] to-[#E05300] text-black shadow-md'
                            : 'bg-[#DC2626] text-white shadow-sm'
                    }`}>
                        -{discountPercent}%
                    </div>
                )}

                {/* Fit Badge */}
                <div className={`absolute top-2.5 right-2.5 backdrop-blur-xs text-[7.5px] sm:text-[8.5px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full z-20 ${
                    isHalloween
                        ? 'bg-[#0B0718]/90 text-[#FFA500] border border-[#FF7518]/40'
                        : 'bg-[#070F2B]/85 text-[#E5D7B5] border border-white/10'
                }`}>
                    {product.label || product.productFit || 'OVERSIZED'}
                </div>

                {/* Quick Action Overlay on Hover */}
                <div
                    className={`absolute inset-x-0 bottom-3 flex items-center justify-center gap-2 z-20 px-3 transition-all duration-300 ${
                        isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2 pointer-events-none'
                    }`}
                >
                    <Link
                        href={productHref}
                        onClick={(e) => e.stopPropagation()}
                        className={`flex-1 min-h-[36px] text-[10px] font-extrabold uppercase tracking-wider rounded-xl shadow-lg transition-all duration-200 flex items-center justify-center gap-1.5 px-3 ${
                            isHalloween
                                ? 'bg-[#FF7518] hover:bg-[#FFA500] text-black font-black'
                                : 'bg-[#070F2B] hover:bg-[#B5945B] text-white hover:text-[#070F2B]'
                        }`}
                    >
                        <Eye className="w-3.5 h-3.5" />
                        <span>View Product</span>
                    </Link>

                    <div className="shrink-0" onClick={(e) => e.stopPropagation()} data-stop-propagation="true">
                        <WishlistHeart
                            product={{
                                id: product.id,
                                title: product.name,
                                images: product.images && product.images.length > 0 ? product.images : [mainImageUrl],
                                price: currentPrice,
                                originalPrice: originalPrice,
                                discountPrice: currentPrice,
                                category: product.category,
                                brand: product.brand || 'Zeynix'
                            }}
                            size={selectedSize}
                            className={`w-9 h-9 p-2 rounded-xl shadow-lg transition-colors ${
                                isHalloween
                                    ? 'bg-[#181133] text-white hover:text-[#FF7518] border border-purple-500/30'
                                    : 'bg-white/95 text-[#070F2B] hover:bg-white border border-gray-200'
                            }`}
                        />
                    </div>
                </div>
            </div>

            {/* Product Meta Section */}
            <div className="p-3.5 sm:p-4 flex-1 flex flex-col justify-between">
                <div>
                    {/* Brand & Category */}
                    <div className="flex items-center justify-between gap-1 mb-1.5">
                        <span className={`text-[9.5px] sm:text-[10px] font-black uppercase tracking-widest truncate ${
                            isHalloween ? 'text-[#FFA500]' : 'text-[#B5945B]'
                        }`}>
                            {product.brand || 'ZEYNIX'}
                        </span>
                        <span className={`text-[8.5px] sm:text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md shrink-0 ${
                            isHalloween
                                ? 'bg-[#1D143D] text-purple-200 border border-purple-500/20'
                                : 'bg-gray-100 text-gray-500'
                        }`}>
                            {product.category?.toLowerCase() === 'unisexual' || product.category?.toLowerCase() === 'unisex' ? 'UNISEX' : product.category}
                        </span>
                    </div>

                    {/* Product Title */}
                    <Link href={productHref} className="block transition-colors">
                        <h3 className={`font-extrabold uppercase tracking-tight text-xs sm:text-[13px] line-clamp-1 mb-1.5 leading-snug ${
                            isHalloween ? 'text-white group-hover:text-[#FFA500]' : 'text-[#070F2B] group-hover:text-[#B5945B]'
                        }`}>
                            {product.name}
                        </h3>
                    </Link>

                    {/* Rating Stars */}
                    <div className="flex items-center gap-1 mb-2.5">
                        <div className="flex items-center">
                            {[...Array(5)].map((_, i) => (
                                <Star
                                    key={i}
                                    className={`w-3 h-3 ${
                                        i < Math.floor(product.rating || 5)
                                            ? (isHalloween ? 'text-[#FF7518] fill-[#FF7518]' : 'text-[#F59E0B] fill-[#F59E0B]')
                                            : (isHalloween ? 'text-purple-900/60' : 'text-gray-200')
                                    }`}
                                />
                            ))}
                        </div>
                        <span className={`text-[9.5px] font-bold ml-0.5 ${
                            isHalloween ? 'text-purple-300/70' : 'text-gray-400'
                        }`}>
                            ({product.rating || 4.9})
                        </span>
                    </div>

                    {/* Price Block */}
                    <div className="flex items-baseline gap-2 mb-3">
                        <span className={`text-sm sm:text-base font-black ${
                            isHalloween ? 'text-white' : 'text-[#070F2B]'
                        }`}>
                            {APP_CONFIG.currency}{currentPrice.toLocaleString('en-IN')}
                        </span>
                        {discountPercent > 0 && (
                            <span className={`text-xs line-through font-semibold ${
                                isHalloween ? 'text-purple-300/60' : 'text-gray-400'
                            }`}>
                                {APP_CONFIG.currency}{originalPrice.toLocaleString('en-IN')}
                            </span>
                        )}
                    </div>

                    {/* Size Selector Strip */}
                    <div className="mb-3.5">
                        <div className={`flex items-center justify-between text-[9px] font-bold uppercase tracking-wider mb-1.5 ${
                            isHalloween ? 'text-purple-300/60' : 'text-gray-400'
                        }`}>
                            <span>Select Size</span>
                            <span className={`font-black ${isHalloween ? 'text-[#FFA500]' : 'text-[#070F2B]/70'}`}>{selectedSize}</span>
                        </div>
                        <div className="flex flex-wrap gap-1">
                            {availableSizes.slice(0, 5).map((size) => (
                                <button
                                    key={size}
                                    type="button"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        setSelectedSize(size);
                                    }}
                                    className={`text-[9.5px] font-black min-w-[26px] sm:min-w-[28px] h-7 px-1.5 rounded-md border transition-all duration-200 cursor-pointer flex items-center justify-center ${
                                        selectedSize === size
                                            ? (isHalloween
                                                ? 'bg-[#FF7518] text-black border-[#FF7518] shadow-[0_0_12px_rgba(255,117,24,0.4)] scale-105'
                                                : 'bg-[#070F2B] text-white border-[#070F2B] shadow-xs scale-105')
                                            : (isHalloween
                                                ? 'bg-[#181133] text-purple-200 border-purple-500/30 hover:border-[#FF7518]/60'
                                                : 'bg-white text-gray-700 border-gray-200 hover:border-[#070F2B]/50')
                                    }`}
                                >
                                    {size}
                                </button>
                            ))}
                            {availableSizes.length > 5 && (
                                <span className={`text-[8.5px] font-bold px-1 py-1 flex items-center ${
                                    isHalloween ? 'text-purple-300/70' : 'text-gray-400'
                                }`}>
                                    +{availableSizes.length - 5}
                                </span>
                            )}
                        </div>
                    </div>
                </div>

                {/* Action Button: Add to Cart */}
                <button
                    onClick={handleAddToCart}
                    disabled={isAddingToCart || isAlreadyInCart}
                    className={`w-full h-10 px-3 rounded-xl font-extrabold uppercase tracking-wider text-[10px] transition-all duration-300 flex items-center justify-center gap-1.5 shadow-sm cursor-pointer active:scale-98 ${
                        isAlreadyInCart
                            ? 'bg-emerald-700 text-white cursor-not-allowed'
                            : isAddingToCart
                                ? (isHalloween ? 'bg-[#FF7518] text-black opacity-80 cursor-wait' : 'bg-[#070F2B] text-white opacity-80 cursor-wait')
                                : (isHalloween
                                    ? 'bg-gradient-to-r from-[#FF7518] to-[#E05300] hover:from-[#FFA500] hover:to-[#FF7518] text-black font-black border border-[#FF7518] shadow-[0_4px_15px_rgba(255,117,24,0.3)] hover:shadow-[0_4px_22px_rgba(255,117,24,0.5)]'
                                    : 'bg-[#070F2B] hover:bg-[#B5945B] text-white hover:text-[#070F2B] border border-[#070F2B] hover:border-[#B5945B]')
                    }`}
                >
                    {isAlreadyInCart ? (
                        <>
                            <ShoppingCart className="w-3.5 h-3.5" />
                            <span>In Cart ({selectedSize})</span>
                        </>
                    ) : isAddingToCart ? (
                        <>
                            <div className="w-3.5 h-3.5 border-2 border-current border-t-transparent rounded-full animate-spin" />
                            <span>Adding...</span>
                        </>
                    ) : (
                        <>
                            <ShoppingCart className="w-3.5 h-3.5" />
                            <span>{isAuthenticated ? `Add to Cart • ${selectedSize}` : 'Login to Add'}</span>
                        </>
                    )}
                </button>
            </div>
        </div>
    );
}