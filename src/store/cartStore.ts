import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface CartItem {
    id: string;
    product: {
        id: string;
        title: string;
        images: string[];
        price: number;
        discountPrice?: number;
    };
    size: 'XS' | 'S' | 'M' | 'L' | 'XL' | 'XXL' | 'XXXL';
    quantity: number;
    totalPrice: number;
    customization?: {
        fit: string;
        color: string;
        customImage?: string;
        customText?: string;
        textColor?: string;
        textFont?: string;
        textSize?: string;
        placement: string;
        customizationPrice: number;
        basePrice: number;
    };
}

interface SavedItem {
    id: string;
    product: {
        id: string;
        title: string;
        images: string[];
        price: number;
        discountPrice?: number;
    };
    size: 'XS' | 'S' | 'M' | 'L' | 'XL' | 'XXL' | 'XXXL';
    quantity: number;
    totalPrice: number;
    customization?: {
        fit: string;
        color: string;
        customImage?: string;
        customText?: string;
        textColor?: string;
        textFont?: string;
        textSize?: string;
        placement: string;
        customizationPrice: number;
        basePrice: number;
    };
}

interface CartState {
    items: CartItem[];
    savedForLater: SavedItem[];
    totalItems: number;
    totalAmount: number;
    savedItemsCount: number;
}

interface CartActions {
    // Cart operations
    addToCart: (item: Omit<CartItem, 'id'>) => void;
    removeFromCart: (productId: string, size: string, customizationId?: string) => void;
    updateQuantity: (productId: string, size: string, quantity: number, customizationId?: string) => void;
    clearCart: () => void;

    // Saved for later operations
    moveToSaved: (productId: string, size: string, customizationId?: string) => void;
    moveToCart: (productId: string, size: string, customizationId?: string) => void;
    removeFromSaved: (productId: string, size: string, customizationId?: string) => void;

    // Utility
    getItemCount: () => number;
    getTotalAmount: () => number;
    getSavedItemsCount: () => number;
    isInCart: (productId: string, size: string, customization?: any) => boolean;
}

