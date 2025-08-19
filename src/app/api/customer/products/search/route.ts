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

// GET /api/customer/products/search - Search products (public)
export async function GET(request: NextRequest) {
    try {
        await connectDB();

        const { searchParams } = new URL(request.url);
        const query = searchParams.get('q');
        const category = searchParams.get('category');
        const minPrice = searchParams.get('minPrice');
        const maxPrice = searchParams.get('maxPrice');
        const size = searchParams.get('size');
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '20');

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
        const filter: Record<string, any> = {
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

        // Add price filter if specified
        if (minPrice || maxPrice) {
            filter.actualPrice = {};
            if (minPrice) filter.actualPrice.$gte = parseFloat(minPrice);
            if (maxPrice) filter.actualPrice.$lte = parseFloat(maxPrice);
        }

        // Add size filter if specified
        if (size) {
            filter['sizes.size'] = size;
        }

        // Execute search
        const products = await Product.find(filter)
            .sort({ createdAt: -1 })
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
