import { NextRequest, NextResponse } from 'next/server';

// POST /api/auth/login - User login
export async function POST(request: NextRequest) {
    try {
        const { email, password } = await request.json();

        // Validate input
        if (!email || !password) {
            return NextResponse.json(
                {
                    success: false,
                    message: 'Email and password are required'
                },
                { status: 400 }
            );
        }

        // Make request to backend API
        const backendUrl = process.env.BACKEND_URL || 'http://localhost:8000';
        const response = await fetch(`${backendUrl}/api/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });

        if (!response.ok) {
            const errorData = await response.json();
            return NextResponse.json(
                { success: false, message: errorData.message || 'Login failed' },
                { status: response.status }
            );
        }

        const data = await response.json();

        // Create response with user data
        const nextResponse = NextResponse.json({
            success: true,
            message: 'Login successful',
            data: {
                user: data.data.user,
                token: data.data.token
            }
        });

        // Set JWT token as HTTP-only cookie from backend response
        nextResponse.cookies.set('token', data.data.token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 7 * 24 * 60 * 60, // 7 days
            path: '/'
        });

        return nextResponse;

    } catch (error) {
        console.error('Login error:', error);
        return NextResponse.json(
            {
                success: false,
                message: 'Internal server error during login'
            },
            { status: 500 }
        );
    }
}
