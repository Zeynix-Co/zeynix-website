import { NextRequest, NextResponse } from 'next/server';

// POST /api/auth/logout - User logout
export async function POST() {
    try {
        // Create response
        const response = NextResponse.json({
            success: true,
            message: 'Logout successful'
        });

        // Clear JWT token cookie
        response.cookies.set('token', '', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 0, // Expire immediately
            path: '/'
        });

        return response;

    } catch (error) {
        console.error('Logout error:', error);
        return NextResponse.json(
            {
                success: false,
                message: 'Internal server error during logout'
            },
            { status: 500 }
        );
    }
}
