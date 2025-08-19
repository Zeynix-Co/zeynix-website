import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import { Product } from '@/lib/models/Product';
import { transformProduct, getBaseProductFilter, ProductFilter } from '@/lib/utils/productTransformer';

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

// GET /api/products/search - Search products
export async function GET(request: NextRequest) {
    try {
        await connectDB();

        const { searchParams } = new URL(request.url);
        const query = searchParams.get('q');
        const category = searchParams.get('category');
        const limit = parseInt(searchParams.get('limit') || '10');

        if (!query || query.trim() === '') {
            return NextResponse.json(
                {
                    success: false,
                    message: 'Search query is required'
                },
                { status: 400 }
            );
        }

        // Build search filter - only active and published products
        const filter: ProductFilter = {
            ...getBaseProductFilter(),
            $or: [
                { title: { $regex: query, $options: 'i' } },
                { description: { $regex: query, $options: 'i' } },
                { brand: { $regex: query, $options: 'i' } }
            ]
        };

        // Add category filter if specified
        if (category && category !== 'all') {
            filter.category = category;
        }

        // Execute search
        const products = await Product.find(filter)
            .limit(limit)
            .sort({ rating: -1, createdAt: -1 });

        // Transform products for frontend
        const transformedProducts = products.map(transformProduct);

        return NextResponse.json({
            success: true,
            data: {
                products: transformedProducts,
                query,
                total: transformedProducts.length
            }
        });

    } catch (error) {
        console.error('Search products error:', error);
        return NextResponse.json(
            {
                success: false,
                message: 'Internal server error searching products'
            },
            { status: 500 }
        );
    }
}
