import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import { User } from '@/lib/models/User';

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

// POST /api/auth/register - User registration
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

        // Check if user already exists
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

        // Create new user
        const user = await User.create({
            name,
            email,
            phone,
            password,
            role: 'user',
            isActive: true
        });

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
            message: 'Registration successful',
            data: userResponse
        }, { status: 201 });

    } catch (error) {
        console.error('Registration error:', error);

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
                message: 'Internal server error during registration'
            },
            { status: 500 }
        );
    }
}
