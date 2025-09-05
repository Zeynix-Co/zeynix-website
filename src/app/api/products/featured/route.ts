import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/config/database';
import { Product } from '@/lib/models/Product';

// GET /api/products/featured - Get featured products
export async function GET(request: NextRequest) {
    try {
        await connectDB();

        const { searchParams } = new URL(request.url);
        const limit = parseInt(searchParams.get('limit') || '8');

        // Get featured products
        const products = await Product.find({
            isActive: true,
            status: 'published',
            featured: true
        })
        .sort({ createdAt: -1 })
        .limit(limit);

        return NextResponse.json({
            success: true,
            data: {
                products,
                count: products.length
            }
        });

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