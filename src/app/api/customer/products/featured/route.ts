import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/config/database';
import { Product } from '@/lib/models/Product';
import { transformProduct, getBaseProductFilter } from '@/lib/utils/productTransformer';

// GET /api/customer/products/featured - Get featured products (public)
export async function GET(request: NextRequest) {
    try {
        await connectDB();

        const { searchParams } = new URL(request.url);
        const limit = parseInt(searchParams.get('limit') || '8');

        // Get featured products - only active and published
        const filter = { ...getBaseProductFilter(), featured: true };
        const products = await Product.find(filter)
            .sort({ rating: -1, createdAt: -1 })
            .limit(limit)
            .lean();

        // Transform products for frontend
        const transformedProducts = products.map((p) => transformProduct(p as any));

        return NextResponse.json(
            {
                success: true,
                data: transformedProducts
            },
            {
                headers: {
                    'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300'
                }
            }
        );

    } catch (error) {
        console.error('Get featured products error:', error);
        return NextResponse.json(
            {
                success: false,
                message: 'Internal server error getting featured products'
            },
            { status: 500 }
        );
    }
}
