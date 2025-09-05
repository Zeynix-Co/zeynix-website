import { NextRequest, NextResponse } from 'next/server';

// POST /api/orders - Create a new order
export async function POST(request: NextRequest) {
    try {
        // Verify authentication - get token from Authorization header or cookies
        const authHeader = request.headers.get('authorization');
        const token = authHeader?.startsWith('Bearer ')
            ? authHeader.split(' ')[1]
            : request.cookies.get('token')?.value;

        if (!token) {
            return NextResponse.json(
                { success: false, message: 'Authentication required' },
                { status: 401 }
            );
        }

        const body = await request.json();
        const { items, totalAmount, shippingAddress } = body;

        // Validate required fields
        if (!items || !Array.isArray(items) || items.length === 0) {
            return NextResponse.json(
                { success: false, message: 'Order items are required' },
                { status: 400 }
            );
        }

        if (!totalAmount || totalAmount <= 0) {
            return NextResponse.json(
                { success: false, message: 'Invalid total amount' },
                { status: 400 }
            );
        }

        if (!shippingAddress) {
            return NextResponse.json(
                { success: false, message: 'Shipping address is required' },
                { status: 400 }
            );
        }

        // Make request to backend API
        const backendUrl = process.env.BACKEND_URL || 'http://localhost:8000';





        const response = await fetch(`${backendUrl}/api/orders`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
        });

        if (!response.ok) {
            const errorData = await response.json();
            return NextResponse.json(
                { success: false, message: errorData.message || 'Failed to create order' },
                { status: response.status }
            );
        }

        const data = await response.json();
        return NextResponse.json(data);

    } catch (error) {
        console.error('Create order error:', error);
        return NextResponse.json(
            {
                success: false,
                message: 'Internal server error creating order'
            },
            { status: 500 }
        );
    }
}

// GET /api/orders - Get user's orders
export async function GET(request: NextRequest) {
    try {
        // Verify authentication - get token from Authorization header or cookies
        const authHeader = request.headers.get('authorization');
        const token = authHeader?.startsWith('Bearer ')
            ? authHeader.split(' ')[1]
            : request.cookies.get('token')?.value;

        if (!token) {
            return NextResponse.json(
                { success: false, message: 'Authentication required' },
                { status: 401 }
            );
        }

        const { searchParams } = new URL(request.url);
        const page = searchParams.get('page') || '1';
        const limit = searchParams.get('limit') || '10';
        const status = searchParams.get('status');

        // Build query string
        const queryParams = new URLSearchParams();
        if (page) queryParams.append('page', page);
        if (limit) queryParams.append('limit', limit);
        if (status && status !== 'all') queryParams.append('status', status);

        // Make request to backend API
        const backendUrl = process.env.BACKEND_URL || 'http://localhost:8000';
        const response = await fetch(`${backendUrl}/api/orders?${queryParams.toString()}`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            const errorData = await response.json();
            return NextResponse.json(
                { success: false, message: errorData.message || 'Failed to fetch orders' },
                { status: response.status }
            );
        }

        const data = await response.json();
        return NextResponse.json(data);

    } catch (error) {
        console.error('Get orders error:', error);
        return NextResponse.json(
            {
                success: false,
                message: 'Internal server error getting orders'
            },
            { status: 500 }
        );
    }
}
