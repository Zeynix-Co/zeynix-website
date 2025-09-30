import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface OrderItem {
    product: {
        _id: string;
        title: string;
        images: string[];
        discountedPrice: number;
    };
    size: string;
    quantity: number;
    price: number;
}

interface Order {
    _id: string;
    orderNumber: string;
    user: {
        _id: string;
        name: string;
        email: string;
        phone: string;
    };
    items: OrderItem[];
    status: 'pending' | 'confirmed' | 'delivered' | 'cancelled';
    totalAmount: number;
    deliveryAddress: {
        street: string;
        city: string;
        state: string;
        pincode: string;
        country: string;
    };
    paymentMethod: string;
    paymentStatus: 'pending' | 'completed' | 'failed';
    createdAt: string;
    updatedAt: string;
}

interface OrderState {
    orders: Order[];
    currentOrder: Order | null;
    isLoading: boolean;
    error: string | null;
    pagination: {
        page: number;
        limit: number;
        total: number;
        pages: number;
    };
    filters: {
        status: string;
        paymentStatus: string;
        search: string;
        page?: number;
        limit?: number;
    };
}

interface OrderFilters {
    page?: number;
    limit?: number;
    status?: string;
    paymentStatus?: string;
    search?: string;
}

interface OrderActions {
    // CRUD Operations
    getAllOrders: (userId: string, filters?: OrderFilters) => Promise<void>;
    getOrder: (orderId: string, userId: string) => Promise<void>;
    updateOrderStatus: (orderId: string, status: string, userId: string) => Promise<void>;

    // State Management
    setCurrentOrder: (order: Order | null) => void;
    setFilters: (filters: Partial<OrderState['filters']>) => void;
    clearError: () => void;
    setLoading: (loading: boolean) => void;
}

const useOrderStore = create<OrderState & OrderActions>()(
    persist(
        (set, get) => ({
            // Initial state
            orders: [],
            currentOrder: null,
            isLoading: false,
            error: null,
            pagination: {
                page: 1,
                limit: 10,
                total: 0,
                pages: 0
            },
            filters: {
                status: 'all',
                paymentStatus: 'all',
                search: ''
            },

            // Actions
            getAllOrders: async (userId: string, filters = {}) => {
                try {
                    set({ isLoading: true, error: null });

                    const currentFilters = get().filters;
                    const mergedFilters = { ...currentFilters, ...filters };

                    const queryParams = new URLSearchParams({
                        userId,
                        page: mergedFilters.page?.toString() || '1',
                        limit: mergedFilters.limit?.toString() || '10',
                        status: mergedFilters.status || 'all',
                        paymentStatus: mergedFilters.paymentStatus || 'all',
                        search: mergedFilters.search || ''
                    });

                    const response = await fetch(`/api/admin/orders?${queryParams}`, {
                        credentials: 'include',
                    });

                    const data = await response.json();

                    if (!response.ok) {
                        throw new Error(data.message || 'Failed to fetch orders');
                    }

                    if (data.success) {
                        set({
                            orders: data.data.orders,
                            pagination: data.data.pagination,
                            filters: mergedFilters,
                            isLoading: false,
                            error: null
                        });
                    } else {
                        throw new Error(data.message || 'Failed to fetch orders');
                    }
                } catch (error) {
                    set({
                        error: error instanceof Error ? error.message : 'Failed to fetch orders',
                        isLoading: false,
                    });
                    throw error;
                }
            },

            getOrder: async (orderId: string, userId: string) => {
                try {
                    set({ isLoading: true, error: null });

                    const response = await fetch(`/api/admin/orders/${orderId}?userId=${userId}`, {
                        credentials: 'include',
                    });

                    const data = await response.json();

                    if (!response.ok) {
                        throw new Error(data.message || 'Failed to fetch order');
                    }

                    if (data.success) {
                        set({
                            currentOrder: data.data,
                            isLoading: false,
                            error: null
                        });
                    } else {
                        throw new Error(data.message || 'Failed to fetch order');
                    }
                } catch (error) {
                    set({
                        error: error instanceof Error ? error.message : 'Failed to fetch order',
                        isLoading: false,
                    });
                    throw error;
                }
            },

            updateOrderStatus: async (orderId: string, status: string, userId: string) => {
                try {
                    set({ isLoading: true, error: null });

                    const response = await fetch(`/api/admin/orders/${orderId}/status`, {
                        method: 'PATCH',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        credentials: 'include',
                        body: JSON.stringify({
                            status,
                            userId
                        }),
                    });

                    const data = await response.json();

                    if (!response.ok) {
                        throw new Error(data.message || 'Failed to update order status');
                    }

                    if (data.success) {
                        // Update order status in list and current order
                        set(state => ({
                            orders: state.orders.map(o =>
                                o._id === orderId ? { ...o, status: status as 'pending' | 'confirmed' | 'delivered' | 'cancelled' } : o
                            ),
                            currentOrder: state.currentOrder?._id === orderId
                                ? { ...state.currentOrder, status: status as 'pending' | 'confirmed' | 'delivered' | 'cancelled' }
                                : state.currentOrder,
                            isLoading: false,
                            error: null
                        }));
                    } else {
                        throw new Error(data.message || 'Failed to update order status');
                    }
                } catch (error) {
                    set({
                        error: error instanceof Error ? error.message : 'Failed to update order status',
                        isLoading: false,
                    });
                    throw error;
                }
            },

            // State setters
            setCurrentOrder: (order: Order | null) => set({ currentOrder: order }),
            setFilters: (filters: Partial<OrderState['filters']>) => set(state => ({
                filters: { ...state.filters, ...filters }
            })),
            clearError: () => set({ error: null }),
            setLoading: (loading: boolean) => set({ isLoading: loading }),
        }),
        {
            name: 'order-storage',
            partialize: (state) => ({
                filters: state.filters,
                pagination: state.pagination
            }),
        }
    )
);

export default useOrderStore;
