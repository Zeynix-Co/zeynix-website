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

// GET /api/customer/products/category/[category] - Get products by category
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ category: string }> }
) {
    try {
        await connectDB();

        const { category } = await params;
        const { searchParams } = new URL(request.url);
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '20');
        const sortBy = searchParams.get('sortBy') || 'createdAt';
        const sortOrder = searchParams.get('sortOrder') === 'asc' ? 1 : -1;

        // Build filter - only active and published products in the specified category
        const filter = {
            ...getBaseProductFilter(),
            category: category.toLowerCase()
        };

        // Build sort object
        let sort: Record<string, any> = {};
        switch (sortBy) {
            case 'price':
                sort = { actualPrice: sortOrder };
                break;
            case 'rating':
                sort = { rating: sortOrder };
                break;
            case 'featured':
                sort = { featured: -1, createdAt: -1 };
                break;
            case 'newest':
                sort = { createdAt: -1 };
                break;
            default:
                sort = { createdAt: -1 };
        }

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
        console.error('Get products by category error:', error);
        return NextResponse.json(
            {
                success: false,
                message: 'Internal server error getting products by category'
            },
            { status: 500 }
        );
    }
}
