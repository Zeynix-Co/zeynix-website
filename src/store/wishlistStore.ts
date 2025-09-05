import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface WishlistItem {
    id: string;
    product: {
        id: string;
        title: string;
        images: string[];
        price: number;
        originalPrice: number;
        discountPrice: number;
        category: string;
        brand?: string;
    };
    size: string;
    addedAt: string;
}

interface WishlistState {
    items: WishlistItem[];
    isLoading: boolean;
    error: string | null;
}

interface WishlistActions {
    // Core actions
    addToWishlist: (product: any, size: string) => void;
    removeFromWishlist: (productId: string, size: string) => void;
    clearWishlist: () => void;

    // Utility actions
    isInWishlist: (productId: string, size: string) => boolean;
    getWishlistCount: () => number;

    // State management
    setLoading: (loading: boolean) => void;
    setError: (error: string | null) => void;
    clearError: () => void;
}

const useWishlistStore = create<WishlistState & WishlistActions>()(
    persist(
        (set, get) => ({
            // Initial state
            items: [],
            isLoading: false,
            error: null,

            // Core actions
            addToWishlist: (product, size) => {
                const { items } = get();
                const itemId = `${product.id}-${size}`;

                // Check if already in wishlist
                const existingItem = items.find(item => item.id === itemId);
                if (existingItem) {
                    set({ error: 'Product already in wishlist' });
                    return;
                }

                const newItem: WishlistItem = {
                    id: itemId,
                    product: {
                        id: product.id,
                        title: product.title,
                        images: product.images || [],
                        price: product.price,
                        originalPrice: product.originalPrice || product.price,
                        discountPrice: product.discountPrice || product.price,
                        category: product.category || 'casual',
                        brand: product.brand || 'Zeynix'
                    },
                    size,
                    addedAt: new Date().toISOString()
                };

                set({
                    items: [...items, newItem],
                    error: null
                });
            },

            removeFromWishlist: (productId, size) => {
                const { items } = get();
                const itemId = `${productId}-${size}`;

                set({
                    items: items.filter(item => item.id !== itemId),
                    error: null
                });
            },

            clearWishlist: () => {
                set({
                    items: [],
                    error: null
                });
            },

            // Utility actions
            isInWishlist: (productId, size) => {
                const { items } = get();
                const itemId = `${productId}-${size}`;
                return items.some(item => item.id === itemId);
            },

            getWishlistCount: () => {
                const { items } = get();
                return items.length;
            },

            // State management
            setLoading: (loading) => set({ isLoading: loading }),
            setError: (error) => set({ error }),
            clearError: () => set({ error: null })
        }),
        {
            name: 'wishlist-storage',
            partialize: (state) => ({ items: state.items })
        }
    )
);

export default useWishlistStore;
