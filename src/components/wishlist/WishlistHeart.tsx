'use client';

import { useState } from 'react';
import { useWishlistStore } from '@/store';

interface WishlistHeartProps {
    product: {
        id: string;
        title: string;
        images: string[];
        price: number;
        originalPrice?: number;
        discountPrice?: number;
        category?: string;
        brand?: string;
    };
    size: string;
    className?: string;
}

export default function WishlistHeart({ product, size, className = '' }: WishlistHeartProps) {
    const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlistStore();
    const [isAnimating, setIsAnimating] = useState(false);

    const isWishlisted = isInWishlist(product.id, size);

    const handleToggleWishlist = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        setIsAnimating(true);

        if (isWishlisted) {
            removeFromWishlist(product.id, size);
        } else {
            addToWishlist({
                ...product,
                originalPrice: product.originalPrice || product.price,
                discountPrice: product.discountPrice || product.price,
                category: product.category || 'casual'
            }, size);
        }

        // Reset animation after a short delay
        setTimeout(() => setIsAnimating(false), 300);
    };

    return (
        <button
            onClick={handleToggleWishlist}
            className={`
                absolute top-2 right-2 z-10 p-2 rounded-full bg-white/80 backdrop-blur-sm
                shadow-md hover:shadow-lg transition-all duration-200
                ${isWishlisted ? 'text-red-500' : 'text-gray-400 hover:text-red-500'}
                ${isAnimating ? 'scale-110' : 'scale-100'}
                ${className}
            `}
            aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
        >
            <svg
                className={`w-5 h-5 transition-all duration-200 ${isWishlisted ? 'fill-current' : 'fill-none stroke-current'
                    }`}
                viewBox="0 0 24 24"
                strokeWidth={isWishlisted ? 0 : 2}
                strokeLinecap="round"
                strokeLinejoin="round"
            >
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
            </svg>
        </button>
    );
}
