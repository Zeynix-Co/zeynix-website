import { NextRequest, NextResponse } from 'next/server';

// POST /api/auth/logout - User logout
export async function POST() {
    try {
        // In a stateless JWT system, logout is handled client-side
        // The server can't invalidate JWT tokens, so we just return success
        // The client should remove the token from storage

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
