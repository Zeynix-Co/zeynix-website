import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import { User } from '@/lib/models/User';
import { Product } from '@/lib/models/Product';
import { Order } from '@/lib/models/Order';
import env from '@/lib/config/env';
import jwt from 'jsonwebtoken';

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

        let userId: string | null | undefined = request.nextUrl.searchParams.get('userId');

        if (!userId) {
            // Check auth header or cookie
            const authHeader = request.headers.get('authorization');
            const token = authHeader?.startsWith('Bearer ')
                ? authHeader.substring(7)
                : request.cookies.get('token')?.value;

            if (token) {
                try {
                    const decoded = jwt.verify(token, env.JWT_SECRET) as { userId?: string; role?: string };
                    userId = decoded.userId;
                } catch {
                    // Ignore token verify error here
                }
            }
        }

        if (userId) {
            const adminUser = await User.findOne({ _id: userId, role: 'admin' });
            if (!adminUser) {
                return NextResponse.json(
                    { success: false, message: 'Unauthorized access' },
                    { status: 401 }
                );
            }
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

        let userId: string | undefined;
        try {
            const body = await request.json();
            userId = body.userId;
        } catch {
            // Empty body
        }

        // Validate input
        if (userId) {
            const adminUser = await User.findOne({ _id: userId, role: 'admin' });
            if (!adminUser) {
                return NextResponse.json(
                    { success: false, message: 'Unauthorized access' },
                    { status: 401 }
                );
            }
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
