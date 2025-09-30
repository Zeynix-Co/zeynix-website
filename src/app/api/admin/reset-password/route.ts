import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/config/database';
import { User } from '@/lib/models/User';
import { sendPasswordResetSuccessEmail } from '@/lib/config/email';

// POST /api/admin/reset-password - Reset admin password with token
export async function POST(request: NextRequest) {
    try {
        await connectDB();

        const { token, password, confirmPassword } = await request.json();

        // Validate input
        if (!token || !password || !confirmPassword) {
            return NextResponse.json(
                {
                    success: false,
                    message: 'Token, password, and confirm password are required'
                },
                { status: 400 }
            );
        }

        // Validate password
        if (password.length < 6) {
            return NextResponse.json(
                {
                    success: false,
                    message: 'Password must be at least 6 characters long'
                },
                { status: 400 }
            );
        }

        if (password !== confirmPassword) {
            return NextResponse.json(
                {
                    success: false,
                    message: 'Passwords do not match'
                },
                { status: 400 }
            );
        }

        // Find admin user by reset token and role
        const user = await User.findOne({
            resetPasswordToken: token,
            resetPasswordExpires: { $gt: Date.now() },
            role: 'admin'
        }).select('+resetPasswordToken +resetPasswordExpires');

        if (!user) {
            return NextResponse.json(
                {
                    success: false,
                    message: 'Invalid or expired password reset token'
                },
                { status: 400 }
            );
        }

        // Check if user is active
        if (!user.isActive) {
            return NextResponse.json(
                {
                    success: false,
                    message: 'Admin account is deactivated'
                },
                { status: 401 }
            );
        }

        // Update password
        user.password = password;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;
        await user.save();

        // Send password reset success email
        await sendPasswordResetSuccessEmail(user.email, true);

        return NextResponse.json({
            success: true,
            message: 'Admin password has been reset successfully. You can now log in with your new password.'
        });

    } catch (error) {
        console.error('Admin reset password error:', error);
        return NextResponse.json(
            {
                success: false,
                message: 'Internal server error during admin password reset'
            },
            { status: 500 }
        );
    }
}
