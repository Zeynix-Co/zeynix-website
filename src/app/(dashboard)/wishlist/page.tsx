'use client';

import { useState } from 'react';
import { useWishlistStore, useCartStore } from '@/store';
import type { WishlistItem } from '@/store/wishlistStore';
import { Button } from '@/components/ui/Button';
import { colorClasses } from '@/lib/constants';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
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
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <Header />

            <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 lg:px-8 py-6 sm:py-8">
                {/* Header */}
                <div className="mb-6 sm:mb-8">
                    <h1 className={`text-2xl sm:text-3xl font-black uppercase tracking-tight ${colorClasses.primary.text}`}>
                        My Wishlist
                    </h1>
                    <p className="text-xs sm:text-sm text-gray-600 mt-1">
                        {items.length} {items.length === 1 ? 'item' : 'items'} in your wishlist
                    </p>
                </div>

                {items.length === 0 ? (
                    /* Empty State */
                    <div className="text-center py-12 bg-white rounded-2xl border border-gray-100 p-8 max-w-md mx-auto shadow-sm">
                        <div className="mx-auto w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4 text-[#B5945B]">
                            <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                            </svg>
                        </div>
                        <h3 className="text-lg font-bold text-gray-900 mb-1 uppercase">Your wishlist is empty</h3>
                        <p className="text-xs text-gray-500 mb-6">Start adding items you love to your wishlist</p>
                        <a 
                            href="/products"
                            className="inline-block bg-[#070F2B] text-white py-3 px-6 font-bold uppercase tracking-wider text-xs shadow-[3px_3px_0px_#B5945B] hover:bg-[#B5945B] hover:text-[#070F2B] transition-colors"
                        >
                            Browse Products
                        </a>
                    </div>
                ) : (
                    /* Wishlist Items */
                    <div className="space-y-6">
                        {/* Clear All Button */}
                        <div className="flex justify-end">
                            <button
                                onClick={handleClearWishlist}
                                className="text-xs font-bold uppercase tracking-wider text-red-500 hover:text-red-700 py-2 px-3 transition-colors cursor-pointer"
                            >
                                Clear Wishlist
                            </button>
                        </div>

                        {/* Items Grid - 2 columns on mobile, more on larger screens */}
                        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2.5 sm:gap-4 md:gap-6">
                            {items.map((item) => (
                                <div key={item.id} className="bg-white rounded-xl shadow-xs border border-gray-100 overflow-hidden flex flex-col justify-between h-full">
                                    {/* Product Image */}
                                    <div className="relative aspect-square">
                                        <img
                                            src={item.product.images?.[0] || '/images/placeholder.jpg'}
                                            alt={item.product.title}
                                            className="w-full h-full object-cover"
                                        />
                                        <button
                                            onClick={() => handleRemoveFromWishlist(item.product.id, item.size)}
                                            className="absolute top-1.5 right-1.5 md:top-2 md:right-2 p-1.5 bg-white/90 backdrop-blur-sm rounded-full shadow-sm hover:shadow-md transition-all duration-200 text-red-500 hover:bg-red-50 min-w-[32px] min-h-[32px] flex items-center justify-center cursor-pointer"
                                            aria-label="Remove from wishlist"
                                        >
                                            <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                                                <path d="M6 18L18 6M6 6l12 12" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                                            </svg>
                                        </button>
                                    </div>

                                    {/* Product Info */}
                                    <div className="p-2.5 sm:p-4 flex-1 flex flex-col justify-between">
                                        <div>
                                            <h3 className="font-bold text-gray-900 mb-1 line-clamp-1 text-xs uppercase">
                                                {item.product.title}
                                            </h3>
                                            <p className="text-[10px] text-gray-500 mb-1.5 font-semibold">
                                                Size: {item.size}
                                            </p>
                                            <div className="flex items-center gap-1.5 mb-3">
                                                <span className="text-xs sm:text-sm font-black text-[#070F2B]">
                                                    ₹{item.product.discountPrice || item.product.price}
                                                </span>
                                                {item.product.originalPrice && item.product.originalPrice > item.product.discountPrice && (
                                                    <span className="text-[10px] text-gray-400 line-through font-semibold">
                                                        ₹{item.product.originalPrice}
                                                    </span>
                                                )}
                                            </div>
                                        </div>

                                        {/* Add to Cart Button */}
                                        <button
                                            onClick={() => handleAddToCart(item)}
                                            disabled={addingToCart === item.id}
                                            className="w-full bg-[#070F2B] text-white hover:bg-[#B5945B] hover:text-[#070F2B] font-bold uppercase tracking-wider text-[10px] py-2 sm:py-2.5 min-h-[36px] transition-colors cursor-pointer"
                                        >
                                            {addingToCart === item.id ? (
                                                <div className="flex items-center justify-center">
                                                    <div className="animate-spin rounded-full h-3 w-3 border-2 border-white border-t-transparent mr-1.5"></div>
                                                    <span>Adding...</span>
                                                </div>
                                            ) : (
                                                <span>Add to Cart</span>
                                            )}
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </main>

            <Footer />
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
