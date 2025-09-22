'use client';

import { useState } from 'react';
import { useWishlistStore, useCartStore } from '@/store';
import type { WishlistItem } from '@/store/wishlistStore';
import { Button } from '@/components/ui/Button';
import { colorClasses } from '@/lib/constants';
import Link from 'next/link';
import ProtectedRoute from '@/components/auth/ProtectedRoute';

function WishlistPageContent() {
    const { items, removeFromWishlist, clearWishlist, isLoading } = useWishlistStore();
    const { addToCart } = useCartStore();
    const [addingToCart, setAddingToCart] = useState<string | null>(null);

    const handleAddToCart = async (item: WishlistItem) => {
        setAddingToCart(item.id);
        try {
            addToCart({
                product: item.product,
                size: item.size as 'M' | 'L' | 'XL' | 'XXL' | 'XXXL',
                quantity: 1,
                totalPrice: item.product.discountPrice || item.product.price
            });
        } catch (error) {
            console.error('Failed to add to cart:', error);
        } finally {
            setAddingToCart(null);
        }
    };

    const handleRemoveFromWishlist = (productId: string, size: string) => {
        removeFromWishlist(productId, size);
    };

    const handleClearWishlist = () => {
        if (confirm('Are you sure you want to clear your wishlist?')) {
            clearWishlist();
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-50 py-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-center h-64">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className={`text-3xl font-bold ${colorClasses.primary.text}`}>
                        My Wishlist
                    </h1>
                    <p className="text-gray-600 mt-2">
                        {items.length} {items.length === 1 ? 'item' : 'items'} in your wishlist
                    </p>
                </div>

                {items.length === 0 ? (
                    /* Empty State */
                    <div className="text-center py-12">
                        <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                            <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                            </svg>
                        </div>
                        <h3 className="text-lg font-medium text-gray-900 mb-2">Your wishlist is empty</h3>
                        <p className="text-gray-500 mb-6">Start adding items you love to your wishlist</p>
                        <Link href="/products">
                            <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                                Browse Products
                            </Button>
                        </Link>
                    </div>
                ) : (
                    /* Wishlist Items */
                    <div className="space-y-6">
                        {/* Clear All Button */}
                        <div className="flex justify-end">
                            <Button
                                onClick={handleClearWishlist}
                                className="bg-red-600 hover:bg-red-700 text-white"
                            >
                                Clear Wishlist
                            </Button>
                        </div>

                        {/* Items Grid - 2 columns on mobile, more on larger screens */}
                        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-6">
                            {items.map((item) => (
                                <div key={item.id} className="bg-white rounded-lg shadow-sm border overflow-hidden">
                                    {/* Product Image */}
                                    <div className="relative aspect-square">
                                        <img
                                            src={item.product.images?.[0] || '/images/placeholder.jpg'}
                                            alt={item.product.title}
                                            className="w-full h-full object-cover"
                                        />
                                        <button
                                            onClick={() => handleRemoveFromWishlist(item.product.id, item.size)}
                                            className="absolute top-1 right-1 md:top-2 md:right-2 p-1 md:p-2 bg-white/80 backdrop-blur-sm rounded-full shadow-md hover:shadow-lg transition-all duration-200 text-red-500 hover:bg-red-50 min-w-[32px] min-h-[32px] md:min-w-[40px] md:min-h-[40px] flex items-center justify-center"
                                            aria-label="Remove from wishlist"
                                        >
                                            <svg className="w-3 h-3 md:w-4 md:h-4" fill="currentColor" viewBox="0 0 24 24">
                                                <path d="M6 18L18 6M6 6l12 12" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                                            </svg>
                                        </button>
                                    </div>

                                    {/* Product Info */}
                                    <div className="p-2 md:p-4">
                                        <h3 className="font-medium text-gray-900 mb-1 line-clamp-2 text-xs md:text-sm">
                                            {item.product.title}
                                        </h3>
                                        <p className="text-xs text-gray-600 mb-2">
                                            Size: {item.size}
                                        </p>
                                        <div className="flex items-center justify-between mb-2 md:mb-3">
                                            <div className="flex flex-col md:flex-row md:items-center space-y-1 md:space-y-0 md:space-x-2">
                                                <span className="text-sm md:text-lg font-semibold text-gray-900">
                                                    ₹{item.product.discountPrice || item.product.price}
                                                </span>
                                                {item.product.originalPrice && item.product.originalPrice > item.product.discountPrice && (
                                                    <span className="text-xs text-gray-500 line-through">
                                                        ₹{item.product.originalPrice}
                                                    </span>
                                                )}
                                            </div>
                                        </div>

                                        {/* Add to Cart Button */}
                                        <Button
                                            onClick={() => handleAddToCart(item)}
                                            disabled={addingToCart === item.id}
                                            className="w-full bg-blue-600 hover:bg-blue-700 text-white text-xs md:text-sm py-2 md:py-3 min-h-[36px] md:min-h-[40px]"
                                        >
                                            {addingToCart === item.id ? (
                                                <div className="flex items-center justify-center">
                                                    <div className="animate-spin rounded-full h-3 w-3 md:h-4 md:w-4 border-b-2 border-white mr-1 md:mr-2"></div>
                                                    <span className="text-xs md:text-sm">Adding...</span>
                                                </div>
                                            ) : (
                                                <span className="text-xs md:text-sm">Add to Cart</span>
                                            )}
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default function WishlistPage() {
    return (
        <ProtectedRoute>
            <WishlistPageContent />
        </ProtectedRoute>
    );
}
