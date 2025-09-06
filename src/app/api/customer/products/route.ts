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
        const limit = parseInt(searchParams.get('limit') || '20');
        const category = searchParams.get('category');
        const sortBy = searchParams.get('sortBy') || 'createdAt';
        const sortOrder = searchParams.get('sortOrder') || 'desc';

        // Build filter - only active and published products
        const filter: { isActive: boolean; status: string; category?: string } = {
            isActive: true,
            status: 'published'
        };

        if (category && category !== 'all') {
            filter.category = category;
        }

        // Build sort object
        const sort: { [key: string]: 1 | -1 } = {};
        sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

        // Execute query
        const products = await Product.find(filter)
            .sort(sort)
            .skip((page - 1) * limit)
            .limit(limit);

        // Get total count
        const total = await Product.countDocuments(filter);

        // Transform products for frontend
        const transformedProducts = products.map(transformProduct);

        return NextResponse.json({
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
        });

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