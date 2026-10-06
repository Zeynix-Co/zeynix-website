import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/config/database';
import { Product } from '@/lib/models/Product';
import { transformProduct } from '@/lib/utils/productTransformer';

// GET /api/customer/products - Get all active products (public)
export async function GET(request: NextRequest) {
    try {
        await connectDB();

        const { searchParams } = new URL(request.url);
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '100');
        const category = searchParams.get('category');
        const sortBy = searchParams.get('sortBy') || 'createdAt';
        const sortOrder = searchParams.get('sortOrder') || 'desc';

        // Build filter - only active and published products
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

        // Build sort object
        const sort: { [key: string]: 1 | -1 } = {};
        sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

        // Execute queries in parallel using lean() for zero-overhead JSON serialization
        const [products, total] = await Promise.all([
            Product.find(filter)
                .sort(sort)
                .skip((page - 1) * limit)
                .limit(limit)
                .lean(),
            Product.countDocuments(filter)
        ]);

        // Transform products for frontend
        const transformedProducts = products.map((p) => transformProduct(p as any));

        return NextResponse.json(
            {
                success: true,
                data: {
                    products: transformedProducts,
                    pagination: {
                        page,
                        limit,
                        total,
                        pages: Math.ceil(total / limit)
                    }
                }
            },
            {
                headers: {
                    'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300'
                }
            }
        );

    } catch (error) {
        console.error('Get public products error:', error);
        return NextResponse.json(
            {
                success: false,
                message: 'Internal server error getting products'
            },
            { status: 500 }
        );
    }
}