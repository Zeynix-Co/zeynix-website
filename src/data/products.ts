export interface Product {
    id: string;
    name: string;
    brand: string;
    price: number;
    originalPrice: number;
    rating: number;
    image: string;
    images: string[];
    category: string;
    size: string[];
    label?: string;
    description?: string;
    inStock?: boolean;
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