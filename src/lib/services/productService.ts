import connectDB from '@/lib/config/database';
import { Product as ProductModel } from '@/lib/models/Product';
import { transformProduct, getBaseProductFilter } from '@/lib/utils/productTransformer';
import mongoose from 'mongoose';

// Fast in-memory cache
interface CacheItem<T> {
    data: T;
    expiry: number;
}

const memoryCache = new Map<string, CacheItem<any>>();
const DEFAULT_TTL_MS = 60 * 1000; // 60 seconds

export function getFromCache<T>(key: string): T | null {
    const item = memoryCache.get(key);
    if (!item) return null;
    if (Date.now() > item.expiry) {
        memoryCache.delete(key);
        return null;
    }
    return item.data as T;
}

export function setInCache<T>(key: string, data: T, ttlMs: number = DEFAULT_TTL_MS): void {
    memoryCache.set(key, {
        data,
        expiry: Date.now() + ttlMs
    });
}

export function clearProductCache(): void {
    memoryCache.clear();
}

/**
 * High-speed cached retrieval of a single product by slug, productId, or _id
 */
export async function getProductBySlugOrId(idOrSlug: string) {
    if (!idOrSlug) return null;

    const cacheKey = `product_${idOrSlug.toLowerCase()}`;
    const cached = getFromCache<any>(cacheKey);
    if (cached) {
        return cached;
    }

    try {
        await connectDB();

        const isObjectId = mongoose.Types.ObjectId.isValid(idOrSlug);
        const filter = isObjectId
            ? { $or: [{ _id: idOrSlug }, { slug: idOrSlug }, { productId: idOrSlug }], ...getBaseProductFilter() }
            : { $or: [{ slug: idOrSlug }, { productId: idOrSlug }], ...getBaseProductFilter() };

        // Use lean() for zero overhead
        const rawProduct = await ProductModel.findOne(filter).lean();
        if (!rawProduct) {
            return null;
        }

        const transformed = transformProduct(rawProduct as any);
        
        // Cache by both id and slug for fast lookup
        setInCache(cacheKey, transformed);
        if (transformed.slug && transformed.slug !== idOrSlug) {
            setInCache(`product_${transformed.slug.toLowerCase()}`, transformed);
        }
        if (transformed.id && transformed.id !== idOrSlug) {
            setInCache(`product_${transformed.id}`, transformed);
        }

        return transformed;
    } catch (err) {
        console.error('Error in getProductBySlugOrId:', err);
        return null;
    }
}

/**
 * High-speed cached retrieval of active products list
 */
export async function getActiveProductsList(options: {
    page?: number;
    limit?: number;
    category?: string | null;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
} = {}) {
    const page = options.page || 1;
    const limit = options.limit || 60;
    const category = options.category || 'all';
    const sortBy = options.sortBy || 'createdAt';
    const sortOrder = options.sortOrder || 'desc';

    const cacheKey = `products_list_${category}_p${page}_l${limit}_s${sortBy}_${sortOrder}`;
    const cached = getFromCache<any>(cacheKey);
    if (cached) {
        return { ...cached, fromCache: true };
    }

    try {
        await connectDB();

        const filter: any = {
            isActive: true,
            status: 'published'
        };

        if (category && category !== 'all') {
            const cat = category.toLowerCase();
            if (['casual', 'streetwear', 'unisex', 'unisexual', 't-shirts', 'tshirts'].includes(cat)) {
                filter.category = { $in: ['unisexual', 'unisex', 'casual', 'streetwear', 't-shirts'] };
            } else {
                filter.category = category;
            }
        }

        const sort: { [key: string]: 1 | -1 } = {};
        sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

        const [products, total] = await Promise.all([
            ProductModel.find(filter)
                .sort(sort)
                .skip((page - 1) * limit)
                .limit(limit)
                .lean(),
            ProductModel.countDocuments(filter)
        ]);

        const transformedProducts = products.map((p) => transformProduct(p as any));
        const result = {
            products: transformedProducts,
            pagination: {
                page,
                limit,
                total,
                pages: Math.ceil(total / limit)
            }
        };

        setInCache(cacheKey, result);

        // Pre-cache individual products into single-product cache for instant detail page loads
        for (const p of transformedProducts) {
            if (p.slug) setInCache(`product_${p.slug.toLowerCase()}`, p);
            if (p.id) setInCache(`product_${p.id}`, p);
        }

        return { ...result, fromCache: false };
    } catch (err) {
        console.error('Error in getActiveProductsList:', err);
        throw err;
    }
}
