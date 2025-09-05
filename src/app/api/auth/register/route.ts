import { NextRequest, NextResponse } from 'next/server';

// POST /api/auth/register - User registration
export async function POST(request: NextRequest) {
    try {
        const { name, email, phone, password, confirmPassword } = await request.json();

        // Validate input
        if (!name || !email || !phone || !password || !confirmPassword) {
            return NextResponse.json(
                {
                    success: false,
                    message: 'All fields are required'
                },
                { status: 400 }
            );
        }

        // Make request to backend API
        const backendUrl = process.env.BACKEND_URL || 'http://localhost:8000';
        const response = await fetch(`${backendUrl}/api/auth/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name, email, phone, password, confirmPassword })
        });

        if (!response.ok) {
            const errorData = await response.json();
            return NextResponse.json(
                { success: false, message: errorData.message || 'Registration failed' },
                { status: response.status }
            );
        }

        const data = await response.json();

        // Create response with user data
        const nextResponse = NextResponse.json({
            success: true,
            message: 'Registration successful',
            data: {
                user: data.data.user,
                token: data.data.token
            }
        }, { status: 201 });

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
        console.error('Registration error:', error);
        return NextResponse.json(
            {
                success: false,
                message: 'Internal server error during registration'
            },
            { status: 500 }
        );
    }
}
