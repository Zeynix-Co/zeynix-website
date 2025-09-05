import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/config/database';
import { Product } from '@/lib/models/Product';

// GET /api/products/[id] - Get product by ID
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        await connectDB();
        const { id } = await params;

        const product = await Product.findById(id);

        if (!product) {
            return NextResponse.json(
                { success: false, message: 'Product not found' },
                { status: 404 }
            );
        }

        // Check if product is active and published
        if (!product.isActive || product.status !== 'published') {
            return NextResponse.json(
                { success: false, message: 'Product not available' },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            data: product
        });

    } catch (error) {
        console.error('Get product error:', error);
        return NextResponse.json(
            {
                success: false,
                message: 'Internal server error getting product'
            },
            { status: 500 }
        );
    }
}