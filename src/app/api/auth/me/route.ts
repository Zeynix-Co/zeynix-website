import { NextRequest, NextResponse } from 'next/server';

// GET /api/auth/me - Get current user info
export async function GET(request: NextRequest) {
    try {
        // Get token from cookie
        const token = request.cookies.get('token')?.value;

        if (!token) {
            return NextResponse.json(
                { success: false, message: 'No token provided' },
                { status: 401 }
            );
        }

        // Make request to backend API
        const backendUrl = process.env.BACKEND_URL || 'http://localhost:8000';
        const response = await fetch(`${backendUrl}/api/auth/me`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            const errorData = await response.json();
            return NextResponse.json(
                { success: false, message: errorData.message || 'Authentication failed' },
                { status: response.status }
            );
        }

        const data = await response.json();
        return NextResponse.json(data);

    } catch (error) {
        console.error('Auth check error:', error);
        return NextResponse.json(
            {
                success: false,
                message: 'Internal server error checking authentication'
            },
            { status: 500 }
        );
    }
}
