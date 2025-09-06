import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/config/database';
import { protect } from '@/lib/middleware/auth';

export async function POST(request: NextRequest) {
    try {
        console.log('🧪 Test Order API called');
        
        // Test database connection
        await connectDB();
        console.log('✅ Database connected');

        // Test authentication
        const { user, error } = await protect(request);
        if (error || !user) {
            console.log('❌ Authentication failed:', error);
            return NextResponse.json(
                { success: false, message: error || 'Authentication required' },
                { status: 401 }
            );
        }

        console.log('✅ User authenticated:', user.email);

        // Test order data parsing
        const body = await request.json();
        console.log('✅ Request body parsed:', { 
            hasItems: !!body.items, 
            itemsLength: body.items?.length,
            hasTotalAmount: !!body.totalAmount,
            hasShippingAddress: !!body.shippingAddress
        });

        return NextResponse.json({
            success: true,
            message: 'Test order API working',
            data: {
                user: user.email,
                hasItems: !!body.items,
                itemsCount: body.items?.length || 0,
                totalAmount: body.totalAmount,
                hasShippingAddress: !!body.shippingAddress
            }
        });

    } catch (error) {
        console.error('❌ Test order API error:', error);
        return NextResponse.json(
            { 
                success: false, 
                message: 'Test order API failed',
                error: error instanceof Error ? error.message : 'Unknown error'
            },
            { status: 500 }
        );
    }
}
