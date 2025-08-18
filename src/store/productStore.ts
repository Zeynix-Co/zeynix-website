import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface ProductSize {
    size: string;
    inStock: boolean;
}

interface Product {
    _id?: string;
    title: string;
    brand: string;
    category: string;
    description?: string;
    actualPrice: number;
    discountPrice: number;
    discount: number;
    sizes: ProductSize[];
    images: string[];
    rating: number;
    productFit?: string;
    featured: boolean;
    status: 'draft' | 'published' | 'archived';
    isActive: boolean;
    tags?: string[];
    seoTitle?: string;
    seoDescription?: string;
    launchDate?: string;
    createdAt?: string;
    updatedAt?: string;
}

interface ProductState {
    products: Product[];
    currentProduct: Product | null;
    isLoading: boolean;
    error: string | null;
    pagination: {
        page: number;
        limit: number;
        total: number;
        pages: number;
    };
    filters: {
        category: string;
        status: string;
        search: string;
        page?: number;
        limit?: number;
    };
}

interface ProductFilters {
    page?: number;
    limit?: number;
    category?: string;
    status?: string;
    search?: string;
}

interface ProductActions {
    // CRUD Operations
    createProduct: (productData: Omit<Product, '_id' | 'createdAt' | 'updatedAt'>, userId: string) => Promise<void>;
    getAllProducts: (userId: string, filters?: ProductFilters) => Promise<void>;
    getProduct: (productId: string, userId: string) => Promise<void>;
    updateProduct: (productId: string, productData: Partial<Product>, userId: string) => Promise<void>;
    deleteProduct: (productId: string, userId: string) => Promise<void>;
    toggleProductStatus: (productId: string, status: 'draft' | 'published' | 'archived', userId: string) => Promise<void>;

    // State Management
    setCurrentProduct: (product: Product | null) => void;
    setFilters: (filters: Partial<ProductState['filters']>) => void;
    clearError: () => void;
    setLoading: (loading: boolean) => void;
}

