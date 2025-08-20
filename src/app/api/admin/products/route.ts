import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import { User } from '@/lib/models/User';
import { Product } from '@/lib/models/Product';
import env from '@/lib/config/env';

// Connect to MongoDB
const connectDB = async () => {
    try {
        if (mongoose.connection.readyState === 1) {
            return; // Already connected
        }

        await mongoose.connect(env.MONGODB_URI);
        console.log('✅ MongoDB Connected for Admin Products');
    } catch (error) {
        console.error('❌ MongoDB connection failed for Admin Products:', error);
        throw error;
    }
};

// GET /api/admin/products - Get all products with filters
export async function GET(request: NextRequest) {
    try {
        await connectDB();

        const { searchParams } = new URL(request.url);
        const userId = searchParams.get('userId');
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '10');
        const category = searchParams.get('category');
        const status = searchParams.get('status');
        const search = searchParams.get('search');

        // Validate input
        if (!userId) {
            return NextResponse.json(
                {
                    success: false,
                    message: 'User ID is required'
                },
                { status: 400 }
            );
        }

        // Verify user is admin
        const adminUser = await User.findOne({ _id: userId, role: 'admin' });
        if (!adminUser) {
            return NextResponse.json(
                {
                    success: false,
                    message: 'Unauthorized access'
                },
                { status: 401 }
            );
        }

        // Build filter
        const filter: Record<string, string | object> = {};

        if (category && category !== 'all') {
            filter.category = category;
        }

        if (status && status !== 'all') {
            filter.status = status;
        }

        if (search && search.trim()) {
            filter.$or = [
                { title: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } },
                { brand: { $regex: search, $options: 'i' } }
            ];
        }

        // Execute query with pagination
        const skip = (page - 1) * limit;

        const [products, total] = await Promise.all([
            Product.find(filter)
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit)
                .select('-__v'),
            Product.countDocuments(filter)
        ]);

        // Calculate pagination
        const pages = Math.ceil(total / limit);

        return NextResponse.json({
            success: true,
            message: 'Products fetched successfully',
            data: {
                products: products.map(product => ({
                    _id: product._id.toString(),
                    title: product.title,
                    brand: product.brand,
                    category: product.category,
                    description: product.description,
                    actualPrice: product.actualPrice,
                    discountPrice: product.discountPrice,
                    discount: product.discount,
                    sizes: product.sizes,
                    images: product.images,
                    rating: product.rating,
                    productFit: product.productFit,
                    featured: product.featured,
                    status: product.status,
                    isActive: product.isActive,
                    createdAt: product.createdAt,
                    updatedAt: product.updatedAt
                })),
                pagination: {
                    page,
                    limit,
                    total,
                    pages
                }
            }
        });

    } catch (error) {
        console.error('Get admin products error:', error);
        return NextResponse.json(
            {
                success: false,
                message: 'Internal server error fetching products'
            },
            { status: 500 }
        );
    }
}

// POST /api/admin/products - Create new product
export async function POST(request: NextRequest) {
    try {
        await connectDB();

        const { userId, ...productData } = await request.json();

        // Validate input
        if (!userId) {
            return NextResponse.json(
                {
                    success: false,
                    message: 'User ID is required'
                },
                { status: 400 }
            );
        }

        if (!productData.title || !productData.brand || !productData.category || !productData.actualPrice) {
            return NextResponse.json(
                {
                    success: false,
                    message: 'Title, brand, category, and actual price are required'
                },
                { status: 400 }
            );
        }

        // Verify user is admin
        const adminUser = await User.findOne({ _id: userId, role: 'admin' });
        if (!adminUser) {
            return NextResponse.json(
                {
                    success: false,
                    message: 'Unauthorized access'
                },
                { status: 401 }
            );
        }

        // Create new product
        const product = await Product.create({
            ...productData,
            isActive: true,
            status: productData.status || 'draft',
            rating: productData.rating || 0,
            featured: productData.featured || false
        });

        return NextResponse.json({
            success: true,
            message: 'Product created successfully',
            data: {
                _id: product._id.toString(),
                title: product.title,
                brand: product.brand,
                category: product.category,
                description: product.description,
                actualPrice: product.actualPrice,
                discountPrice: product.discountPrice,
                discount: product.discount,
                sizes: product.sizes,
                images: product.images,
                rating: product.rating,
                productFit: product.productFit,
                featured: product.featured,
                status: product.status,
                isActive: product.isActive,
                createdAt: product.createdAt,
                updatedAt: product.updatedAt
            }
        }, { status: 201 });

    } catch (error) {
        console.error('Create admin product error:', error);

        if (error instanceof Error && error.name === 'ValidationError') {
            return NextResponse.json(
                {
                    success: false,
                    message: 'Validation error',
                    errors: [error.message]
                },
                { status: 400 }
            );
        }

        return NextResponse.json(
            {
                success: false,
                message: 'Internal server error creating product'
            },
            { status: 500 }
        );
    }
}
