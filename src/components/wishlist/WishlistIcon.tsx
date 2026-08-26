'use client';

import Link from 'next/link';
import { Heart } from 'lucide-react';
import { colorClasses } from '@/lib/constants';
import { useWishlistStore } from '@/store';

interface WishlistIconProps {
    showText?: boolean;
    className?: string;
    iconClassName?: string;
    textClassName?: string;
}

export default function WishlistIcon({
    showText = false,
    className = "relative p-2 text-white hover:opacity-80 transition-opacity duration-200",
    iconClassName = "w-6 h-6",
    textClassName = `text-md ${colorClasses.secondary.text}`
}: WishlistIconProps) {
    const { getWishlistCount } = useWishlistStore();
    const wishlistCount = getWishlistCount();

    return (
        <Link
            href="/wishlist"
            className={className}
            aria-label="Wishlist"
        >
            <Heart className={iconClassName} />
            {showText && <span className={textClassName}>Wishlist</span>}

            {wishlistCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-red-500 text-white text-[10px] rounded-full h-[18px] w-[18px] flex items-center justify-center font-bold shadow-md animate-pulse">
                    {wishlistCount > 99 ? '99+' : wishlistCount}
                </span>
            )}
        </Link>
    );
}
