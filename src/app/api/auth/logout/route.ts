import { NextRequest, NextResponse } from 'next/server';

// POST /api/auth/logout - User logout
export async function POST(request: NextRequest) {
    try {
        const response = NextResponse.json({
            success: true,
            message: 'Logout successful'
        });

        // 1. Clear via Next.js cookies API
        response.cookies.delete('token');

        // 2. Clear with explicit past expiration and path
        const isHttps = request.nextUrl.protocol === 'https:' || request.headers.get('x-forwarded-proto') === 'https';
        response.cookies.set('token', '', {
            httpOnly: true,
            secure: isHttps,
            sameSite: 'lax',
            maxAge: 0,
            expires: new Date(0),
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
