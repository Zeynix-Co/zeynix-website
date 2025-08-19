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

// GET /api/customer/products/[id] - Get single product (public)
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        await connectDB();

        const { id } = await params;

        // Validate ObjectId
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return NextResponse.json(
                {
                    success: false,
                    message: 'Invalid product ID'
                },
                { status: 400 }
            );
        }

        // Get product - only active and published
        const filter = { _id: id, ...getBaseProductFilter() };
        const product = await Product.findOne(filter);

        if (!product) {
            return NextResponse.json(
                {
                    success: false,
                    message: 'Product not found'
                },
                { status: 404 }
            );
        }

        // Transform product for frontend
        const transformedProduct = transformProduct(product);

        return NextResponse.json({
            success: true,
            data: transformedProduct
        });

    } catch (error) {
        console.error('Get public product error:', error);
        return NextResponse.json(
            {
                success: false,
                message: 'Internal server error getting product'
            },
            { status: 500 }
        );
    }
}
