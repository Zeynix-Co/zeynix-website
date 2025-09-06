import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface User {
    id: string;
    name: string;
    email: string;
    phone: string;
    role: 'user' | 'admin';
}

interface AuthState {
    user: User | null;
    token: string | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    error: string | null;
}

interface AuthActions {
    // Actions
    login: (email: string, password: string, rememberMe?: boolean) => Promise<void>;
    register: (userData: RegisterData) => Promise<void>;
    logout: () => void;
    checkAuth: () => Promise<void>;
    clearError: () => void;
    setLoading: (loading: boolean) => void;

    // Internal state setters
    setUser: (user: User) => void;
    setToken: (token: string) => void;
    setError: (error: string) => void;
}

interface RegisterData {
    name: string;
    email: string;
    phone: string;
    password: string;
    confirmPassword: string;
}

const useAuthStore = create<AuthState & AuthActions>()(
    persist(
        (set, get) => ({
            // Initial state
            user: null,
            token: null,
            isAuthenticated: false,
            isLoading: false,
            error: null,

            // Actions
            login: async (email: string, password: string, rememberMe = false) => {
                try {
                    set({ isLoading: true, error: null });

                    const response = await fetch('/api/auth/login', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        credentials: 'include', // Include cookies for authentication
                        body: JSON.stringify({ email, password, rememberMe }),
                    });

                    const data = await response.json();

                    if (!response.ok) {
                        throw new Error(data.message || 'Login failed');
                    }

                    if (data.success) {
                        // Get token from cookies after login
                        const token = document.cookie
                            .split('; ')
                            .find(row => row.startsWith('token='))
                            ?.split('=')[1];

                        console.log('🔍 Login Debug:');
                        console.log('Response token:', data.data.token);
                        console.log('Cookie token:', token);
                        console.log('All cookies:', document.cookie);

                        set({
                            user: data.data.user,
                            token: token || data.data.token, // Use cookie token if available, fallback to response token
                            isAuthenticated: true,
                            isLoading: false,
                            error: null,
                        });
                        
                        // Verify authentication status after login
                        setTimeout(() => {
                            get().checkAuth();
                        }, 100);
                    } else {
                        throw new Error(data.message || 'Login failed');
                    }
                } catch (error) {
                    set({
                        error: error instanceof Error ? error.message : 'Login failed',
                        isLoading: false,
                    });
                    throw error;
                }
            },

            register: async (userData: RegisterData) => {
                try {
                    set({ isLoading: true, error: null });

                    const response = await fetch('/api/auth/register', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        credentials: 'include', // Include cookies for authentication
                        body: JSON.stringify(userData),
                    });

                    const data = await response.json();

                    if (!response.ok) {
                        throw new Error(data.message || 'Registration failed');
                    }

                    if (data.success) {
                        set({
                            user: data.data.user,
                            token: data.data.token,
                            isAuthenticated: true,
                            isLoading: false,
                            error: null,
                        });
                        
                        // Verify authentication status after registration
                        setTimeout(() => {
                            get().checkAuth();
                        }, 100);
                    } else {
                        throw new Error(data.message || 'Registration failed');
                    }
                } catch (error) {
                    set({
                        error: error instanceof Error ? error.message : 'Registration failed',
                        isLoading: false,
                    });
                    throw error;
                }
            },

            logout: async () => {
                try {
                    // Call logout API to clear cookie
                    await fetch('/api/auth/logout', {
                        method: 'POST',
                        credentials: 'include',
                    });
                } catch (error) {
                    console.error('Logout API error:', error);
                }

                // Clear local state
                set({
                    user: null,
                    token: null,
                    isAuthenticated: false,
                    error: null,
                });
            },

            checkAuth: async () => {
                try {
                    // Get token from cookies first
                    const token = document.cookie
                        .split('; ')
                        .find(row => row.startsWith('token='))
                        ?.split('=')[1];

                    console.log('🔍 CheckAuth Debug:');
                    console.log('Cookie token:', token);
                    console.log('All cookies:', document.cookie);

                    const response = await fetch('/api/auth/me', {
                        credentials: 'include',
                    });

                    if (response.ok) {
                        const data = await response.json();
                        if (data.success) {
                            set({
                                user: data.data.user,
                                token: token || null,
                                isAuthenticated: true,
                                error: null,
                            });
                            console.log('✅ Auth check successful, token:', token);
                        } else {
                            set({
                                user: null,
                                token: null,
                                isAuthenticated: false,
                                error: null,
                            });
                            console.log('❌ Auth check failed - no success');
                        }
                    } else {
                        set({
                            user: null,
                            token: null,
                            isAuthenticated: false,
                            error: null,
                        });
                        console.log('❌ Auth check failed - response not ok:', response.status);
                    }
                } catch (error) {
                    console.error('❌ Auth check error:', error);
                    set({
                        user: null,
                        token: null,
                        isAuthenticated: false,
                        error: null,
                    });
                }
            },

            clearError: () => set({ error: null }),
            setLoading: (loading: boolean) => set({ isLoading: loading }),
            setUser: (user: User) => set({ user }),
            setToken: (token: string) => set({ token }),
            setError: (error: string) => set({ error }),
        }),
        {
            name: 'auth-storage', // localStorage key
            partialize: (state) => ({
                user: state.user,
                isAuthenticated: state.isAuthenticated,
            }),
            onRehydrateStorage: () => (state) => {
                if (state) {
                    // Check authentication status when store rehydrates
                    state.checkAuth();
                }
            },
        }
    )
);

export default useAuthStore; 