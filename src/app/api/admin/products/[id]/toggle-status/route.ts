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
        console.log('✅ MongoDB Connected for Admin Product Status Toggle');
    } catch (error) {
        console.error('❌ MongoDB connection failed for Admin Product Status Toggle:', error);
        throw error;
    }
};

// PATCH /api/admin/products/[id]/toggle-status - Toggle product status
export async function PATCH(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        await connectDB();

        const { id } = await params;
        const { status, userId } = await request.json();

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

        if (!status || !['draft', 'published', 'archived'].includes(status)) {
            return NextResponse.json(
                {
                    success: false,
                    message: 'Valid status is required (draft, published, or archived)'
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

        // Find and update product status
        const product = await Product.findByIdAndUpdate(
            id,
            { status },
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
            message: 'Product status updated successfully',
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
        console.error('Toggle admin product status error:', error);
        return NextResponse.json(
            {
                success: false,
                message: 'Internal server error updating product status'
            },
            { status: 500 }
        );
    }
}
