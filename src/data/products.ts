export interface Product {
    id: string;
    name: string;
    slug?: string;
    productId?: string;
    brand: string;
    price: number;
    originalPrice: number;
    rating: number;
    totalRatings?: number;
    image: string;
    mainImage?: string;
    images: string[];
    category: string;
    subcategory?: string;
    size: string[];
    sizes?: Array<{
        size: string;
        stock: number;
        inStock: boolean;
    }>;
    label?: string;
    productFit?: string;
    description?: string;
    inStock?: boolean;
    availableStock?: number;
    featured?: boolean;
    discount?: number;
}

// Remove mock products - we'll fetch from API
export const mockProducts: Product[] = [];

// Utility functions for filtering products (will be updated to work with API data)
export const getProductsByCategory = (category: string): Product[] => {
    if (category === "All") return mockProducts;
    return mockProducts.filter(product => product.category === category);
};

export const getFeaturedProducts = (): Product[] => {
    return mockProducts.filter(product => product.featured);
};

export const getProductsBySize = (size: string): Product[] => {
    return mockProducts.filter(product => product.size.includes(size));
};

export const getProductsByPriceRange = (min: number, max: number): Product[] => {
    return mockProducts.filter(product => product.price >= min && product.price <= max);
};

export const calculateDiscount = (original: number, current: number): number => {
    return Math.round(((original - current) / original) * 100);
}; 