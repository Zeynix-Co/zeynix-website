import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/config/database';
import { Product } from '@/lib/models/Product';

// GET /api/products/search - Search products
export async function GET(request: NextRequest) {
    try {
        await connectDB();

        const { searchParams } = new URL(request.url);
        const q = searchParams.get('q');
        const category = searchParams.get('category');
        const minPrice = searchParams.get('minPrice');
        const maxPrice = searchParams.get('maxPrice');
        const size = searchParams.get('size');
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '20');

        // Build filter - only active and published products
        const filter: { 
            isActive: boolean; 
            status: string; 
            category?: string; 
            $or?: Array<{ [key: string]: { $regex: string; $options: string } }>; 
            $and?: Array<{ [key: string]: { $gte?: number; $lte?: number } }>; 
            'sizes.size'?: string 
        } = { 
            isActive: true, 
            status: 'published' 
        };

        // Text search
        if (q) {
            filter.$or = [
                { title: { $regex: q, $options: 'i' } },
                { brand: { $regex: q, $options: 'i' } },
                { description: { $regex: q, $options: 'i' } }
            ];
        }

        // Category filter
        if (category && category !== 'all') {
            filter.category = category;
        }

        // Price range filter
        if (minPrice || maxPrice) {
            filter.$and = [];
            if (minPrice) {
                filter.$and.push({ actualPrice: { $gte: parseFloat(minPrice) } });
            }
            if (maxPrice) {
                filter.$and.push({ actualPrice: { $lte: parseFloat(maxPrice) } });
            }
        }

        // Size filter
        if (size) {
            filter['sizes.size'] = size;
        }

        // Execute query
        const products = await Product.find(filter)
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(limit);

        // Get total count
        const total = await Product.countDocuments(filter);

        return NextResponse.json({
            success: true,
            data: {
                products,
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