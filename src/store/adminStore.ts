import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AdminUser {
    id: string;
    name: string;
    email: string;
    phone: string;
    role: 'admin';
}

interface Order {
    _id: string;
    orderNumber: string;
    user?: {
        _id: string;
        name: string;
        email: string;
        phone?: string;
    };
    items: Array<{
        _id?: string;
        product: {
            _id: string;
            title: string;
            images: string[];
            actualPrice: number;
            brand?: string;
            category?: string;
        };
        size: string;
        quantity: number;
        price: number;
        totalPrice: number;
    }>;
    status: 'pending' | 'confirmed' | 'delivered' | 'cancelled';
    totalAmount: number;
    deliveryAddress: {
        street: string;
        city: string;
        state: string;
        pincode: string;
    };
    deliveryInstructions?: string;
    expectedDelivery: string;
    paymentMethod: string;
    paymentStatus: 'pending' | 'completed' | 'failed' | 'refunded';
    razorpayOrderId?: string;
    razorpayPaymentId?: string;
    itemCount: number;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
}

interface OrdersData {
    orders: Order[];
    pagination: {
        currentPage: number;
        totalPages: number;
        totalOrders: number;
        hasNext: boolean;
        hasPrev: boolean;
        limit: number;
    };
}

interface Product {
    _id: string;
    title: string;
    sizes: Array<{
        size: string;
        stock: number;
    }>;
}

interface DashboardData {
    stats: {
        totalProducts: number;
        totalOrders: number;
        totalUsers: number;
        pendingOrders: number;
        totalRevenue: number;
    };
    recentOrders: Order[];
    lowStockProducts: Product[];
}

interface AdminState {
    user: AdminUser | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    error: string | null;
    dashboardData: DashboardData | null;
    ordersData: OrdersData | null;
    selectedOrder: Order | null;
    ordersLoading: boolean;
}

interface AdminActions {
    // Authentication Actions
    login: (email: string, password: string) => Promise<void>;
    logout: () => void;
    setupFirstAdmin: (userData: SetupAdminData) => Promise<void>;

    // Dashboard Actions
    getDashboardData: () => Promise<void>;

    // Order Management Actions
    getAllOrders: (params?: OrderFilters) => Promise<void>;
    getOrderById: (orderId: string) => Promise<void>;
    updateOrderStatus: (orderId: string, status: string) => Promise<void>;
    updateOrder: (orderId: string, updateData: Partial<Order>) => Promise<void>;
    deleteOrder: (orderId: string) => Promise<void>;

    // Utility Actions
    clearError: () => void;
    setLoading: (loading: boolean) => void;
    setOrdersLoading: (loading: boolean) => void;

    // Internal state setters
    setUser: (user: AdminUser) => void;
    setError: (error: string) => void;
    setDashboardData: (data: DashboardData) => void;
    setOrdersData: (data: OrdersData) => void;
    setSelectedOrder: (order: Order | null) => void;
}

interface OrderFilters {
    page?: number;
    limit?: number;
    status?: string;
    paymentStatus?: string;
    search?: string;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
}

interface SetupAdminData {
    name: string;
    email: string;
    phone: string;
    password: string;
}

