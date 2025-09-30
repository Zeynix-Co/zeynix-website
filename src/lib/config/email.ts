import { Resend } from 'resend';
import env from './env';

// Initialize Resend
const resend = new Resend(env.RESEND_API_KEY);

// Send password reset email
export const sendPasswordResetEmail = async (
    to: string,
    resetToken: string,
    isAdmin: boolean = false
) => {
    try {
        const resetUrl = `${env.CLIENT_URL}/reset-password?token=${resetToken}&type=${isAdmin ? 'admin' : 'user'}`;

        const { data, error } = await resend.emails.send({
            from: 'Zeynix <noreply@zeynix.in>', // Using your verified domain
            to: [to],
            subject: 'Reset Your Zeynix Password',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                    <div style="text-align: center; margin-bottom: 30px;">
                        <h1 style="color: #1f2937; font-size: 28px; margin: 0;">Zeynix</h1>
                        <p style="color: #6b7280; font-size: 16px; margin: 5px 0;">Wear The Luxury</p>
                    </div>
                    
                    <div style="background: #f9fafb; padding: 30px; border-radius: 10px; margin-bottom: 20px;">
                        <h2 style="color: #1f2937; font-size: 24px; margin: 0 0 20px 0;">Password Reset Request</h2>
                        
                        <p style="color: #374151; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
                            Hi there,
                        </p>
                        
                        <p style="color: #374151; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
                            We received a request to reset your password for your ${isAdmin ? 'admin' : 'customer'} account at Zeynix.
                        </p>
                        
                        <p style="color: #374151; font-size: 16px; line-height: 1.6; margin: 0 0 30px 0;">
                            Click the button below to reset your password:
                        </p>
                        
                        <div style="text-align: center; margin: 30px 0;">
                            <a href="${resetUrl}" 
                               style="background: #3b82f6; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-size: 16px; font-weight: 600; display: inline-block;">
                                Reset Password
                            </a>
                        </div>
                        
                        <p style="color: #6b7280; font-size: 14px; line-height: 1.6; margin: 30px 0 0 0;">
                            If the button doesn't work, copy and paste this link into your browser:
                        </p>
                        <p style="color: #3b82f6; font-size: 14px; word-break: break-all; margin: 5px 0;">
                            ${resetUrl}
                        </p>
                        
                        <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">
                        
                        <p style="color: #6b7280; font-size: 12px; line-height: 1.6; margin: 0;">
                            This link will expire in 1 hour for security reasons.
                        </p>
                        <p style="color: #6b7280; font-size: 12px; line-height: 1.6; margin: 5px 0 0 0;">
                            If you didn't request this password reset, please ignore this email.
                        </p>
                    </div>
                    
                    <div style="text-align: center; color: #6b7280; font-size: 12px;">
                        <p>© 2025 Zeynix. All rights reserved.</p>
                    </div>
                </div>
            `,
        });

        if (error) {
            console.error('❌ Resend error:', error);
            return { success: false, error: error.message };
        }

        console.log('✅ Password reset email sent successfully:', data?.id);
        return { success: true, messageId: data?.id };

    } catch (error) {
        console.error('❌ Failed to send password reset email:', error);
        return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
};

// Send password reset success email
export const sendPasswordResetSuccessEmail = async (
    to: string,
    isAdmin: boolean = false
) => {
    try {
        const { data, error } = await resend.emails.send({
            from: 'Zeynix <noreply@zeynix.in>', // Using your verified domain
            to: [to],
            subject: 'Password Successfully Reset - Zeynix',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                    <div style="text-align: center; margin-bottom: 30px;">
                        <h1 style="color: #1f2937; font-size: 28px; margin: 0;">Zeynix</h1>
                        <p style="color: #6b7280; font-size: 16px; margin: 5px 0;">Wear The Luxury</p>
                    </div>
                    
                    <div style="background: #f0fdf4; padding: 30px; border-radius: 10px; margin-bottom: 20px; border-left: 4px solid #22c55e;">
                        <h2 style="color: #1f2937; font-size: 24px; margin: 0 0 20px 0;">Password Reset Successful</h2>
                        
                        <p style="color: #374151; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
                            Hi there,
                        </p>
                        
                        <p style="color: #374151; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
                            Your password for your ${isAdmin ? 'admin' : 'customer'} account at Zeynix has been successfully reset.
                        </p>
                        
                        <p style="color: #374151; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
                            You can now log in with your new password.
                        </p>
                        
                        <div style="background: #fef3c7; padding: 15px; border-radius: 8px; margin: 20px 0;">
                            <p style="color: #92400e; font-size: 14px; margin: 0;">
                                <strong>Security Tip:</strong> If you didn't make this change, please contact our support team immediately.
                            </p>
                        </div>
                    </div>
                    
                    <div style="text-align: center; color: #6b7280; font-size: 12px;">
                        <p>© 2025 Zeynix. All rights reserved.</p>
                    </div>
                </div>
            `,
        });

        if (error) {
            console.error('❌ Resend error:', error);
            return { success: false, error: error.message };
        }

        console.log('✅ Password reset success email sent:', data?.id);
        return { success: true, messageId: data?.id };

    } catch (error) {
        console.error('❌ Failed to send password reset success email:', error);
        return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
};

export default {
    sendPasswordResetEmail,
    sendPasswordResetSuccessEmail,
};