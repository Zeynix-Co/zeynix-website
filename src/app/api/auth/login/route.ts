import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/config/database';
import { User } from '@/lib/models/User';
import { generateToken, setTokenCookie } from '@/lib/middleware/auth';

// POST /api/auth/login - User login
export async function POST(request: NextRequest) {
    try {
        await connectDB();
        
        const { email, password, rememberMe } = await request.json();

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
                    message: 'Invalid email or password'
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
                    message: 'Invalid email or password'
                },
                { status: 401 }
            );
        }

        // Generate JWT token
        const token = generateToken(user._id.toString(), rememberMe);

        // Create response with user data
        const nextResponse = NextResponse.json({
            success: true,
            message: 'Login successful',
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
        });

        // Set JWT token as HTTP-only cookie
        nextResponse.headers.set('Set-Cookie', setTokenCookie(token, rememberMe));

        return nextResponse;

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