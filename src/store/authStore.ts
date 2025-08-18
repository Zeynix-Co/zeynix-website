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

                    const response = await fetch('http://localhost:8000/api/auth/login', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ email, password, rememberMe }),
                    });

                    const data = await response.json();

                    if (!response.ok) {
                        throw new Error(data.message || 'Login failed');
                    }

                    if (data.success) {
                        set({
                            user: data.data.user,
                            token: data.data.token,
                            isAuthenticated: true,
                            isLoading: false,
                            error: null,
                        });
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

                    const response = await fetch('http://localhost:8000/api/auth/register', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
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

            logout: () => {
                // Call logout API
                if (get().token) {
                    fetch('http://localhost:8000/api/auth/logout', {
                        method: 'POST',
                        headers: {
                            'Authorization': `Bearer ${get().token}`,
                        },
                    }).catch(console.error); // Don't block logout on API failure
                }

                // Clear local state
                set({
                    user: null,
                    token: null,
                    isAuthenticated: false,
                    error: null,
                });
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
                token: state.token,
                isAuthenticated: state.isAuthenticated,
            }),
        }
    )
);

export default useAuthStore; 