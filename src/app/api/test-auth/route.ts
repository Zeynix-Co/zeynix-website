import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/config/database';
import { protect } from '@/lib/middleware/auth';

export async function GET(request: NextRequest) {
    try {
        await connectDB();
        
        // Debug request headers
        console.log('🔍 Test Auth Debug:');
        console.log('Authorization:', request.headers.get('authorization'));
        console.log('Cookie:', request.headers.get('cookie'));
        console.log('All Headers:', Object.fromEntries(request.headers.entries()));
        
        // Try to authenticate
        const { user, error } = await protect(request);
        
        if (error || !user) {
            return NextResponse.json({
                success: false,
                message: error || 'Authentication failed',
                debug: {
                    hasAuthHeader: !!request.headers.get('authorization'),
                    hasCookie: !!request.headers.get('cookie'),
                    cookieValue: request.headers.get('cookie'),
                    error: error
                }
            }, { status: 401 });
        }
        
        return NextResponse.json({
            success: true,
            message: 'Authentication successful',
            data: {
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    role: user.role
                }
            }
        });
        
    } catch (error) {
        console.error('Test auth error:', error);
        return NextResponse.json(
            { success: false, message: 'Test failed', error: error instanceof Error ? error.message : 'Unknown error' },
            { status: 500 }
        );
    }
}
