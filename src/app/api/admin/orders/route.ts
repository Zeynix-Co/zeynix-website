import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/config/database';
import { protect } from '@/lib/middleware/auth';
import { Order } from '@/lib/models/Order';
import { User } from '@/lib/models/User';

// GET /api/admin/orders - Get all orders (admin)
export async function GET(request: NextRequest) {
    try {
        await connectDB();

        // Authenticate user
        const { user, error } = await protect(request);
        if (error || !user) {
            return NextResponse.json(
                { success: false, message: error || 'Authentication required' },
                { status: 401 }
            );
        }

        // Verify admin user
        const adminUser = await User.findById(user._id);
        if (!adminUser || adminUser.role !== 'admin') {
            return NextResponse.json(
                { success: false, message: 'Access denied. Admin role required.' },
                { status: 401 }
            );
        }

        const { searchParams } = new URL(request.url);
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '10');
        const status = searchParams.get('status');
        const paymentStatus = searchParams.get('paymentStatus');
        const search = searchParams.get('search');

        // Build filter
        const filter: {
            status?: string;
            paymentStatus?: string;
            $or?: Array<{
                orderNumber?: { $regex: string; $options: string };
                'user.name'?: { $regex: string; $options: string };
                'user.email'?: { $regex: string; $options: string };
            }>;
        } = {};
        if (status && status !== 'all') filter.status = status;
        if (paymentStatus && paymentStatus !== 'all') filter.paymentStatus = paymentStatus;
        if (search) {
            filter.$or = [
                { orderNumber: { $regex: search, $options: 'i' } },
                { 'user.name': { $regex: search, $options: 'i' } },
                { 'user.email': { $regex: search, $options: 'i' } }
            ];
        }

        // Execute query
        const orders = await Order.find(filter)
            .populate('user', 'name email phone')
            .populate('items.product', 'title images actualPrice')
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(limit);

        // Get total count
        const total = await Order.countDocuments(filter);

        return NextResponse.json({
            success: true,
            data: {
                orders,
                pagination: {
                    page,
                    limit,
                    total,
                    pages: Math.ceil(total / limit)
                }
            }
        });

    } catch (error) {
        console.error('Get admin orders error:', error);
        return NextResponse.json(
            {
                success: false,
                message: 'Internal server error getting admin orders'
            },
            { status: 500 }
        );
    }
}

// POST /api/admin/orders - Create a new order (admin)
export async function POST(request: NextRequest) {
    try {
        await connectDB();

        // Authenticate user
        const { user, error } = await protect(request);
        if (error || !user) {
            return NextResponse.json(
                { success: false, message: error || 'Authentication required' },
                { status: 401 }
            );
        }

        // Verify admin user
        const adminUser = await User.findById(user._id);
        if (!adminUser || adminUser.role !== 'admin') {
            return NextResponse.json(
                { success: false, message: 'Access denied. Admin role required.' },
                { status: 401 }
            );
        }

        const body = await request.json();
        const { userId, orderData } = body;

        if (!userId || !orderData) {
            return NextResponse.json(
                { success: false, message: 'User ID and order data are required' },
                { status: 400 }
            );
        }

        // Verify the target user exists
        const targetUser = await User.findById(userId);
        if (!targetUser) {
            return NextResponse.json(
                { success: false, message: 'Target user not found' },
                { status: 404 }
            );
        }

        // Create order (implementation would depend on your specific orderData structure)
        // This is a placeholder - you may need to adapt based on your exact requirements
        return NextResponse.json({
            success: true,
            message: 'Admin order creation not yet implemented',
            data: { orderId: 'placeholder' }
        });

    } catch (error) {
        console.error('Create admin order error:', error);
        return NextResponse.json(
            {
                success: false,
                message: 'Internal server error creating admin order'
            },
            { status: 500 }
        );
    }
}
