'use client';

import { ShoppingCart } from 'lucide-react';
import { useRouter } from 'next/navigation';
import useCartStore from '@/store/cartStore';
import { colorClasses } from '@/lib/constants';

export default function CartIcon() {
    const router = useRouter();
    const { totalItems } = useCartStore();

    const handleCartClick = () => {
        router.push('/cart');
    };

    return (
        <button
            onClick={handleCartClick}
            className="relative flex items-center space-x-2 text-white cursor-pointer hover:opacity-80 transition-opacity"
        >
            <ShoppingCart className={`w-6 h-6 ${colorClasses.light.text}`} />
            <span className={`text-md ${colorClasses.secondary.text}`}>Cart</span>
            {totalItems > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full min-w-[20px] text-center">
                    {totalItems > 99 ? '99+' : totalItems}
                </span>
            )}
        </button>
    );
}
