import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/config/database';
import { protectAdmin } from '@/lib/middleware/auth';
import { Order } from '@/lib/models/Order';
import { User } from '@/lib/models/User';

// PATCH /api/admin/orders/[id]/status - Update order status (admin)
export async function PATCH(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        await connectDB();

        // Authenticate admin user strictly
        const { user, error } = await protectAdmin(request);
        if (error || !user) {
            return NextResponse.json(
                { success: false, message: error || 'Authentication required' },
                { status: 401 }
            );
        }

        const { id } = await params;
        const { status } = await request.json();

        // Validate status
        const validStatuses = ['pending', 'confirmed', 'delivered', 'cancelled'];
        if (!validStatuses.includes(status)) {
            return NextResponse.json(
                { success: false, message: 'Invalid status. Must be pending, confirmed, delivered, or cancelled' },
                { status: 400 }
            );
        }

        // Check if order exists
        const existingOrder = await Order.findById(id);
        if (!existingOrder) {
            return NextResponse.json(
                { success: false, message: 'Order not found' },
                { status: 404 }
            );
        }

        // Update order status
        const updatedOrder = await Order.findByIdAndUpdate(
            id,
            { status },
            { new: true }
        ).populate('user', 'name email phone')
            .populate('items.product', 'title images actualPrice');

        return NextResponse.json({
            success: true,
            message: `Order status updated to ${status}`,
            data: updatedOrder
        });

    } catch (error) {
        console.error('Update order status error:', error);
        return NextResponse.json(
            {
                success: false,
                message: 'Internal server error updating order status'
            },
            { status: 500 }
        );
    }
}