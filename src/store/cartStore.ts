import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CartItem {
    id: string;
    product: {
        id: string;
        title: string;
        images: string[];
        price: number;
        discountPrice?: number;
    };
    size: 'XS' | 'S' | 'M' | 'L' | 'XL' | 'XXL' | 'XXXL';
    color?: string;
    quantity: number;
    totalPrice: number;
    selected?: boolean;
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

export interface SavedItem {
    id: string;
    product: {
        id: string;
        title: string;
        images: string[];
        price: number;
        discountPrice?: number;
    };
    size: 'XS' | 'S' | 'M' | 'L' | 'XL' | 'XXL' | 'XXXL';
    color?: string;
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

export interface CartState {
    items: CartItem[];
    savedForLater: SavedItem[];
    totalItems: number;
    totalAmount: number;
    savedItemsCount: number;
}

export interface CartActions {
    // Cart operations
    addToCart: (item: Omit<CartItem, 'id'>) => void;
    removeFromCart: (productId: string, size: string, customizationId?: string) => void;
    removeItemById: (itemId: string) => void;
    updateQuantity: (productId: string, size: string, quantity: number, customizationId?: string) => void;
    updateItemQuantity: (itemId: string, quantity: number) => void;
    clearCart: () => void;

    // Item selection operations
    toggleSelectItem: (itemId: string) => void;
    setItemSelected: (itemId: string, selected: boolean) => void;
    selectAllItems: () => void;
    unselectAllItems: () => void;
    removeSelectedItemsFromCart: () => void;
    getSelectedItems: () => CartItem[];
    getSelectedTotalAmount: () => number;

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
                           i.color === item.color &&
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
                        i.color === item.color &&
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
                        totalPrice: item.quantity * itemUnitPrice,
                        selected: true
                    };
                    set({ items: [...items, newItem] });
                }

                // Recalculate totals
                get().getItemCount();
                get().getTotalAmount();
            },

            // Item selection operations
            toggleSelectItem: (itemId) => {
                const { items } = get();
                const updatedItems = items.map((i) =>
                    i.id === itemId
                        ? { ...i, selected: i.selected === false ? true : false }
                        : i
                );
                set({ items: updatedItems });
            },

            setItemSelected: (itemId, selected) => {
                const { items } = get();
                const updatedItems = items.map((i) =>
                    i.id === itemId ? { ...i, selected } : i
                );
                set({ items: updatedItems });
            },

            selectAllItems: () => {
                const { items } = get();
                const updatedItems = items.map((i) => ({ ...i, selected: true }));
                set({ items: updatedItems });
            },

            unselectAllItems: () => {
                const { items } = get();
                const updatedItems = items.map((i) => ({ ...i, selected: false }));
                set({ items: updatedItems });
            },

            removeSelectedItemsFromCart: () => {
                const { items } = get();
                const remainingItems = items
                    .filter((i) => i.selected === false)
                    .map((i) => ({ ...i, selected: true }));
                set({ items: remainingItems });
                get().getItemCount();
                get().getTotalAmount();
            },

            getSelectedItems: () => {
                const { items } = get();
                return items.filter((i) => i.selected !== false);
            },

            getSelectedTotalAmount: () => {
                const { items } = get();
                const selected = items.filter((i) => i.selected !== false);
                return selected.reduce((total, item) => {
                    const price = item.customization
                        ? (item.customization.basePrice + item.customization.customizationPrice)
                        : ((item.product.discountPrice && item.product.discountPrice < item.product.price)
                            ? item.product.discountPrice
                            : item.product.price);
                    return total + (price * item.quantity);
                }, 0);
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

            removeItemById: (itemId: string) => {
                const { items } = get();
                const updatedItems = items.filter((i) => i.id !== itemId);
                set({ items: updatedItems });
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

            updateItemQuantity: (itemId: string, quantity: number) => {
                if (quantity <= 0) {
                    get().removeItemById(itemId);
                    return;
                }

                const { items } = get();
                const updatedItems = items.map((i) => {
                    if (i.id === itemId) {
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