import { NextRequest, NextResponse } from 'next/server';
import { debugEnv } from '@/lib/config/env';

export async function GET(request: NextRequest) {
    try {
        // Debug environment variables
        debugEnv();

        return NextResponse.json({
            success: true,
            message: 'Debug information logged to console',
            data: {
                nodeEnv: process.env.NODE_ENV,
                hasMongoUri: !!process.env.MONGODB_URI,
                hasJwtSecret: !!process.env.JWT_SECRET,
                hasCloudinaryName: !!process.env.CLOUDINARY_CLOUD_NAME,
                timestamp: new Date().toISOString()
            }
        });
    } catch (error) {
        console.error('Debug API error:', error);
        return NextResponse.json(
            { success: false, message: 'Debug failed' },
            { status: 500 }
        );
    }
}
