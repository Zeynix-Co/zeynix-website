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
        console.log('✅ MongoDB Connected for Admin Product Operations');
    } catch (error) {
        console.error('❌ MongoDB connection failed for Admin Product Operations:', error);
        throw error;
    }
};

// GET /api/admin/products/[id] - Get single product
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        await connectDB();

        const { id } = await params;
        const { searchParams } = new URL(request.url);
        const userId = searchParams.get('userId');

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

        if (!id) {
            return NextResponse.json(
                {
                    success: false,
                    message: 'Product ID is required'
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

        // Find product
        const product = await Product.findById(id).select('-__v');
        if (!product) {
            return NextResponse.json(
                {
                    success: false,
                    message: 'Product not found'
                },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            message: 'Product fetched successfully',
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
        });

    } catch (error) {
        console.error('Get admin product error:', error);
        return NextResponse.json(
            {
                success: false,
                message: 'Internal server error fetching product'
            },
            { status: 500 }
        );
    }
}

// PUT /api/admin/products/[id] - Update product
export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        await connectDB();

        const { id } = await params;
        const { userId, ...updateData } = await request.json();

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

        if (!id) {
            return NextResponse.json(
                {
                    success: false,
                    message: 'Product ID is required'
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

        // Find and update product
        const product = await Product.findByIdAndUpdate(
            id,
            { ...updateData },
            { new: true, runValidators: true }
        ).select('-__v');

        if (!product) {
            return NextResponse.json(
                {
                    success: false,
                    message: 'Product not found'
                },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            message: 'Product updated successfully',
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
        });

    } catch (error) {
        console.error('Update admin product error:', error);

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
                message: 'Internal server error updating product'
            },
            { status: 500 }
        );
    }
}

// DELETE /api/admin/products/[id] - Delete product
export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        await connectDB();

        const { id } = await params;
        const { searchParams } = new URL(request.url);
        const userId = searchParams.get('userId');

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

        if (!id) {
            return NextResponse.json(
                {
                    success: false,
                    message: 'Product ID is required'
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

        // Find and delete product
        const product = await Product.findByIdAndDelete(id);
        if (!product) {
            return NextResponse.json(
                {
                    success: false,
                    message: 'Product not found'
                },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            message: 'Product deleted successfully'
        });

    } catch (error) {
        console.error('Delete admin product error:', error);
        return NextResponse.json(
            {
                success: false,
                message: 'Internal server error deleting product'
            },
            { status: 500 }
        );
    }
}
