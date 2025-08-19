import mongoose from 'mongoose';

// Interface for the raw product data from MongoDB
interface RawProduct {
    _id: mongoose.Types.ObjectId;
    title: string;
    brand?: string;
    description?: string;
    images?: string[];
    category?: string;
    actualPrice: number;
    discountPrice?: number;
    discount?: number;
    rating?: number;
    sizes?: Array<{
        size: string;
        stock: number;
        inStock: boolean;
    }>;
    productFit?: string;
    featured?: boolean;
    isActive?: boolean;
}

// Type for MongoDB filter objects
export interface ProductFilter {
    isActive: boolean;
    status: string;
    category?: string;
    featured?: boolean;
    brand?: { $regex: string; $options: string };
    $or?: Array<{
        [key: string]: { $regex: string; $options: string } | string;
    }>;
    actualPrice?: {
        $gte?: number;
        $lte?: number;
    };
    'sizes.size'?: string;
    [key: string]: unknown;
}

// Product transformation utility for converting backend data structure to frontend format
export const transformProduct = (product: RawProduct) => ({
    id: product._id.toString(),
    name: product.title,
    brand: product.brand || 'Zeynix',
    price: product.discountPrice || product.actualPrice,
    originalPrice: product.actualPrice,
    rating: product.rating || 0,
    image: product.images && product.images.length > 0 ? product.images[0] : '/images/products/placeholder.jpg',
    images: product.images || [],
    category: product.category || 'casual',
    size: product.sizes && product.sizes.length > 0 ? product.sizes.map((s) => s.size) : ['M', 'L', 'XL'],
    label: product.productFit || 'CASUAL FIT',
    description: product.description || '',
    inStock: product.sizes && product.sizes.length > 0 ? product.sizes.some((s) => s.inStock) : true,
    featured: product.featured || false,
    discount: product.discount || 0,
    sizes: product.sizes // Keep original sizes for detailed view
});

// Base filter for active and published products
export const getBaseProductFilter = (): ProductFilter => ({
    isActive: true,
    status: 'published'
});
