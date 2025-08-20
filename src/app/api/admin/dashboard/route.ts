import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import { User } from '@/lib/models/User';
import { Product } from '@/lib/models/Product';
import env from '@/lib/config/env';

// Connect to MongoDB
const connectDB = async () => {
    try {
        if (mongoose.connection.readyState === 1) {
            return; // Already connected
        }

        await mongoose.connect(env.MONGODB_URI);
        console.log('✅ MongoDB Connected for Admin Dashboard');
    } catch (error) {
        console.error('❌ MongoDB connection failed for Admin Dashboard:', error);
        throw error;
    }
};

// POST /api/admin/dashboard - Get admin dashboard data
export async function POST(request: NextRequest) {
    try {
        await connectDB();

        const { userId } = await request.json();

        // Validate input
        if (!userId) {
            return NextResponse.json(
                {
                    success: false,
                    message: 'User ID is required'
                },
                { status: 400 }
            );
        }

        // Verify user is admin
        const adminUser = await User.findOne({ _id: userId, role: 'admin' });
        if (!adminUser) {
            return NextResponse.json(
                {
                    success: false,
                    message: 'Unauthorized access'
                },
                { status: 401 }
            );
        }

        // Fetch dashboard statistics
        const [
            totalProducts,
            totalUsers,
            lowStockProducts
        ] = await Promise.all([
            // Total products (active and published)
            Product.countDocuments({ isActive: true, status: 'published' }),

            // Total users (excluding admins)
            User.countDocuments({ role: 'user' }),

            // Low stock products (stock > 0 AND stock <= 5) - Only show products with actual stock
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



        // Prepare dashboard data
        const dashboardData = {
            stats: {
                totalProducts,
                totalUsers,
                totalOrders: 0,
                pendingOrders: 0,
                totalRevenue: 0
            },
            recentOrders: [],
            lowStockProducts: lowStockProducts.map((product: { _id: mongoose.Types.ObjectId; title: string; sizes: Array<{ size: string; stock: number; inStock: boolean }> }) => ({
                _id: product._id.toString(),
                title: product.title,
                sizes: product.sizes.filter((size: { size: string; stock: number; inStock: boolean }) =>
                    size.stock > 0 && size.stock <= 5
                )
            }))
        };

        return NextResponse.json({
            success: true,
            message: 'Dashboard data fetched successfully',
            data: dashboardData
        });

    } catch (error) {
        console.error('Admin dashboard error:', error);
        return NextResponse.json(
            {
                success: false,
                message: 'Internal server error fetching dashboard data'
            },
            { status: 500 }
        );
    }
}
