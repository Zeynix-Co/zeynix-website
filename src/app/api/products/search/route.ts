import { NextRequest, NextResponse } from 'next/server';

// GET /api/products/search - Search products
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const q = searchParams.get('q');
        const category = searchParams.get('category');
        const minPrice = searchParams.get('minPrice');
        const maxPrice = searchParams.get('maxPrice');
        const size = searchParams.get('size');
        const page = searchParams.get('page') || '1';
        const limit = searchParams.get('limit') || '20';

        // Build query string
        const queryParams = new URLSearchParams();
        if (q) queryParams.append('q', q);
        if (category && category !== 'all') queryParams.append('category', category);
        if (minPrice) queryParams.append('minPrice', minPrice);
        if (maxPrice) queryParams.append('maxPrice', maxPrice);
        if (size) queryParams.append('size', size);
        if (page) queryParams.append('page', page);
        if (limit) queryParams.append('limit', limit);

        // Make request to backend API
        const backendUrl = process.env.BACKEND_URL || 'http://localhost:8000';
        const response = await fetch(`${backendUrl}/api/customer/products/search?${queryParams.toString()}`, {
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            const errorData = await response.json();
            return NextResponse.json(
                { success: false, message: errorData.message || 'Failed to search products' },
                { status: response.status }
            );
        }

        const data = await response.json();
        return NextResponse.json(data);

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
