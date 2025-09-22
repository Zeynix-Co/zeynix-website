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
            className="group bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {/* Product Image Container */}
            <div className="relative aspect-square overflow-hidden bg-gray-100">
                {/* Loading Skeleton */}
                <div className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-pulse" />

                <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-300 relative z-10"
                    sizes="(max-width: 640px) 50vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, (max-width: 1280px) 25vw, 20vw"
                    priority={false}
                    loading="lazy"
                    placeholder="blur"
                    blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k="
                    onLoad={() => {
                        // Hide skeleton when image loads
                        const skeleton = document.querySelector('.animate-pulse');
                        if (skeleton) {
                            skeleton.classList.add('opacity-0');
                        }
                    }}
                />

                {/* Category Badge */}
                <div className="absolute top-3 left-3 bg-gray-800 text-white text-xs font-medium px-2 py-1 rounded">
                    {product.category.toUpperCase()}
                </div>

                {/* Discount Badge */}
                {discountPercentage > 0 && (
                    <div className="absolute top-3 right-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                        -{discountPercentage}%
                    </div>
                )}

                {/* Label Badge */}
                {product.label && (
                    <div className="absolute bottom-3 left-3 bg-black/80 text-white text-xs font-medium px-2 py-1 rounded">
                        {product.label}
                    </div>
                )}

                {/* New Arrival Badge */}
                {product.featured && (
                    <div className="absolute bottom-3 right-3 bg-green-500 text-white text-xs font-medium px-2 py-1 rounded-full">
                        NEW
                    </div>
                )}

                {/* Quick Actions Overlay */}
                <div className={`absolute inset-0 bg-black/20 flex items-center justify-center gap-3 transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'
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
                        className="min-w-[44px] min-h-[44px] p-3"
                    />

                    <Link
                        href={`/products/${product.category.toLowerCase()}/${product.id}`}
                        className="min-w-[44px] min-h-[44px] p-3 rounded-full bg-white text-gray-700 hover:scale-110 transition-all duration-200 flex items-center justify-center"
                    >
                        <Eye className="w-5 h-5" />
                    </Link>
                </div>

                {/* Stock Status - Always show as available for now */}
            </div>

            {/* Product Info */}
            <div className="p-4">
                {/* Brand and Category */}
                <div className="flex items-center justify-between mb-2">
                    <div className="text-xs font-semibold text-blue-600 uppercase tracking-wide">
                        {product.brand}
                    </div>
                    <div className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                        {product.category}
                    </div>
                </div>

                {/* Product Name */}
                <Link href={`/products/${product.category.toLowerCase()}/${product.id}`}>
                    <h3 className={`font-semibold ${colorClasses.primary.text} mb-2 line-clamp-2 hover:${colorClasses.secondary.text} transition-colors`}>
                        {product.name}
                    </h3>
                </Link>

                {/* Rating */}
                <div className="flex items-center gap-1 mb-3">
                    <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                            <Star
                                key={i}
                                className={`w-4 h-4 ${i < Math.floor(product.rating)
                                    ? 'text-yellow-400 fill-current'
                                    : 'text-gray-300'
                                    }`}
                            />
                        ))}
                    </div>
                    <span className={`text-sm ${colorClasses.primary.text} ml-1`}>
                        ({product.rating})
                    </span>
                </div>

                {/* Price */}
                <div className="flex items-center gap-2 mb-2">
                    <span className={`text-lg font-bold ${colorClasses.primary.text}`}>
                        {APP_CONFIG.currency}{product.price}
                    </span>
                    {discountPercentage > 0 && (
                        <span className="text-sm text-gray-500 line-through">
                            {APP_CONFIG.currency}{product.originalPrice}
                        </span>
                    )}
                </div>

                {/* Available Sizes */}
                <div className="mb-3">
                    <div className="text-xs text-gray-500 mb-1">Available Sizes:</div>
                    <div className="flex flex-wrap gap-1">
                        {product.size.slice(0, 4).map((size) => (
                            <span
                                key={size}
                                className={`text-xs px-2 py-1 rounded border ${selectedSize === size
                                        ? 'bg-blue-100 text-blue-800 border-blue-300'
                                        : 'bg-gray-50 text-gray-600 border-gray-200'
                                    }`}
                            >
                                {size}
                            </span>
                        ))}
                        {product.size.length > 4 && (
                            <span className="text-xs px-2 py-1 rounded bg-gray-100 text-gray-500 border border-gray-200">
                                +{product.size.length - 4}
                            </span>
                        )}
                    </div>
                </div>

                {/* Add to Cart Button */}
                <button
                    onClick={handleAddToCart}
                    disabled={isAddingToCart || isAlreadyInCart}
                    className={`w-full min-h-[44px] py-3 px-4 rounded-md font-medium transition-all duration-200 touch-manipulation ${isAlreadyInCart
                        ? 'bg-green-600 text-white cursor-not-allowed'
                        : isAddingToCart
                            ? 'bg-blue-600 text-white cursor-wait'
                            : `${colorClasses.secondary.bg} text-gray-900 hover:opacity-90 hover:scale-105 active:scale-95`
                        }`}
                >
                    {isAlreadyInCart ? (
                        <div className="flex items-center justify-center gap-2">
                            <ShoppingCart className="w-4 h-4" />
                            Already in Cart
                        </div>
                    ) : isAddingToCart ? (
                        <div className="flex items-center justify-center gap-2">
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            Adding...
                        </div>
                    ) : (
                        <div className="flex items-center justify-center gap-2">
                            <ShoppingCart className="w-4 h-4" />
                            {isAuthenticated ? 'Add to Cart' : 'Login to Add'}
                        </div>
                    )}
                </button>
            </div>
        </div>
    );
} 