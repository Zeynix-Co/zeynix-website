import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import { Product } from '@/lib/models/Product';
import { transformProduct, getBaseProductFilter } from '@/lib/utils/productTransformer';

// Connect to MongoDB
const connectDB = async () => {
    try {
        if (mongoose.connection.readyState === 1) {
            return; // Already connected
        }

        await mongoose.connect(process.env.MONGODB_URI!);
        console.log('✅ MongoDB Connected');
    } catch (error) {
        console.error('❌ MongoDB connection failed:', error);
        throw error;
    }
};

// GET /api/products/featured - Get featured products
export async function GET(request: NextRequest) {
    try {
        await connectDB();

        const { searchParams } = new URL(request.url);
        const limit = parseInt(searchParams.get('limit') || '8');

        // Get featured products - only active and published
        const filter = { ...getBaseProductFilter(), featured: true };
        const products = await Product.find(filter)
            .sort({ rating: -1, createdAt: -1 })
            .limit(limit);

        // Transform products for frontend
        const transformedProducts = products.map(transformProduct);

        return NextResponse.json({
            success: true,
            data: transformedProducts
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
