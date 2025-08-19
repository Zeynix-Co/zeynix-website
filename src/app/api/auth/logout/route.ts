import { NextRequest, NextResponse } from 'next/server';

// POST /api/auth/logout - User logout
export async function POST(request: NextRequest) {
    try {
        // Get the authorization header
        const authHeader = request.headers.get('authorization');

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return NextResponse.json(
                {
                    success: false,
                    message: 'No valid token provided'
                },
                { status: 401 }
            );
        }

        // In a real application, you might want to:
        // 1. Validate the token
        // 2. Add it to a blacklist
        // 3. Update user's rememberToken field

        // For now, we'll just return success
        // The frontend will clear the token from local storage

        return NextResponse.json({
            success: true,
            message: 'Logout successful'
        });

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
