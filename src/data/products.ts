export interface Product {
    id: number;
    name: string;
    brand: string;
    price: number;
    originalPrice: number;
    rating: number;
    image: string;
    category: string;
    size: string[];
    label?: string;
    description?: string;
    inStock?: boolean;
    featured?: boolean;
}

export const mockProducts: Product[] = [
    {
        id: 1,
        name: "Men's Blue Seek Balance Oversized T-Shirt",
        brand: "Zeynix",
        price: 499,
        originalPrice: 1499,
        rating: 4.4,
        image: "/images/products/product1.jpg",
        category: "T-Shirts",
        size: ["S", "M", "L", "XL"],
        label: "OVERSIZED FIT",
        description: "Comfortable oversized fit t-shirt perfect for casual wear",
        inStock: true,
        featured: true
    },
    {
        id: 2,
        name: "Men's White Better & Better T-Shirt",
        brand: "Zeynix",
        price: 499,
        originalPrice: 1299,
        rating: 4.2,
        image: "/images/products/product2.jpg",
        category: "T-Shirts",
        size: ["S", "M", "L"],
        label: "CASUALb FIT",
        description: "Premium cotton t-shirt with modern fit",
        inStock: true,
        featured: true
    },
    {
        id: 3,
        name: "Men's Black Comfort Zone T-Shirt",
        brand: "Zeynix",
        price: 599,
        originalPrice: 1499,
        rating: 4.6,
        image: "/images/products/product3.jpg",
        category: "T-Shirts",
        size: ["M", "L", "XL"],
        label: "CASUALb FIT",
        description: "Ultra-comfortable black t-shirt for everyday wear",
        inStock: true,
        featured: true
    },
    {
        id: 4,
        name: "Men's Gray Urban Style T-Shirt",
        brand: "Zeynix",
        price: 449,
        originalPrice: 1199,
        rating: 4.3,
        image: "/images/products/product4.jpg",
        category: "T-Shirts",
        size: ["S", "M", "L", "XL"],
        label: "OVERSIZED FIT",
        description: "Urban style gray t-shirt with street fashion appeal",
        inStock: true,
        featured: true
    },
    {
        id: 5,
        name: "Men's Red Street Fashion T-Shirt",
        brand: "Zeynix",
        price: 549,
        originalPrice: 1399,
        rating: 4.5,
        image: "/images/products/product5.jpg",
        category: "T-Shirts",
        size: ["S", "M", "L"],
        label: "OVERSIZED FIT",
        description: "Bold red t-shirt for street fashion enthusiasts",
        inStock: true,
        featured: true
    },
    {
        id: 6,
        name: "Men's Denim Casual Shirt",
        brand: "Zeynix",
        price: 799,
        originalPrice: 1899,
        rating: 4.7,
        image: "/images/products/product6.jpg",
        category: "Shirts",
        size: ["M", "L", "XL"],
        label: "CASUAL FIT",
        description: "Classic denim shirt perfect for casual occasions",
        inStock: true,
        featured: false
    },
    {
        id: 7,
        name: "Men's Formal White Shirt",
        brand: "Zeynix",
        price: 899,
        originalPrice: 1999,
        rating: 4.8,
        image: "/images/products/product7.jpg",
        category: "Shirts",
        size: ["S", "M", "L", "XL"],
        label: "FORMAL FIT",
        description: "Professional white shirt for formal occasions",
        inStock: true,
        featured: false
    },
    {
        id: 8,
        name: "Men's Casual Jeans",
        brand: "Zeynix",
        price: 1299,
        originalPrice: 2499,
        rating: 4.6,
        image: "/images/products/product8.jpg",
        category: "Jeans",
        size: ["30", "32", "34", "36"],
        label: "STRAIGHT FIT",
        description: "Comfortable straight-fit jeans for everyday wear",
        inStock: true,
        featured: false
    },
    {
        id: 9,
        name: "Men's Slim Fit Jeans",
        brand: "Zeynix",
        price: 1499,
        originalPrice: 2799,
        rating: 4.4,
        image: "/images/products/product9.jpg",
        category: "Jeans",
        size: ["30", "32", "34"],
        label: "SLIM FIT",
        description: "Modern slim-fit jeans with stretch comfort",
        inStock: true,
        featured: false
    },
    {
        id: 10,
        name: "Men's Cargo Pants",
        brand: "Zeynix",
        price: 999,
        originalPrice: 1999,
        rating: 4.3,
        image: "/images/products/product10.jpg",
        category: "Pants",
        size: ["S", "M", "L", "XL"],
        label: "CARGO FIT",
        description: "Functional cargo pants with multiple pockets",
        inStock: true,
        featured: false
    },
    {
        id: 11,
        name: "Men's Track Pants",
        brand: "Zeynix",
        price: 699,
        originalPrice: 1599,
        rating: 4.5,
        image: "/images/products/product11.jpg",
        category: "Pants",
        size: ["S", "M", "L", "XL"],
        label: "TRACK FIT",
        description: "Comfortable track pants for sports and casual wear",
        inStock: true,
        featured: false
    },
    {
        id: 12,
        name: "Men's Denim Jacket",
        brand: "Zeynix",
        price: 1899,
        originalPrice: 3499,
        rating: 4.7,
        image: "/images/products/product12.jpg",
        category: "Jackets",
        size: ["S", "M", "L", "XL"],
        label: "CLASSIC FIT",
        description: "Timeless denim jacket for all seasons",
        inStock: true,
        featured: false
    }
];

// Utility functions for filtering products
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