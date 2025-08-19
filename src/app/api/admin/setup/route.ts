import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import { User } from '@/lib/models/User';
import jwt from 'jsonwebtoken';
import env from '@/lib/config/env';

// Connect to MongoDB
const connectDB = async () => {
    try {
        if (mongoose.connection.readyState === 1) {
            return; // Already connected
        }

        await mongoose.connect(env.MONGODB_URI);
        console.log('✅ MongoDB Connected');
    } catch (error) {
        console.error('❌ MongoDB connection failed:', error);
        throw error;
    }
};

// POST /api/admin/setup - Setup first admin account
export async function POST(request: NextRequest) {
    try {
        await connectDB();

        const { name, email, phone, password } = await request.json();

        // Validate input
        if (!name || !email || !phone || !password) {
            return NextResponse.json(
                {
                    success: false,
                    message: 'All fields are required'
                },
                { status: 400 }
            );
        }

        // Check if any admin already exists
        const existingAdmin = await User.findOne({ role: 'admin' });
        if (existingAdmin) {
            return NextResponse.json(
                {
                    success: false,
                    message: 'Admin account already exists'
                },
                { status: 400 }
            );
        }

        // Check if user with email or phone already exists
        const existingUser = await User.findOne({
            $or: [{ email }, { phone }]
        });

        if (existingUser) {
            return NextResponse.json(
                {
                    success: false,
                    message: existingUser.email === email
                        ? 'Email already registered'
                        : 'Phone number already registered'
                },
                { status: 400 }
            );
        }

        // Create new admin user
        const adminUser = await User.create({
            name,
            email,
            phone,
            password,
            role: 'admin',
            isActive: true
        });

        // Generate JWT token
        const token = jwt.sign(
            { userId: adminUser._id, role: adminUser.role },
            env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        // Remove password from response
        const userResponse = {
            id: adminUser._id,
            name: adminUser.name,
            email: adminUser.email,
            phone: adminUser.phone,
            role: adminUser.role
        };

        return NextResponse.json({
            success: true,
            message: 'Admin account created successfully',
            data: {
                user: userResponse,
                token
            }
        }, { status: 201 });

    } catch (error) {
        console.error('Admin setup error:', error);

        if (error instanceof Error && error.name === 'ValidationError') {
            return NextResponse.json(
                {
                    success: false,
                    message: 'Validation error',
                    errors: [error.message]
                },
                { status: 400 }
            );
        }

        return NextResponse.json(
            {
                success: false,
                message: 'Internal server error during admin setup'
            },
            { status: 500 }
        );
    }
}
