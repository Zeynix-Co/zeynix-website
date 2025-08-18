import { Product } from '@/data/products';
import { Order, CreateOrderData } from '@/types/order';

interface User {
    id: string;
    name: string;
    email: string;
    phone: string;
    role: 'user' | 'admin';
}

interface AuthResponse {
    success: boolean;
    message: string;
    data: {
        user: User;
        token: string;
    };
}

interface RegisterResponse {
    success: boolean;
    message: string;
    data: User;
}

interface CartResponse {
    success: boolean;
    message: string;
    data: {
        cartItem: {
            id: string;
            productId: string;
            size: string;
            quantity: number;
        };
    };
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

// Generic API request function
async function apiRequest<T>(
    endpoint: string,
    options: RequestInit = {}
): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;

    const config: RequestInit = {
        headers: {
            'Content-Type': 'application/json',
            ...options.headers,
        },
        ...options,
    };

    try {
        const response = await fetch(url, config);

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error('API request failed:', error);
        throw error;
    }
}

// Product API functions
export const productAPI = {
    // Get all products
    getAllProducts: async (params?: {
        page?: number;
        limit?: number;
        category?: string;
        sortBy?: string;
        sortOrder?: 'asc' | 'desc';
    }) => {
        const searchParams = new URLSearchParams();
        if (params?.page) searchParams.append('page', params.page.toString());
        if (params?.limit) searchParams.append('limit', params.limit.toString());
        if (params?.category) searchParams.append('category', params.category);
        if (params?.sortBy) searchParams.append('sortBy', params.sortBy);
        if (params?.sortOrder) searchParams.append('sortOrder', params.sortOrder);

        const queryString = searchParams.toString();
        const endpoint = `/api/customer/products${queryString ? `?${queryString}` : ''}`;

        return apiRequest<{
            success: boolean;
            data: {
                products: Product[];
                pagination: {
                    page: number;
                    limit: number;
                    total: number;
                    pages: number;
                };
            };
        }>(endpoint);
    },

    // Get featured products
    getFeaturedProducts: async (limit?: number) => {
        const endpoint = `/api/customer/products/featured${limit ? `?limit=${limit}` : ''}`;
        return apiRequest<{
            success: boolean;
            data: Product[];
        }>(endpoint);
    },

    // Get products by category
    getProductsByCategory: async (category: string, params?: {
        page?: number;
        limit?: number;
        sortBy?: string;
        sortOrder?: 'asc' | 'desc';
    }) => {
        const searchParams = new URLSearchParams();
        if (params?.page) searchParams.append('page', params.page.toString());
        if (params?.limit) searchParams.append('limit', params.limit.toString());
        if (params?.sortBy) searchParams.append('sortBy', params.sortBy);
        if (params?.sortOrder) searchParams.append('sortOrder', params.sortOrder);

        const queryString = searchParams.toString();
        const endpoint = `/api/customer/products/category/${category}${queryString ? `?${queryString}` : ''}`;

        return apiRequest<{
            success: boolean;
            data: {
                products: Product[];
                pagination: {
                    page: number;
                    limit: number;
                    total: number;
                    pages: number;
                };
            };
        }>(endpoint);
    },

    // Search products
    searchProducts: async (query: string, params?: {
        page?: number;
        limit?: number;
        category?: string;
        minPrice?: number;
        maxPrice?: number;
        size?: string;
    }) => {
        const searchParams = new URLSearchParams();
        searchParams.append('q', query);
        if (params?.page) searchParams.append('page', params.page.toString());
        if (params?.limit) searchParams.append('limit', params.limit.toString());
        if (params?.category) searchParams.append('category', params.category);
        if (params?.minPrice) searchParams.append('minPrice', params.minPrice.toString());
        if (params?.maxPrice) searchParams.append('maxPrice', params.maxPrice.toString());
        if (params?.size) searchParams.append('size', params.size);

        const endpoint = `/api/customer/products/search?${searchParams.toString()}`;

        return apiRequest<{
            success: boolean;
            data: {
                products: Product[];
                pagination: {
                    page: number;
                    limit: number;
                    total: number;
                    pages: number;
                };
            };
        }>(endpoint);
    },

    // Get product by ID
    getProduct: async (productId: string) => {
        const endpoint = `/api/customer/products/${productId}`;
        return apiRequest<{
            success: boolean;
            data: Product;
        }>(endpoint);
    },

    // Get products by brand
    getProductsByBrand: async (brand: string, params?: {
        page?: number;
        limit?: number;
        sortBy?: string;
        sortOrder?: 'asc' | 'desc';
    }) => {
        const searchParams = new URLSearchParams();
        if (params?.page) searchParams.append('page', params.page.toString());
        if (params?.limit) searchParams.append('limit', params.limit.toString());
        if (params?.sortBy) searchParams.append('sortBy', params.sortBy);
        if (params?.sortOrder) searchParams.append('sortOrder', params.sortOrder);

        const queryString = searchParams.toString();
        const endpoint = `/api/customer/products/brand/${brand}${queryString ? `?${queryString}` : ''}`;

        return apiRequest<{
            success: boolean;
            data: {
                products: Product[];
                pagination: {
                    page: number;
                    limit: number;
                    total: number;
                    pages: number;
                };
            };
        }>(endpoint);
    },
};

// Auth API functions
export const authAPI = {
    login: async (credentials: { email: string; password: string; rememberMe?: boolean }) => {
        return apiRequest<AuthResponse>('/api/auth/login', {
            method: 'POST',
            body: JSON.stringify(credentials),
        });
    },

    register: async (userData: {
        name: string;
        email: string;
        phone: string;
        password: string;
        confirmPassword: string;
    }) => {
        return apiRequest<RegisterResponse>('/api/auth/register', {
            method: 'POST',
            body: JSON.stringify(userData),
        });
    },
};

// Cart API functions (for future use)
export const cartAPI = {
    // Add to cart (when we implement user authentication)
    addToCart: async (productId: string, size: string, quantity: number) => {
        return apiRequest<CartResponse>('/api/cart/add', {
            method: 'POST',
            body: JSON.stringify({ productId, size, quantity }),
        });
    },
};

// Order API functions
export const orderAPI = {
    // Get orders
    getOrders: async (params?: {
        page?: number;
        limit?: number;
        status?: string;
        sortBy?: string;
        sortOrder?: 'asc' | 'desc';
    }) => {
        const searchParams = new URLSearchParams();
        if (params?.page) searchParams.append('page', params.page.toString());
        if (params?.limit) searchParams.append('limit', params.limit.toString());
        if (params?.status) searchParams.append('status', params.status);
        if (params?.sortBy) searchParams.append('sortBy', params.sortBy);
        if (params?.sortOrder) searchParams.append('sortOrder', params.sortOrder);

        const queryString = searchParams.toString();
        const endpoint = `/api/customer/orders${queryString ? `?${queryString}` : ''}`;

        return apiRequest<{
            success: boolean;
            data: {
                orders: Order[];
                pagination: {
                    page: number;
                    limit: number;
                    total: number;
                    pages: number;
                };
            };
        }>(endpoint);
    },

    // Get order by ID
    getOrder: async (orderId: string) => {
        const endpoint = `/api/customer/orders/${orderId}`;
        return apiRequest<{
            success: boolean;
            data: Order;
        }>(endpoint);
    },

    // Create order
    createOrder: async (orderData: CreateOrderData) => {
        const endpoint = '/api/customer/orders';
        return apiRequest<{
            success: boolean;
            data: Order;
        }>(endpoint, {
            method: 'POST',
            body: JSON.stringify(orderData),
        });
    },
};

export default apiRequest; 