import { NextRequest, NextResponse } from 'next/server';
import { getActiveProductsList } from '@/lib/services/productService';

// GET /api/customer/products - Get all active products (public)
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '100');
        const category = searchParams.get('category');
        const sortBy = searchParams.get('sortBy') || 'createdAt';
        const sortOrder = (searchParams.get('sortOrder') || 'desc') as 'asc' | 'desc';

        const result = await getActiveProductsList({
            page,
            limit,
            category,
            sortBy,
            sortOrder
        });

        return NextResponse.json(
            {
                success: true,
                data: {
                    products: result.products,
                    pagination: result.pagination
                }
            },
            {
                headers: {
                    'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300',
                    'X-Cache': (result as any).fromCache ? 'HIT' : 'MISS'
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