import { NextRequest, NextResponse } from 'next/server';

// GET /api/orders/[id] - Get order by ID
export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const orderId = params.id;

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

        // Make request to backend API
        const backendUrl = process.env.BACKEND_URL || 'http://localhost:8000';
        const response = await fetch(`${backendUrl}/api/orders/${orderId}`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            const errorData = await response.json();
            return NextResponse.json(
                { success: false, message: errorData.message || 'Failed to fetch order' },
                { status: response.status }
            );
        }

        const data = await response.json();
        return NextResponse.json(data);

    } catch (error) {
        console.error('Get order error:', error);
        return NextResponse.json(
            {
                success: false,
                message: 'Internal server error getting order'
            },
            { status: 500 }
        );
    }
}

// PUT /api/orders/[id] - Update order
export async function PUT(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const orderId = params.id;
        const body = await request.json();

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

        // Make request to backend API
        const backendUrl = process.env.BACKEND_URL || 'http://localhost:8000';
        const response = await fetch(`${backendUrl}/api/orders/${orderId}`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
        });

        if (!response.ok) {
            const errorData = await response.json();
            return NextResponse.json(
                { success: false, message: errorData.message || 'Failed to update order' },
                { status: response.status }
            );
        }

        const data = await response.json();
        return NextResponse.json(data);

    } catch (error) {
        console.error('Update order error:', error);
        return NextResponse.json(
            {
                success: false,
                message: 'Internal server error updating order'
            },
            { status: 500 }
        );
    }
}

// DELETE /api/orders/[id] - Delete order
export async function DELETE(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const orderId = params.id;

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

        // Make request to backend API
        const backendUrl = process.env.BACKEND_URL || 'http://localhost:8000';
        const response = await fetch(`${backendUrl}/api/orders/${orderId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            const errorData = await response.json();
            return NextResponse.json(
                { success: false, message: errorData.message || 'Failed to delete order' },
                { status: response.status }
            );
        }

        const data = await response.json();
        return NextResponse.json(data);

    } catch (error) {
        console.error('Delete order error:', error);
        return NextResponse.json(
            {
                success: false,
                message: 'Internal server error deleting order'
            },
            { status: 500 }
        );
    }
}
