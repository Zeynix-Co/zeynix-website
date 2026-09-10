'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ShoppingCart, Star, Eye, ArrowRight } from 'lucide-react';
import { Product } from '@/data/products';
import { APP_CONFIG } from '@/lib/constants';
import useCartStore from '@/store/cartStore';
import { useAuthStore } from '@/store';
import WishlistHeart from '@/components/wishlist/WishlistHeart';

interface ProductCardProps {
    product: Product;
    onAddToCart?: (product: Product, size: string) => void;
}

export default function ProductCard({ product }: ProductCardProps) {
    const router = useRouter();
    const { addToCart, isInCart } = useCartStore();
    const { isAuthenticated } = useAuthStore();

    const availableSizes = product.size && product.size.length > 0
        ? product.size
        : ['S', 'M', 'L', 'XL', 'XXL'];

    const [selectedSize, setSelectedSize] = useState<string>(availableSizes[0] || 'M');
    const [isHovered, setIsHovered] = useState(false);
    const [isAddingToCart, setIsAddingToCart] = useState(false);
    const [imageLoaded, setImageLoaded] = useState(false);

    // Product link destination - prefer category + id or slug
    const productHref = `/products/${product.category.toLowerCase()}/${product.slug || product.id}`;

    const originalPrice = product.originalPrice || product.price || 1999;
    const currentPrice = product.price || 999;
    const discountPercent = product.discount || (originalPrice > currentPrice
        ? Math.round(((originalPrice - currentPrice) / originalPrice) * 100)
        : 0);

    const isAlreadyInCart = isInCart(product.id, selectedSize);

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

    return (
        <div
            className="group relative bg-white rounded-2xl border border-gray-150/80 hover:border-[#B5945B]/50 hover:shadow-[0_20px_45px_rgba(7,15,43,0.08)] transition-all duration-300 flex flex-col justify-between h-full overflow-hidden"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {/* Top Image Studio Frame */}
            <div className="relative aspect-[4/5] w-full bg-[#F6F4EE]/60 overflow-hidden flex items-center justify-center p-3 sm:p-4">
                {/* Background ambient lighting */}
                <div className="absolute inset-0 bg-radial from-white/40 via-transparent to-black/[0.02] pointer-events-none" />

                {/* Loading skeleton placeholder */}
                {!imageLoaded && (
                    <div className="absolute inset-0 bg-gradient-to-r from-gray-100 via-gray-200/60 to-gray-100 animate-pulse" />
                )}

                {/* High-Resolution Product Image with object-contain */}
                <Link href={productHref} className="relative w-full h-full block">
                    <Image
                        src={mainImageUrl}
                        alt={product.name}
                        fill
                        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                        quality={90}
                        priority={false}
                        className={`object-contain transition-all duration-500 ease-out group-hover:scale-105 ${
                            imageLoaded ? 'opacity-100' : 'opacity-0'
                        }`}
                        onLoad={() => setImageLoaded(true)}
                    />
                </Link>

                {/* Discount Badge */}
                {discountPercent > 0 && (
                    <div className="absolute top-2.5 left-2.5 bg-[#DC2626] text-white text-[9px] sm:text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full shadow-sm z-20">
                        -{discountPercent}%
                    </div>
                )}

                {/* Fit Badge */}
                <div className="absolute top-2.5 right-2.5 bg-[#070F2B]/85 backdrop-blur-xs text-[#E5D7B5] text-[7.5px] sm:text-[8.5px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full z-20 border border-white/10">
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
                        className="flex-1 min-h-[36px] bg-[#070F2B] hover:bg-[#B5945B] text-white hover:text-[#070F2B] text-[10px] font-extrabold uppercase tracking-wider rounded-xl shadow-lg transition-all duration-200 flex items-center justify-center gap-1.5 px-3"
                    >
                        <Eye className="w-3.5 h-3.5" />
                        <span>View Product</span>
                    </Link>

                    <div className="shrink-0">
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
                            className="w-9 h-9 p-2 rounded-xl bg-white/95 text-[#070F2B] hover:bg-white shadow-lg border border-gray-200"
                        />
                    </div>
                </div>
            </div>

            {/* Product Meta Section */}
            <div className="p-3.5 sm:p-4 flex-1 flex flex-col justify-between">
                <div>
                    {/* Brand & Category */}
                    <div className="flex items-center justify-between gap-1 mb-1.5">
                        <span className="text-[9.5px] sm:text-[10px] font-black text-[#B5945B] uppercase tracking-widest truncate">
                            {product.brand || 'ZEYNIX'}
                        </span>
                        <span className="text-[8.5px] sm:text-[9px] font-bold text-gray-500 uppercase tracking-wider bg-gray-100 px-2 py-0.5 rounded-md shrink-0">
                            {product.category}
                        </span>
                    </div>

                    {/* Product Title */}
                    <Link href={productHref} className="block group-hover:text-[#B5945B] transition-colors">
                        <h3 className="font-extrabold uppercase tracking-tight text-xs sm:text-[13px] text-[#070F2B] line-clamp-1 mb-1.5 leading-snug">
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
                                            ? 'text-[#F59E0B] fill-[#F59E0B]'
                                            : 'text-gray-200'
                                    }`}
                                />
                            ))}
                        </div>
                        <span className="text-[9.5px] font-bold text-gray-400 ml-0.5">
                            ({product.rating || 4.9})
                        </span>
                    </div>

                    {/* Price Block */}
                    <div className="flex items-baseline gap-2 mb-3">
                        <span className="text-sm sm:text-base font-black text-[#070F2B]">
                            {APP_CONFIG.currency}{currentPrice.toLocaleString('en-IN')}
                        </span>
                        {discountPercent > 0 && (
                            <span className="text-xs text-gray-400 line-through font-semibold">
                                {APP_CONFIG.currency}{originalPrice.toLocaleString('en-IN')}
                            </span>
                        )}
                    </div>

                    {/* Size Selector Strip */}
                    <div className="mb-3.5">
                        <div className="flex items-center justify-between text-[9px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">
                            <span>Select Size</span>
                            <span className="text-[#070F2B]/70 font-black">{selectedSize}</span>
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
                                            ? 'bg-[#070F2B] text-white border-[#070F2B] shadow-xs scale-105'
                                            : 'bg-white text-gray-700 border-gray-200 hover:border-[#070F2B]/50'
                                    }`}
                                >
                                    {size}
                                </button>
                            ))}
                            {availableSizes.length > 5 && (
                                <span className="text-[8.5px] font-bold text-gray-400 px-1 py-1 flex items-center">
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
                                ? 'bg-[#070F2B] text-white opacity-80 cursor-wait'
                                : 'bg-[#070F2B] hover:bg-[#B5945B] text-white hover:text-[#070F2B] border border-[#070F2B] hover:border-[#B5945B]'
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