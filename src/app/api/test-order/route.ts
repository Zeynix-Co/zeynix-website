import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/config/database';
import { Product } from '@/lib/models/Product';
import { Order } from '@/lib/models/Order';

export async function GET(request: NextRequest) {
    try {
        await connectDB();

        // Test database connection
        const productCount = await Product.countDocuments();
        const orderCount = await Order.countDocuments();

        // Get a sample product
        const sampleProduct = await Product.findOne();

        return NextResponse.json({
            success: true,
            data: {
                productCount,
                orderCount,
                sampleProduct: sampleProduct ? {
                    id: sampleProduct._id,
                    title: sampleProduct.title,
                    isActive: sampleProduct.isActive,
                    sizes: sampleProduct.sizes
                } : null,
                timestamp: new Date().toISOString()
            }
        });
    } catch (error) {
        console.error('Test order error:', error);
        return NextResponse.json(
            { success: false, message: 'Test failed', error: error instanceof Error ? error.message : 'Unknown error' },
            { status: 500 }
        );
    }
}
