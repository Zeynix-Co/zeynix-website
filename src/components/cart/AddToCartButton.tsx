'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ShoppingCart, Check } from 'lucide-react';
import useCartStore from '@/store/cartStore';
import { useAuthStore } from '@/store';
import { Button } from '@/components/ui/Button';

interface AddToCartButtonProps {
    product: {
        id: string;
        title: string;
        images: string[];
        price: number;
        discountPrice?: number;
    };
    size: string;
    disabled?: boolean;
}

export default function AddToCartButton({ product, size, disabled = false }: AddToCartButtonProps) {
    const router = useRouter();
    const [isAdding, setIsAdding] = useState(false);
    const [isAdded, setIsAdded] = useState(false);
    const { addToCart, isInCart } = useCartStore();
    const { isAuthenticated } = useAuthStore();

    const isAlreadyInCart = isInCart(product.id, size);

    const handleAddToCart = async () => {
        // If user is not authenticated, redirect to login
        if (!isAuthenticated) {
            router.push('/login');
            return;
        }

        if (isAlreadyInCart || disabled) return;

        setIsAdding(true);

        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 500));

        addToCart({
            product,
            size: size as any,
            quantity: 1,
            totalPrice: (product.discountPrice || product.price) * 1
        });

        setIsAdding(false);
        setIsAdded(true);

        // Reset after 2 seconds
        setTimeout(() => setIsAdded(false), 2000);
    };

    if (isAlreadyInCart) {
        return (
            <Button disabled className="w-full bg-green-600 hover:bg-green-700">
                <Check className="w-4 h-4 mr-2" />
                Already in Cart
            </Button>
        );
    }

    if (isAdded) {
        return (
            <Button disabled className="w-full bg-green-600 hover:bg-green-700">
                <Check className="w-4 h-4 mr-2" />
                Added to Cart!
            </Button>
        );
    }

    return (
        <Button
            onClick={handleAddToCart}
            disabled={disabled || isAdding}
            className="w-full"
        >
            {isAdding ? (
                'Adding...'
            ) : (
                <>
                    <ShoppingCart className="w-4 h-4 mr-2" />
                    {isAuthenticated ? 'Add to Cart' : 'Login to Add to Cart'}
                </>
            )}
        </Button>
    );
}
