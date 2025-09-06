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

        // Debug token generation
        console.log('🔍 Login Debug:');
        console.log('User ID:', user._id.toString());
        console.log('Remember Me:', rememberMe);
        console.log('Token generated:', token ? '✅ Yes' : '❌ No');
        console.log('JWT Secret:', process.env.JWT_SECRET ? '✅ Set' : '❌ Missing');

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
        const cookieString = setTokenCookie(token, rememberMe);
        console.log('Cookie string:', cookieString);
        nextResponse.headers.set('Set-Cookie', cookieString);

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