'use client';

import Link from 'next/link';
import { useWishlistStore } from '@/store';

export default function WishlistIcon() {
    const { getWishlistCount } = useWishlistStore();
    const wishlistCount = getWishlistCount();

    return (
        <Link
            href="/wishlist"
            className="relative p-2 text-gray-600 hover:text-red-500 transition-colors duration-200"
            aria-label="Wishlist"
        >
            <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
            >
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
            </svg>

            {wishlistCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium">
                    {wishlistCount > 99 ? '99+' : wishlistCount}
                </span>
            )}
        </Link>
    );
}
