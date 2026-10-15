import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import { User } from '@/lib/models/User';
import { Product } from '@/lib/models/Product';
import { Order } from '@/lib/models/Order';
import env from '@/lib/config/env';
import jwt from 'jsonwebtoken';
import { protectAdmin } from '@/lib/middleware/auth';

// Connect to MongoDB
const connectDB = async () => {
    try {
        if (mongoose.connection.readyState === 1) {
            return;
        }

        await mongoose.connect(env.MONGODB_URI);
        console.log('✅ MongoDB Connected for Admin Dashboard');
    } catch (error) {
        console.error('❌ MongoDB connection failed for Admin Dashboard:', error);
        throw error;
    }
};

async function fetchStats() {
    const [
        totalProducts,
        totalUsers,
        totalOrders,
        pendingOrders,
        recentOrders,
        lowStockProducts
    ] = await Promise.all([
        // Total products (active and published)
        Product.countDocuments({ isActive: true }),

        // Total users (excluding admins)
        User.countDocuments({ role: 'user' }),

        // Total orders
        Order.countDocuments({}),

        // Pending orders
        Order.countDocuments({ status: 'pending' }),

        // Recent 6 orders
        Order.find({})
            .populate('user', 'name email phone')
            .sort({ createdAt: -1 })
            .limit(6),

        // Low stock products (stock > 0 AND stock <= 5)
        Product.find({
            isActive: true,
            'sizes': {
                $elemMatch: {
                    stock: { $gt: 0, $lte: 5 }
                }
            }
        })
            .select('title sizes')
            .limit(10)
    ]);

    return {
        stats: {
            totalProducts,
            totalUsers,
            totalOrders,
            pendingOrders,
        },
        recentOrders,
        lowStockProducts: lowStockProducts.map((product: { _id: mongoose.Types.ObjectId; title: string; sizes: Array<{ size: string; stock: number; inStock: boolean }> }) => ({
            _id: product._id.toString(),
            title: product.title,
            sizes: product.sizes.filter((size: { size: string; stock: number; inStock: boolean }) =>
                size.stock > 0 && size.stock <= 5
            )
        }))
    };
}

// GET /api/admin/dashboard - Get admin dashboard data
export async function GET(request: NextRequest) {
    try {
        await connectDB();

        const { user, error } = await protectAdmin(request);
        if (error || !user) {
            return NextResponse.json(
                { success: false, message: error || 'Unauthorized access' },
                { status: 401 }
            );
        }

        const data = await fetchStats();

        return NextResponse.json({
            success: true,
            message: 'Dashboard data fetched successfully',
            data
        });
    } catch (error) {
        console.error('Admin dashboard GET error:', error);
        return NextResponse.json(
            { success: false, message: 'Internal server error fetching dashboard data' },
            { status: 500 }
        );
    }
}

// POST /api/admin/dashboard - Get admin dashboard data
export async function POST(request: NextRequest) {
    try {
        await connectDB();

        const { user, error } = await protectAdmin(request);
        if (error || !user) {
            return NextResponse.json(
                { success: false, message: error || 'Unauthorized access' },
                { status: 401 }
            );
        }

        const data = await fetchStats();

        return NextResponse.json({
            success: true,
            message: 'Dashboard data fetched successfully',
            data
        });

    } catch (error) {
        console.error('Admin dashboard POST error:', error);
        return NextResponse.json(
            {
                success: false,
                message: 'Internal server error fetching dashboard data'
            },
            { status: 500 }
        );
    }
}