const useCartStore = create<CartState & CartActions>()(
    persist(
        (set, get) => ({
            // Initial state
            items: [],
            savedForLater: [],
            totalItems: 0,
            totalAmount: 0,
            savedItemsCount: 0,

            // Cart operations
            addToCart: (item) => {
                const { items } = get();
                const existingItem = items.find(
                    (i) => i.product.id === item.product.id && 
                           i.size === item.size && 
                           JSON.stringify(i.customization) === JSON.stringify(item.customization)
                );

                const itemUnitPrice = item.customization
                    ? (item.customization.basePrice + item.customization.customizationPrice)
                    : ((item.product.discountPrice && item.product.discountPrice < item.product.price) ? item.product.discountPrice : item.product.price);

                if (existingItem) {
                    // Update existing item
                    const updatedItems = items.map((i) =>
                        i.product.id === item.product.id && 
                        i.size === item.size && 
                        JSON.stringify(i.customization) === JSON.stringify(item.customization)
                            ? {
                                ...i,
                                quantity: i.quantity + item.quantity,
                                totalPrice: (i.quantity + item.quantity) * itemUnitPrice
                            }
                            : i
                    );
                    set({ items: updatedItems });
                } else {
                    // Add new item
                    const customSuffix = item.customization ? `-custom-${Date.now()}` : '';
                    const newItem = {
                        ...item,
                        id: `${item.product.id}-${item.size}${customSuffix}-${Date.now()}`,
                        totalPrice: item.quantity * itemUnitPrice
                    };
                    set({ items: [...items, newItem] });
                }

                // Recalculate totals
                get().getItemCount();
                get().getTotalAmount();
            },

            removeFromCart: (productId, size, customizationId) => {
                const { items } = get();
                const updatedItems = items.filter(
                    (i) => {
                        if (customizationId) {
                            return i.id !== customizationId;
                        }
                        return !(i.product.id === productId && i.size === size);
                    }
                );
                set({ items: updatedItems });

                // Recalculate totals
                get().getItemCount();
                get().getTotalAmount();
            },

            updateQuantity: (productId, size, quantity, customizationId) => {
                if (quantity <= 0) {
                    get().removeFromCart(productId, size, customizationId);
                    return;
                }

                const { items } = get();
                const updatedItems = items.map((i) => {
                    const match = customizationId 
                        ? i.id === customizationId
                        : (i.product.id === productId && i.size === size);

                    if (match) {
                        const itemUnitPrice = i.customization
                            ? (i.customization.basePrice + i.customization.customizationPrice)
                            : ((i.product.discountPrice && i.product.discountPrice < i.product.price) ? i.product.discountPrice : i.product.price);

                        return {
                            ...i,
                            quantity,
                            totalPrice: quantity * itemUnitPrice
                        };
                    }
                    return i;
                });
                set({ items: updatedItems });

                // Recalculate totals
                get().getItemCount();
                get().getTotalAmount();
            },

            clearCart: () => {
                set({
                    items: [],
                    savedForLater: [],
                    totalItems: 0,
                    totalAmount: 0,
                    savedItemsCount: 0
                });
            },

            // Saved for later operations
            moveToSaved: (productId, size, customizationId) => {
                const { items, savedForLater } = get();
                const item = items.find(
                    (i) => customizationId ? i.id === customizationId : (i.product.id === productId && i.size === size)
                );

                if (item) {
                    // Remove from cart
                    const updatedItems = items.filter(
                        (i) => customizationId ? i.id !== customizationId : !(i.product.id === productId && i.size === size)
                    );

                    // Add to saved for later
                    const savedItem = { ...item, id: `${item.product.id}-${item.size}-saved-${Date.now()}` };
                    const updatedSaved = [...savedForLater, savedItem];

                    set({
                        items: updatedItems,
                        savedForLater: updatedSaved
                    });

                    // Recalculate totals
                    const { getItemCount, getTotalAmount, getSavedItemsCount } = get();
                    getItemCount();
                    getTotalAmount();
                    getSavedItemsCount();
                }
            },

            moveToCart: (productId, size, customizationId) => {
                const { items, savedForLater } = get();
                const savedItem = savedForLater.find(
                    (i) => customizationId ? i.id === customizationId : (i.product.id === productId && i.size === size)
                );

                if (savedItem) {
                    // Remove from saved for later
                    const updatedSaved = savedForLater.filter(
                        (i) => customizationId ? i.id !== customizationId : !(i.product.id === productId && i.size === size)
                    );

                    // Add to cart
                    const cartItem = { ...savedItem, id: `${savedItem.product.id}-${savedItem.size}-${Date.now()}` };
                    const updatedItems = [...items, cartItem];

                    set({
                        items: updatedItems,
                        savedForLater: updatedSaved
                    });

                    // Recalculate totals
                    const { getItemCount, getTotalAmount, getSavedItemsCount } = get();
                    getItemCount();
                    getTotalAmount();
                    getSavedItemsCount();
                }
            },

            removeFromSaved: (productId, size, customizationId) => {
                const { savedForLater } = get();
                const updatedSaved = savedForLater.filter(
                    (i) => customizationId ? i.id !== customizationId : !(i.product.id === productId && i.size === size)
                );
                set({ savedForLater: updatedSaved });

                // Recalculate totals
                const { getSavedItemsCount } = get();
                getSavedItemsCount();
            },

            // Utility functions
            getItemCount: () => {
                const { items } = get();
                const count = items.reduce((total, item) => total + item.quantity, 0);
                set({ totalItems: count });
                return count;
            },

            getTotalAmount: () => {
                const { items } = get();
                const amount = items.reduce((total, item) => {
                    const price = item.customization
                        ? (item.customization.basePrice + item.customization.customizationPrice)
                        : ((item.product.discountPrice && item.product.discountPrice < item.product.price)
                            ? item.product.discountPrice
                            : item.product.price);
                    return total + (price * item.quantity);
                }, 0);
                set({ totalAmount: amount });
                return amount;
            },

            getSavedItemsCount: () => {
                const { savedForLater } = get();
                const count = savedForLater.reduce((total, item) => total + item.quantity, 0);
                set({ savedItemsCount: count });
                return count;
            },

            isInCart: (productId, size, customization) => {
                const { items } = get();
                return items.some((i) => i.product.id === productId && 
                                         i.size === size && 
                                         JSON.stringify(i.customization) === JSON.stringify(customization));
            },
        }),
        {
            name: 'cart-storage', // localStorage key
            partialize: (state) => ({
                items: state.items,
                savedForLater: state.savedForLater,
            }),
            onRehydrateStorage: () => (state) => {
                if (state) {
                    // Recalculate totals after rehydration
                    state.getItemCount();
                    state.getTotalAmount();
                    state.getSavedItemsCount();
                }
            },
        }
    )
);

export default useCartStore; 