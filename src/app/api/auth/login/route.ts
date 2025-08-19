import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import { User } from '@/lib/models/User';
import jwt from 'jsonwebtoken';

// Connect to MongoDB
const connectDB = async () => {
    try {
        if (mongoose.connection.readyState === 1) {
            return; // Already connected
        }

        await mongoose.connect(process.env.MONGODB_URI!);
        console.log('✅ MongoDB Connected');
    } catch (error) {
        console.error('❌ MongoDB connection failed:', error);
        throw error;
    }
};

// POST /api/auth/login - User login
export async function POST(request: NextRequest) {
    try {
        await connectDB();

        const { email, password } = await request.json();

        // Validate input
        if (!email || !password) {
            return NextResponse.json(
                {
                    success: false,
                    message: 'Email and password are required'
                },
                { status: 400 }
            );
        }

        // Find user by email
        const user = await User.findOne({ email }).select('+password');
        if (!user) {
            return NextResponse.json(
                {
                    success: false,
                    message: 'Invalid credentials'
                },
                { status: 401 }
            );
        }

        // Check if user is active
        if (!user.isActive) {
            return NextResponse.json(
                {
                    success: false,
                    message: 'Account is deactivated'
                },
                { status: 401 }
            );
        }

        // Verify password
        const isPasswordValid = await user.comparePassword(password);
        if (!isPasswordValid) {
            return NextResponse.json(
                {
                    success: false,
                    message: 'Invalid credentials'
                },
                { status: 401 }
            );
        }

        // Generate JWT token
        const token = jwt.sign(
            { userId: user._id, role: user.role },
            process.env.JWT_SECRET || 'fallback-secret',
            { expiresIn: '7d' }
        );

        // Remove password from response
        const userResponse = {
            id: user._id,
            name: user.name,
            email: user.email,
            phone: user.phone,
            role: user.role
        };

        return NextResponse.json({
            success: true,
            message: 'Login successful',
            data: {
                user: userResponse,
                token
            }
        });

    } catch (error) {
        console.error('Login error:', error);
        return NextResponse.json(
            {
                success: false,
                message: 'Internal server error during login'
            },
            { status: 500 }
        );
    }
}
