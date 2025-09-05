import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/config/database';
import { User } from '@/lib/models/User';
import { generateToken, setTokenCookie } from '@/lib/middleware/auth';

// POST /api/auth/register - User registration
export async function POST(request: NextRequest) {
    try {
        await connectDB();
        
        const { name, email, phone, password, confirmPassword } = await request.json();

        // Validate input
        if (!name || !email || !phone || !password || !confirmPassword) {
            return NextResponse.json(
                {
                    success: false,
                    message: 'All fields are required'
                },
                { status: 400 }
            );
        }

        // Check if passwords match
        if (password !== confirmPassword) {
            return NextResponse.json(
                {
                    success: false,
                    message: 'Passwords do not match'
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
                    message: 'User with this email or phone already exists'
                },
                { status: 400 }
            );
        }

        // Create new user
        const user = new User({
            name,
            email,
            phone,
            password,
            role: 'user'
        });

        await user.save();

        // Generate JWT token
        const token = generateToken(user._id.toString(), false);

        // Create response with user data
        const nextResponse = NextResponse.json({
            success: true,
            message: 'Registration successful',
            data: {
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    phone: user.phone,
                    role: user.role
                },
                token
            }
        }, { status: 201 });

        // Set JWT token as HTTP-only cookie
        nextResponse.headers.set('Set-Cookie', setTokenCookie(token, false));

        return nextResponse;

    } catch (error) {
        console.error('Registration error:', error);
        return NextResponse.json(
            {
                success: false,
                message: 'Internal server error during registration'
            },
            { status: 500 }
        );
    }
}