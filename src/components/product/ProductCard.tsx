'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Heart, ShoppingCart, Star, Eye } from 'lucide-react';
import { Product } from '@/data/products';
import { colorClasses, APP_CONFIG } from '@/lib/constants';
import useCartStore from '@/store/cartStore';
import { useAuthStore, useWishlistStore } from '@/store';
import WishlistHeart from '@/components/wishlist/WishlistHeart';

interface ProductCardProps {
    product: Product;
    onAddToCart?: (product: Product, size: string) => void;
    onAddToWishlist?: (product: Product) => void;
}

export default function ProductCard({ product, onAddToCart, onAddToWishlist }: ProductCardProps) {
    const router = useRouter();
    const { addToCart, isInCart } = useCartStore();
    const { isAuthenticated } = useAuthStore();
    const { isInWishlist } = useWishlistStore();

    const [selectedSize, setSelectedSize] = useState<string>(product.size[0]);
    const [isHovered, setIsHovered] = useState(false);
    const [isAddingToCart, setIsAddingToCart] = useState(false);

    const handleAddToCart = async () => {
        // If user is not authenticated, redirect to login
        if (!isAuthenticated) {
            router.push('/login');
            return;
        }

        // Always allow adding to cart for now

        setIsAddingToCart(true);

        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 500));

            addToCart({
                product: {
                    id: product.id,
                    title: product.name,
                    images: product.images,
                    price: product.originalPrice, // This should be the original price
                    discountPrice: product.price // This should be the discounted price
                },
                size: selectedSize as 'M' | 'L' | 'XL' | 'XXL' | 'XXXL',
                quantity: 1,
                totalPrice: product.price * 1
            });

            // Show success feedback
            setIsAddingToCart(false);
        } catch (error) {
            console.error('Error adding to cart:', error);
            setIsAddingToCart(false);
        }
    };

    // Remove old wishlist handling - now handled by WishlistHeart component

    const discountPercentage = Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100);
    const isAlreadyInCart = isInCart(product.id, selectedSize);

    return (
        <div
            className="group bg-white rounded-xl hover:-translate-y-1.5 hover:shadow-[0_15px_35px_rgba(7,15,43,0.1)] transition-all duration-500 ease-out border border-gray-100 overflow-hidden flex flex-col justify-between h-full"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {/* Product Image Container */}
            <div className="relative aspect-square overflow-hidden bg-gray-50">
                {/* Loading Skeleton */}
                <div className="absolute inset-0 bg-gradient-to-r from-gray-150 via-gray-250 to-gray-150 animate-pulse" />

                <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-700 ease-out relative z-10"
                    sizes="(max-width: 640px) 50vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, (max-width: 1280px) 25vw, 20vw"
                    priority={false}
                    loading="lazy"
                    placeholder="blur"
                    blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k="
                    onLoad={() => {
                        const skeleton = document.querySelector('.animate-pulse');
                        if (skeleton) {
                            skeleton.classList.add('opacity-0');
                        }
                    }}
                />


                {/* Discount Badge */}
                {discountPercentage > 0 && (
                    <div className="absolute top-2.5 right-2.5 sm:top-3 sm:right-3 bg-red-600 text-white text-[8px] sm:text-[9px] font-black uppercase tracking-wider px-1.5 sm:px-2 py-0.5 rounded-full z-20 shadow-md border border-red-500">
                        -{discountPercentage}%
                    </div>
                )}

                {/* Label Badge */}
                {product.label && (
                    <div className="absolute bottom-2.5 left-2.5 sm:bottom-3 sm:left-3 bg-[#B5945B] text-white text-[7px] sm:text-[8px] font-black uppercase tracking-widest px-2 sm:px-2.5 py-0.5 sm:py-1 rounded z-20 shadow-md">
                        {product.label}
                    </div>
                )}

                {/* New Arrival Badge */}
                {product.featured && (
                    <div className="absolute bottom-2.5 right-2.5 sm:bottom-3 sm:right-3 bg-green-600 text-white text-[7px] sm:text-[8px] font-black uppercase tracking-widest px-2 sm:px-2.5 py-0.5 sm:py-1 rounded z-20 shadow-md">
                        NEW
                    </div>
                )}

                {/* Quick Actions Overlay */}
                <div className={`absolute inset-0 bg-black/20 flex items-center justify-center gap-2 sm:gap-3 transition-opacity duration-300 z-20 ${isHovered ? 'opacity-100' : 'opacity-0'
                    }`}>
                    <WishlistHeart
                        product={{
                            id: product.id,
                            title: product.name,
                            images: product.images,
                            price: product.price,
                            originalPrice: product.originalPrice,
                            discountPrice: product.price,
                            category: product.category,
                            brand: 'Zeynix'
                        }}
                        size={selectedSize}
                        className="min-w-[38px] min-h-[38px] sm:min-w-[44px] sm:min-h-[44px] p-2.5 sm:p-3 shadow-lg"
                    />

                    <Link
                        href={`/products/${product.category.toLowerCase()}/${product.id}`}
                        className="min-w-[38px] min-h-[38px] sm:min-w-[44px] sm:min-h-[44px] p-2.5 sm:p-3 rounded-full bg-white text-gray-700 hover:scale-110 active:scale-95 transition-all duration-200 flex items-center justify-center shadow-lg"
                    >
                        <Eye className="w-4 h-4 sm:w-5 sm:h-5 text-[#070F2B]" />
                    </Link>
                </div>
            </div>

            {/* Product Info */}
            <div className="p-2.5 sm:p-4 flex-1 flex flex-col justify-between">
                <div>
                    {/* Brand and Category */}
                    <div className="flex items-center justify-between mb-1 sm:mb-1.5 gap-1">
                        <div className="text-[9px] sm:text-[10px] font-black text-[#B5945B] uppercase tracking-widest truncate">
                            {product.brand || 'Zeynix'}
                        </div>
                        <span className="text-[8px] sm:text-[9px] font-bold text-gray-400 bg-gray-100 px-1.5 sm:px-2 py-0.5 rounded-full uppercase tracking-wider shrink-0">
                            {product.category}
                        </span>
                    </div>

                    {/* Product Name */}
                    <Link href={`/products/${product.category.toLowerCase()}/${product.id}`}>
                        <h3 className="font-extrabold uppercase tracking-wide text-[11px] sm:text-xs text-[#070F2B] hover:text-[#B5945B] transition-colors duration-300 line-clamp-1 mb-1.5 sm:mb-2">
                            {product.name}
                        </h3>
                    </Link>

                    {/* Rating */}
                    <div className="flex items-center gap-1 mb-2 sm:mb-2.5">
                        <div className="flex items-center">
                            {[...Array(5)].map((_, i) => (
                                <Star
                                    key={i}
                                    className={`w-2.5 h-2.5 sm:w-3 sm:h-3 ${i < Math.floor(product.rating)
                                        ? 'text-yellow-400 fill-current'
                                        : 'text-gray-200'
                                        }`}
                                />
                            ))}
                        </div>
                        <span className="text-[9px] sm:text-[10px] font-bold text-[#070F2B]/60 ml-0.5">
                            ({product.rating})
                        </span>
                    </div>

                    {/* Price */}
                    <div className="flex items-center gap-1.5 sm:gap-2 mb-2.5 sm:mb-3">
                        <span className="text-xs sm:text-sm font-black text-[#070F2B]">
                            {APP_CONFIG.currency}{product.price}
                        </span>
                        {discountPercentage > 0 && (
                            <span className="text-[10px] sm:text-[11px] text-gray-400 line-through font-semibold">
                                {APP_CONFIG.currency}{product.originalPrice}
                            </span>
                        )}
                    </div>

                    {/* Available Sizes */}
                    <div className="mb-3 sm:mb-4">
                        <div className="text-[8px] sm:text-[9px] font-bold text-gray-400 uppercase tracking-wider mb-1">Select Size:</div>
                        <div className="flex flex-wrap gap-1 sm:gap-1.5">
                            {product.size.slice(0, 4).map((size) => (
                                <button
                                    key={size}
                                    type="button"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        setSelectedSize(size);
                                    }}
                                    className={`text-[9px] sm:text-[10px] font-black px-1.5 sm:px-2.5 py-0.5 sm:py-1 rounded transition-all duration-200 cursor-pointer border min-w-[24px] sm:min-w-[28px] text-center ${selectedSize === size
                                            ? 'bg-[#070F2B] text-white border-[#070F2B] scale-105 shadow-xs'
                                            : 'bg-gray-50 text-gray-600 border-gray-200 hover:border-[#070F2B]/40'
                                        }`}
                                >
                                    {size}
                                </button>
                            ))}
                            {product.size.length > 4 && (
                                <span className="text-[8px] sm:text-[9px] font-bold px-1.5 sm:px-2 py-0.5 sm:py-1 rounded bg-gray-100 text-gray-500 border border-gray-200 flex items-center justify-center">
                                    +{product.size.length - 4}
                                </span>
                            )}
                        </div>
                    </div>
                </div>

                {/* Add to Cart Button */}
                <button
                    onClick={handleAddToCart}
                    disabled={isAddingToCart || isAlreadyInCart}
                    className={`w-full min-h-[38px] sm:min-h-[42px] py-2 sm:py-2.5 px-2 sm:px-4 rounded-none font-bold uppercase tracking-wide sm:tracking-wider text-[9px] sm:text-[10px] transition-all duration-300 active:scale-95 cursor-pointer ${
                        isAlreadyInCart
                            ? 'bg-green-700 text-white cursor-not-allowed'
                            : isAddingToCart
                                ? 'bg-[#070F2B] text-white cursor-wait opacity-80'
                                : 'bg-[#070F2B] text-white hover:bg-[#B5945B] hover:text-[#070F2B] border border-[#070F2B] hover:border-[#B5945B] shadow-[2px_2px_0px_#B5945B] hover:shadow-[0px_0px_0px_#B5945B]'
                    }`}
                >
                    {isAlreadyInCart ? (
                        <div className="flex items-center justify-center gap-1 sm:gap-1.5 truncate">
                            <ShoppingCart className="w-3.5 h-3.5 shrink-0" />
                            <span>In Cart</span>
                        </div>
                    ) : isAddingToCart ? (
                        <div className="flex items-center justify-center gap-1 sm:gap-1.5 truncate">
                            <div className="w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin shrink-0"></div>
                            <span>Adding...</span>
                        </div>
                    ) : (
                        <div className="flex items-center justify-center gap-1 sm:gap-1.5 truncate">
                            <ShoppingCart className="w-3.5 h-3.5 shrink-0" />
                            <span className="truncate">{isAuthenticated ? 'Add to Cart' : 'Login to Add'}</span>
                        </div>
                    )}
                </button>
            </div>
        </div>
    );
}