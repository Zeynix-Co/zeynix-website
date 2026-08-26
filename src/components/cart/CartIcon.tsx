'use client';

import { ShoppingCart } from 'lucide-react';
import { useRouter } from 'next/navigation';
import useCartStore from '@/store/cartStore';
import { colorClasses } from '@/lib/constants';

interface CartIconProps {
    showText?: boolean;
    className?: string;
    iconClassName?: string;
    textClassName?: string;
}

export default function CartIcon({
    showText = true,
    className = "relative flex items-center space-x-2 text-white cursor-pointer hover:opacity-80 transition-opacity",
    iconClassName = `w-6 h-6 ${colorClasses.light.text}`,
    textClassName = `text-md ${colorClasses.secondary.text}`
}: CartIconProps) {
    const router = useRouter();
    const { totalItems } = useCartStore();

    const handleCartClick = () => {
        router.push('/cart');
    };

    return (
        <button
            onClick={handleCartClick}
            className={className}
            aria-label="Shopping Cart"
        >
            <ShoppingCart className={iconClassName} />
            {showText && <span className={textClassName}>Cart</span>}
            {totalItems > 0 && (
                <span className="absolute -top-1.5 -right-2 bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] h-[18px] flex items-center justify-center shadow-md animate-pulse">
                    {totalItems > 99 ? '99+' : totalItems}
                </span>
            )}
        </button>
    );
}
