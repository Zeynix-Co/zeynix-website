import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import connectDB from '@/lib/config/database';
import { Product } from '@/lib/models/Product';
import { transformProduct } from '@/lib/utils/productTransformer';

// GET /api/products/[id] - Get single product by ID or slug
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        await connectDB();
        const { id } = await params;

        const isObjectId = mongoose.Types.ObjectId.isValid(id);
        const query = isObjectId
            ? { $or: [{ _id: id }, { slug: id }, { productId: id }] }
            : { $or: [{ slug: id }, { productId: id }] };

        const product = await Product.findOne(query);

        if (!product) {
            return NextResponse.json(
                { success: false, message: 'Product not found' },
                { status: 404 }
            );
        }

        if (!product.isActive || product.status !== 'published') {
            return NextResponse.json(
                { success: false, message: 'Product not available' },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            data: transformProduct(product)
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

// PUT / PATCH /api/products/[id] - Update product
export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        await connectDB();
        const { id } = await params;
        const body = await request.json();

        const isObjectId = mongoose.Types.ObjectId.isValid(id);
        const query = isObjectId
            ? { $or: [{ _id: id }, { slug: id }, { productId: id }] }
            : { $or: [{ slug: id }, { productId: id }] };

        const updated = await Product.findOneAndUpdate(
            query,
            { $set: body },
            { new: true, runValidators: true }
        );

        if (!updated) {
            return NextResponse.json(
                { success: false, message: 'Product not found' },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            message: 'Product updated successfully',
            data: transformProduct(updated)
        });
    } catch (error: any) {
        console.error('Update product error:', error);
        return NextResponse.json(
            { success: false, message: error.message || 'Error updating product' },
            { status: 500 }
        );
    }
}

export async function PATCH(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    return PUT(request, { params });
}

// DELETE /api/products/[id] - Delete or archive product
export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        await connectDB();
        const { id } = await params;

        const isObjectId = mongoose.Types.ObjectId.isValid(id);
        const query = isObjectId
            ? { $or: [{ _id: id }, { slug: id }, { productId: id }] }
            : { $or: [{ slug: id }, { productId: id }] };

        const deleted = await Product.findOneAndDelete(query);

        if (!deleted) {
            return NextResponse.json(
                { success: false, message: 'Product not found' },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            message: 'Product deleted successfully',
            data: { id: deleted._id }
        });
    } catch (error: any) {
        console.error('Delete product error:', error);
        return NextResponse.json(
            { success: false, message: error.message || 'Error deleting product' },
            { status: 500 }
        );
    }
}