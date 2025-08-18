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
                products: any[];
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
            data: any[];
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
                products: any[];
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
                products: any[];
                pagination: {
                    page: number;
                    limit: number;
                    total: number;
                    pages: number;
                };
            };
        }>(endpoint);
    },

    // Get single product
    getProduct: async (id: string) => {
        const endpoint = `/api/customer/products/${id}`;
        return apiRequest<{
            success: boolean;
            data: any;
        }>(endpoint);
    },
};

// Auth API functions
export const authAPI = {
    login: async (credentials: { email: string; password: string; rememberMe?: boolean }) => {
        return apiRequest<{
            success: boolean;
            message: string;
            data: {
                user: any;
                token: string;
            };
        }>('/api/auth/login', {
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
        return apiRequest<{
            success: boolean;
            message: string;
            data: any;
        }>('/api/auth/register', {
            method: 'POST',
            body: JSON.stringify(userData),
        });
    },
};

// Cart API functions (for future use)
export const cartAPI = {
    // Add to cart (when we implement user authentication)
    addToCart: async (productId: string, size: string, quantity: number) => {
        return apiRequest<{
            success: boolean;
            message: string;
            data: any;
        }>('/api/cart/add', {
            method: 'POST',
            body: JSON.stringify({ productId, size, quantity }),
        });
    },
};

export default apiRequest; 