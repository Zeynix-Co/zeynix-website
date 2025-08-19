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
        name: string;
    };
    status: 'pending' | 'confirmed' | 'delivered' | 'cancelled';
    totalAmount: number;
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
}

interface AdminActions {
    // Actions
    login: (email: string, password: string) => Promise<void>;
    logout: () => void;
    setupFirstAdmin: (userData: SetupAdminData) => Promise<void>;
    getDashboardData: () => Promise<void>;
    clearError: () => void;
    setLoading: (loading: boolean) => void;

    // Internal state setters
    setUser: (user: AdminUser) => void;
    setError: (error: string) => void;
    setDashboardData: (data: DashboardData) => void;
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

            clearError: () => set({ error: null }),
            setLoading: (loading: boolean) => set({ isLoading: loading }),
            setUser: (user: AdminUser) => set({ user }),
            setError: (error: string) => set({ error }),
            setDashboardData: (data: DashboardData) => set({ dashboardData: data }),
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
