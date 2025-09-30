import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/config/database';
import { protect } from '@/lib/middleware/auth';
import { Order } from '@/lib/models/Order';
import { User } from '@/lib/models/User';

// GET /api/admin/orders/[id] - Get order by ID (admin)
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
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

        const { id } = await params;

        const order = await Order.findById(id)
            .populate('user', 'name email phone')
            .populate('items.product', 'title images actualPrice');

        if (!order) {
            return NextResponse.json(
                { success: false, message: 'Order not found' },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            data: order
        });

    } catch (error) {
        console.error('Get admin order error:', error);
        return NextResponse.json(
            {
                success: false,
                message: 'Internal server error getting admin order'
            },
            { status: 500 }
        );
    }
}

// PUT /api/admin/orders/[id] - Update order (admin)
export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
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

        const { id } = await params;
        const updateData = await request.json();

        // Check if order exists
        const existingOrder = await Order.findById(id);
        if (!existingOrder) {
            return NextResponse.json(
                { success: false, message: 'Order not found' },
                { status: 404 }
            );
        }

        // Update order
        const updatedOrder = await Order.findByIdAndUpdate(
            id,
            updateData,
            { new: true }
        ).populate('user', 'name email phone')
            .populate('items.product', 'title images actualPrice');

        return NextResponse.json({
            success: true,
            message: 'Order updated successfully',
            data: updatedOrder
        });

    } catch (error) {
        console.error('Update admin order error:', error);
        return NextResponse.json(
            {
                success: false,
                message: 'Internal server error updating admin order'
            },
            { status: 500 }
        );
    }
}

// DELETE /api/admin/orders/[id] - Delete order (admin)
export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
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

        const { id } = await params;

        // Check if order exists
        const order = await Order.findById(id);
        if (!order) {
            return NextResponse.json(
                { success: false, message: 'Order not found' },
                { status: 404 }
            );
        }

        // Soft delete - mark as inactive
        await Order.findByIdAndUpdate(id, {
            isActive: false,
            status: 'cancelled'
        });

        return NextResponse.json({
            success: true,
            message: 'Order deleted successfully'
        });

    } catch (error) {
        console.error('Delete admin order error:', error);
        return NextResponse.json(
            {
                success: false,
                message: 'Internal server error deleting admin order'
            },
            { status: 500 }
        );
    }
}