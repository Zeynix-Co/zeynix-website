import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/config/database';
import { protect } from '@/lib/middleware/auth';
import { Order } from '@/lib/models/Order';

// GET /api/orders/[id] - Get order by ID
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        await connectDB();
        const { id: orderId } = await params;

        // Authenticate user
        const { user, error } = await protect(request);
        if (error || !user) {
            return NextResponse.json(
                { success: false, message: error || 'Authentication required' },
                { status: 401 }
            );
        }

        const order = await Order.findById(orderId)
            .populate('items.product', 'title images');

        if (!order) {
            return NextResponse.json(
                { success: false, message: 'Order not found' },
                { status: 404 }
            );
        }

        // Verify order belongs to this user
        if (order.user.toString() !== user._id.toString()) {
            return NextResponse.json(
                { success: false, message: 'Access denied' },
                { status: 403 }
            );
        }

        return NextResponse.json({
            success: true,
            data: order
        });

    } catch (error) {
        console.error('Get order error:', error);
        return NextResponse.json(
            { success: false, message: 'Internal server error getting order' },
            { status: 500 }
        );
    }
}

// PUT /api/orders/[id] - Update order
export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        await connectDB();
        const { id: orderId } = await params;
        const body = await request.json();

        // Authenticate user
        const { user, error } = await protect(request);
        if (error || !user) {
            return NextResponse.json(
                { success: false, message: error || 'Authentication required' },
                { status: 401 }
            );
        }

        const order = await Order.findById(orderId);

        if (!order) {
            return NextResponse.json(
                { success: false, message: 'Order not found' },
                { status: 404 }
            );
        }

        // Verify order belongs to this user
        if (order.user.toString() !== user._id.toString()) {
            return NextResponse.json(
                { success: false, message: 'Access denied' },
                { status: 403 }
            );
        }

        // Update order
        const updatedOrder = await Order.findByIdAndUpdate(
            orderId,
            body,
            { new: true, runValidators: true }
        ).populate('items.product', 'title images');

        return NextResponse.json({
            success: true,
            data: updatedOrder
        });

    } catch (error) {
        console.error('Update order error:', error);
        return NextResponse.json(
            { success: false, message: 'Internal server error updating order' },
            { status: 500 }
        );
    }
}

// DELETE /api/orders/[id] - Delete order
export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        await connectDB();
        const { id: orderId } = await params;

        // Authenticate user
        const { user, error } = await protect(request);
        if (error || !user) {
            return NextResponse.json(
                { success: false, message: error || 'Authentication required' },
                { status: 401 }
            );
        }

        const order = await Order.findById(orderId);

        if (!order) {
            return NextResponse.json(
                { success: false, message: 'Order not found' },
                { status: 404 }
            );
        }

        // Verify order belongs to this user
        if (order.user.toString() !== user._id.toString()) {
            return NextResponse.json(
                { success: false, message: 'Access denied' },
                { status: 403 }
            );
        }

        // Delete order
        await Order.findByIdAndDelete(orderId);

        return NextResponse.json({
            success: true,
            message: 'Order deleted successfully'
        });

    } catch (error) {
        console.error('Delete order error:', error);
        return NextResponse.json(
            { success: false, message: 'Internal server error deleting order' },
            { status: 500 }
        );
    }
}