const useProductStore = create<ProductState & ProductActions>()(
    persist(
        (set, get) => ({
            // Initial state
            products: [],
            currentProduct: null,
            isLoading: false,
            error: null,
            pagination: {
                page: 1,
                limit: 10,
                total: 0,
                pages: 0
            },
            filters: {
                category: 'all',
                status: 'all',
                search: ''
            },

            // Actions
            createProduct: async (productData: Omit<Product, '_id' | 'createdAt' | 'updatedAt'>, userId: string) => {
                try {
                    set({ isLoading: true, error: null });

                    const response = await fetch('http://localhost:8000/api/admin/products', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            ...productData,
                            userId
                        }),
                    });

                    const data = await response.json();

                    if (!response.ok) {
                        throw new Error(data.message || 'Failed to create product');
                    }

                    if (data.success) {
                        // Add new product to list
                        set(state => ({
                            products: [data.data, ...state.products],
                            isLoading: false,
                            error: null
                        }));
                    } else {
                        throw new Error(data.message || 'Failed to create product');
                    }
                } catch (error) {
                    set({
                        error: error instanceof Error ? error.message : 'Failed to create product',
                        isLoading: false,
                    });
                    throw error;
                }
            },

            getAllProducts: async (userId: string, filters: ProductFilters = {}) => {
                try {
                    set({ isLoading: true, error: null });

                    const currentFilters = get().filters;
                    const mergedFilters = { ...currentFilters, ...filters };

                    const queryParams = new URLSearchParams({
                        userId,
                        page: mergedFilters.page?.toString() || '1',
                        limit: mergedFilters.limit?.toString() || '10',
                        category: mergedFilters.category || 'all',
                        status: mergedFilters.status || 'all',
                        search: mergedFilters.search || ''
                    });

                    const response = await fetch(`http://localhost:8000/api/admin/products?${queryParams}`);

                    const data = await response.json();

                    if (!response.ok) {
                        throw new Error(data.message || 'Failed to fetch products');
                    }

                    if (data.success) {
                        set({
                            products: data.data.products,
                            pagination: data.data.pagination,
                            filters: mergedFilters,
                            isLoading: false,
                            error: null
                        });
                    } else {
                        throw new Error(data.message || 'Failed to fetch products');
                    }
                } catch (error) {
                    set({
                        error: error instanceof Error ? error.message : 'Failed to fetch products',
                        isLoading: false,
                    });
                    throw error;
                }
            },

            getProduct: async (productId: string, userId: string) => {
                try {
                    set({ isLoading: true, error: null });

                    const response = await fetch(`http://localhost:8000/api/admin/products/${productId}?userId=${userId}`);

                    const data = await response.json();

                    if (!response.ok) {
                        throw new Error(data.message || 'Failed to fetch product');
                    }

                    if (data.success) {
                        set({
                            currentProduct: data.data,
                            isLoading: false,
                            error: null
                        });
                    } else {
                        throw new Error(data.message || 'Failed to fetch product');
                    }
                } catch (error) {
                    set({
                        error: error instanceof Error ? error.message : 'Failed to fetch product',
                        isLoading: false,
                    });
                    throw error;
                }
            },

            updateProduct: async (productId: string, productData: Partial<Product>, userId: string) => {
                try {
                    set({ isLoading: true, error: null });

                    const response = await fetch(`http://localhost:8000/api/admin/products/${productId}`, {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            ...productData,
                            userId
                        }),
                    });

                    const data = await response.json();

                    if (!response.ok) {
                        throw new Error(data.message || 'Failed to update product');
                    }

                    if (data.success) {
                        // Update product in list and current product
                        set(state => ({
                            products: state.products.map(p =>
                                p._id === productId ? data.data : p
                            ),
                            currentProduct: state.currentProduct?._id === productId ? data.data : state.currentProduct,
                            isLoading: false,
                            error: null
                        }));
                    } else {
                        throw new Error(data.message || 'Failed to update product');
                    }
                } catch (error) {
                    set({
                        error: error instanceof Error ? error.message : 'Failed to update product',
                        isLoading: false,
                    });
                    throw error;
                }
            },

            deleteProduct: async (productId: string, userId: string) => {
                try {
                    set({ isLoading: true, error: null });

                    const response = await fetch(`http://localhost:8000/api/admin/products/${productId}?userId=${userId}`, {
                        method: 'DELETE',
                    });

                    const data = await response.json();

                    if (!response.ok) {
                        throw new Error(data.message || 'Failed to delete product');
                    }

                    if (data.success) {
                        // Remove product from list
                        set(state => ({
                            products: state.products.filter(p => p._id !== productId),
                            currentProduct: state.currentProduct?._id === productId ? null : state.currentProduct,
                            isLoading: false,
                            error: null
                        }));
                    } else {
                        throw new Error(data.message || 'Failed to delete product');
                    }
                } catch (error) {
                    set({
                        error: error instanceof Error ? error.message : 'Failed to delete product',
                        isLoading: false,
                    });
                    throw error;
                }
            },

            toggleProductStatus: async (productId: string, status: 'draft' | 'published' | 'archived', userId: string) => {
                try {
                    set({ isLoading: true, error: null });

                    const response = await fetch(`http://localhost:8000/api/admin/products/${productId}/toggle-status`, {
                        method: 'PATCH',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            status,
                            userId
                        }),
                    });

                    const data = await response.json();

                    if (!response.ok) {
                        throw new Error(data.message || 'Failed to update product status');
                    }

                    if (data.success) {
                        // Update product status in list and current product
                        set(state => ({
                            products: state.products.map(p =>
                                p._id === productId ? { ...p, status } : p
                            ),
                            currentProduct: state.currentProduct?._id === productId
                                ? { ...state.currentProduct, status }
                                : state.currentProduct,
                            isLoading: false,
                            error: null
                        }));
                    } else {
                        throw new Error(data.message || 'Failed to update product status');
                    }
                } catch (error) {
                    set({
                        error: error instanceof Error ? error.message : 'Failed to update product status',
                        isLoading: false,
                    });
                    throw error;
                }
            },

            // State setters
            setCurrentProduct: (product: Product | null) => set({ currentProduct: product }),
            setFilters: (filters: Partial<ProductState['filters']>) => set(state => ({
                filters: { ...state.filters, ...filters }
            })),
            clearError: () => set({ error: null }),
            setLoading: (loading: boolean) => set({ isLoading: loading }),
        }),
        {
            name: 'product-storage',
            partialize: (state) => ({
                filters: state.filters,
                pagination: state.pagination
            }),
        }
    )
);

export default useProductStore;
