import { NextRequest, NextResponse } from 'next/server';

// GET /api/products/featured - Get featured products
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const limit = searchParams.get('limit') || '8';

        // Build query string
        const queryParams = new URLSearchParams();
        if (limit) queryParams.append('limit', limit);

        // Make request to backend API
        const backendUrl = process.env.BACKEND_URL || 'http://localhost:8000';
        const response = await fetch(`${backendUrl}/api/customer/products/featured?${queryParams.toString()}`, {
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            const errorData = await response.json();
            return NextResponse.json(
                { success: false, message: errorData.message || 'Failed to fetch featured products' },
                { status: response.status }
            );
        }

        const data = await response.json();
        return NextResponse.json(data);

    } catch (error) {
        console.error('Get featured products error:', error);
        return NextResponse.json(
            {
                success: false,
                message: 'Internal server error getting featured products'
            },
            { status: 500 }
        );
    }
}
