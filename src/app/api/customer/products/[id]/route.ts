import { NextRequest, NextResponse } from 'next/server';
import { getProductBySlugOrId } from '@/lib/services/productService';

// GET /api/customer/products/[id] - Get single product (public)
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const product = await getProductBySlugOrId(id);

        if (!product) {
            return NextResponse.json(
                {
                    success: false,
                    message: 'Product not found'
                },
                { status: 404 }
            );
        }

        return NextResponse.json(
            {
                success: true,
                data: product
            },
            {
                headers: {
                    'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300'
                }
            }
        );

    } catch (error) {
        console.error('Get public product error:', error);
        return NextResponse.json(
            {
                success: false,
                message: 'Internal server error getting product'
            },
            { status: 500 }
        );
    }
}
