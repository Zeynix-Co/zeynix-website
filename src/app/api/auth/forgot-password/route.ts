import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/config/database';
import { User } from '@/lib/models/User';
import { sendPasswordResetEmail } from '@/lib/config/email';

// POST /api/auth/forgot-password - Send password reset email
export async function POST(request: NextRequest) {
    try {
        await connectDB();

        const { email } = await request.json();

        // Validate input
        if (!email) {
            return NextResponse.json(
                {
                    success: false,
                    message: 'Email address is required'
                },
                { status: 400 }
            );
        }

        // Find user by email
        const user = await User.findOne({ email }).select('+resetPasswordToken +resetPasswordExpires');
        if (!user) {
            // Don't reveal if email exists or not for security
            return NextResponse.json({
                success: true,
                message: 'If an account with that email exists, a password reset link has been sent.'
            });
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

        // Generate password reset token
        const resetToken = user.generatePasswordResetToken();
        await user.save({ validateBeforeSave: false });

        // Send password reset email
        const emailResult = await sendPasswordResetEmail(email, resetToken, false);

        if (!emailResult.success) {
            // Clear the reset token if email fails
            user.resetPasswordToken = undefined;
            user.resetPasswordExpires = undefined;
            await user.save({ validateBeforeSave: false });

            console.error('Failed to send password reset email:', emailResult.error);
            return NextResponse.json(
                {
                    success: false,
                    message: 'Failed to send password reset email. Please try again later.'
                },
                { status: 500 }
            );
        }

        return NextResponse.json({
            success: true,
            message: 'If an account with that email exists, a password reset link has been sent.'
        });

    } catch (error) {
        console.error('Forgot password error:', error);
        return NextResponse.json(
            {
                success: false,
                message: 'Internal server error during password reset request'
            },
            { status: 500 }
        );
    }
}