const useAdminStore = create<AdminState & AdminActions>()(
    persist(
        (set, get) => ({
            // Initial state
            user: null,
            isAuthenticated: false,
            isLoading: false,
            error: null,
            dashboardData: null,
            ordersData: null,
            selectedOrder: null,
            ordersLoading: false,

            // Actions
            login: async (email: string, password: string) => {
                try {
                    set({ isLoading: true, error: null });

                    const response = await fetch('/api/admin/login', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ email, password }),
                    });

                    const data = await response.json();

                    if (!response.ok) {
                        throw new Error(data.message || 'Admin login failed');
                    }

                    if (data.success) {
                        set({
                            user: data.data.user,
                            isAuthenticated: true,
                            isLoading: false,
                            error: null,
                        });
                    } else {
                        throw new Error(data.message || 'Admin login failed');
                    }
                } catch (error) {
                    set({
                        error: error instanceof Error ? error.message : 'Admin login failed',
                        isLoading: false,
                    });
                    throw error;
                }
            },

            setupFirstAdmin: async (userData: SetupAdminData) => {
                try {
                    set({ isLoading: true, error: null });

                    const response = await fetch('/api/admin/setup', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(userData),
                    });

                    const data = await response.json();

                    if (!response.ok) {
                        throw new Error(data.message || 'Admin setup failed');
                    }

                    if (data.success) {
                        set({
                            user: data.data.user,
                            isAuthenticated: true,
                            isLoading: false,
                            error: null,
                        });
                    } else {
                        throw new Error(data.message || 'Admin setup failed');
                    }
                } catch (error) {
                    set({
                        error: error instanceof Error ? error.message : 'Admin setup failed',
                        isLoading: false,
                    });
                    throw error;
                }
            },

            logout: () => {
                // Clear local state
                set({
                    user: null,
                    isAuthenticated: false,
                    error: null,
                    dashboardData: null,
                    ordersData: null,
                    selectedOrder: null,
                });
            },

            getDashboardData: async () => {
                try {
                    const { user } = get();

                    if (!user) {
                        throw new Error('No user authenticated');
                    }

                    const response = await fetch('/api/admin/dashboard', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ userId: user.id }),
                    });

                    const data = await response.json();

                    if (!response.ok) {
                        throw new Error(data.message || 'Failed to fetch dashboard data');
                    }

                    if (data.success) {
                        set({ dashboardData: data.data });
                    } else {
                        throw new Error(data.message || 'Failed to fetch dashboard data');
                    }
                } catch (error) {
                    set({
                        error: error instanceof Error ? error.message : 'Failed to fetch dashboard data',
                    });
                    throw error;
                }
            },

            // Order Management Actions
            getAllOrders: async (params: OrderFilters = {}) => {
                try {
                    const { user } = get();

                    if (!user) {
                        throw new Error('No user authenticated');
                    }

                    set({ ordersLoading: true, error: null });

                    // Build query parameters
                    const searchParams = new URLSearchParams({
                        userId: user.id,
                        page: (params.page || 1).toString(),
                        limit: (params.limit || 10).toString(),
                    });

                    if (params.status) searchParams.append('status', params.status);
                    if (params.paymentStatus) searchParams.append('paymentStatus', params.paymentStatus);
                    if (params.search) searchParams.append('search', params.search);
                    if (params.sortBy) searchParams.append('sortBy', params.sortBy);
                    if (params.sortOrder) searchParams.append('sortOrder', params.sortOrder);

                    const response = await fetch(`/api/admin/orders?${searchParams.toString()}`, {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                    });

                    const data = await response.json();

                    if (!response.ok) {
                        throw new Error(data.message || 'Failed to fetch orders');
                    }

                    if (data.success) {
                        set({ ordersData: data.data, ordersLoading: false });
                    } else {
                        throw new Error(data.message || 'Failed to fetch orders');
                    }
                } catch (error) {
                    set({
                        error: error instanceof Error ? error.message : 'Failed to fetch orders',
                        ordersLoading: false,
                    });
                    throw error;
                }
            },

            getOrderById: async (orderId: string) => {
                try {
                    const { user } = get();

                    if (!user) {
                        throw new Error('No user authenticated');
                    }

                    set({ ordersLoading: true, error: null });

                    const response = await fetch(`/api/admin/orders/${orderId}?userId=${user.id}`, {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                    });

                    const data = await response.json();

                    if (!response.ok) {
                        throw new Error(data.message || 'Failed to fetch order details');
                    }

                    if (data.success) {
                        set({ selectedOrder: data.data.order, ordersLoading: false });
                    } else {
                        throw new Error(data.message || 'Failed to fetch order details');
                    }
                } catch (error) {
                    set({
                        error: error instanceof Error ? error.message : 'Failed to fetch order details',
                        ordersLoading: false,
                    });
                    throw error;
                }
            },

            updateOrderStatus: async (orderId: string, status: string) => {
                try {
                    const { user } = get();

                    if (!user) {
                        throw new Error('No user authenticated');
                    }

                    set({ ordersLoading: true, error: null });

                    const response = await fetch(`/api/admin/orders/${orderId}/status`, {
                        method: 'PATCH',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ userId: user.id, status }),
                    });

                    const data = await response.json();

                    if (!response.ok) {
                        throw new Error(data.message || 'Failed to update order status');
                    }

                    if (data.success) {
                        // Update the order in the orders list
                        const { ordersData, selectedOrder } = get();

                        if (ordersData) {
                            const updatedOrders = ordersData.orders.map(order =>
                                order._id === orderId ? { ...order, status: status as Order['status'] } : order
                            );
                            set({ ordersData: { ...ordersData, orders: updatedOrders } });
                        }

                        // Update selected order if it matches
                        if (selectedOrder && selectedOrder._id === orderId) {
                            set({ selectedOrder: { ...selectedOrder, status: status as Order['status'] } });
                        }

                        set({ ordersLoading: false });
                    } else {
                        throw new Error(data.message || 'Failed to update order status');
                    }
                } catch (error) {
                    set({
                        error: error instanceof Error ? error.message : 'Failed to update order status',
                        ordersLoading: false,
                    });
                    throw error;
                }
            },

            updateOrder: async (orderId: string, updateData: Partial<Order>) => {
                try {
                    const { user } = get();

                    if (!user) {
                        throw new Error('No user authenticated');
                    }

                    set({ ordersLoading: true, error: null });

                    const response = await fetch(`/api/admin/orders/${orderId}`, {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ userId: user.id, updateData }),
                    });

                    const data = await response.json();

                    if (!response.ok) {
                        throw new Error(data.message || 'Failed to update order');
                    }

                    if (data.success) {
                        // Update the order in the orders list
                        const { ordersData, selectedOrder } = get();

                        if (ordersData) {
                            const updatedOrders = ordersData.orders.map(order =>
                                order._id === orderId ? data.data.order : order
                            );
                            set({ ordersData: { ...ordersData, orders: updatedOrders } });
                        }

                        // Update selected order if it matches
                        if (selectedOrder && selectedOrder._id === orderId) {
                            set({ selectedOrder: data.data.order });
                        }

                        set({ ordersLoading: false });
                    } else {
                        throw new Error(data.message || 'Failed to update order');
                    }
                } catch (error) {
                    set({
                        error: error instanceof Error ? error.message : 'Failed to update order',
                        ordersLoading: false,
                    });
                    throw error;
                }
            },

            deleteOrder: async (orderId: string) => {
                try {
                    const { user } = get();

                    if (!user) {
                        throw new Error('No user authenticated');
                    }

                    set({ ordersLoading: true, error: null });

                    const response = await fetch(`/api/admin/orders/${orderId}`, {
                        method: 'DELETE',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ userId: user.id }),
                    });

                    const data = await response.json();

                    if (!response.ok) {
                        throw new Error(data.message || 'Failed to delete order');
                    }

                    if (data.success) {
                        // Remove the order from the orders list
                        const { ordersData } = get();

                        if (ordersData) {
                            const updatedOrders = ordersData.orders.filter(order => order._id !== orderId);
                            set({
                                ordersData: {
                                    ...ordersData,
                                    orders: updatedOrders,
                                    pagination: {
                                        ...ordersData.pagination,
                                        totalOrders: ordersData.pagination.totalOrders - 1
                                    }
                                }
                            });
                        }

                        // Clear selected order if it matches
                        const { selectedOrder } = get();
                        if (selectedOrder && selectedOrder._id === orderId) {
                            set({ selectedOrder: null });
                        }

                        set({ ordersLoading: false });
                    } else {
                        throw new Error(data.message || 'Failed to delete order');
                    }
                } catch (error) {
                    set({
                        error: error instanceof Error ? error.message : 'Failed to delete order',
                        ordersLoading: false,
                    });
                    throw error;
                }
            },

            // Utility Actions
            clearError: () => set({ error: null }),
            setLoading: (loading: boolean) => set({ isLoading: loading }),
            setOrdersLoading: (loading: boolean) => set({ ordersLoading: loading }),
            setUser: (user: AdminUser) => set({ user }),
            setError: (error: string) => set({ error }),
            setDashboardData: (data: DashboardData) => set({ dashboardData: data }),
            setOrdersData: (data: OrdersData) => set({ ordersData: data }),
            setSelectedOrder: (order: Order | null) => set({ selectedOrder: order }),
        }),
        {
            name: 'admin-storage', // localStorage key
            partialize: (state) => ({
                user: state.user,
                isAuthenticated: state.isAuthenticated,
            }),
        }
    )
);

export default useAdminStore;
