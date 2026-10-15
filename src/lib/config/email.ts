import { Resend } from 'resend';
import env from './env';

// Initialize Resend only when API key is available
const getResendClient = () => {
    if (!env.RESEND_API_KEY) {
        throw new Error('RESEND_API_KEY is not configured');
    }
    return new Resend(env.RESEND_API_KEY);
};

// Send password reset email
export const sendPasswordResetEmail = async (
    to: string,
    resetToken: string,
    isAdmin: boolean = false
) => {
    try {
        const resetUrl = `${env.CLIENT_URL}/reset-password?token=${resetToken}&type=${isAdmin ? 'admin' : 'user'}`;

        const resend = getResendClient();
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
        const resend = getResendClient();
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

// Send instant admin order notification email to zeynix.co@gmail.com
export interface AdminOrderNotificationData {
    orderNumber: string;
    orderId: string;
    totalAmount: number;
    paymentMethod: string;
    paymentStatus: string;
    customerName: string;
    customerEmail?: string;
    customerPhone?: string;
    shippingAddress: {
        addressLine1: string;
        addressLine2?: string;
        city: string;
        state: string;
        pincode: string;
        country?: string;
    };
    items: Array<{
        title: string;
        size: string;
        quantity: number;
        price: number;
    }>;
}

export const sendAdminNewOrderNotification = async (orderData: AdminOrderNotificationData) => {
    try {
        const recipient = process.env.ADMIN_NOTIFICATION_EMAIL || 'zeynix.co@gmail.com';
        const resend = getResendClient();
        const clientUrl = env.CLIENT_URL || 'https://zeynix.in';
        const adminUrl = `${clientUrl}/admin/orders/${orderData.orderId}`;

        const isPaid = orderData.paymentStatus === 'completed';
        const statusBadge = isPaid ? 'PAID ✓' : 'PENDING';
        const statusColor = isPaid ? '#10B981' : '#F59E0B';

        const subject = `🚨 New Order: #${orderData.orderNumber} - ₹${orderData.totalAmount.toLocaleString('en-IN')} (${isPaid ? 'PAID' : 'PENDING'})`;

        const html = `
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="utf-8">
                <title>New Order Alert - Zeynix Atelier</title>
            </head>
            <body style="margin: 0; padding: 0; background-color: #050B1E; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #FFFFFF;">
                <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #050B1E; padding: 30px 10px;">
                    <tr>
                        <td align="center">
                            <table width="600" cellpadding="0" cellspacing="0" style="background-color: #070F2B; border: 1px solid rgba(181, 148, 91, 0.3); border-radius: 16px; overflow: hidden; box-shadow: 0 20px 40px rgba(0, 0, 0, 0.5);">
                                <!-- Header -->
                                <tr>
                                    <td style="padding: 28px 30px; text-align: center; background: linear-gradient(135deg, rgba(181, 148, 91, 0.18), rgba(7, 15, 43, 0.95)); border-bottom: 1px solid rgba(181, 148, 91, 0.2);">
                                        <div style="font-size: 11px; font-weight: 700; letter-spacing: 3px; color: #B5945B; text-transform: uppercase; margin-bottom: 8px;">
                                            ZEYNIX ATELIER • LIVE PIPELINE
                                        </div>
                                        <h1 style="margin: 0; font-size: 24px; font-weight: 800; color: #FFFFFF; letter-spacing: 1px; font-family: Georgia, serif;">
                                            🛍️ NEW CLIENT ORDER RECEIVED
                                        </h1>
                                        <p style="margin: 8px 0 0 0; font-size: 13px; color: #9CA3AF;">
                                            A new boutique order has just been placed.
                                        </p>
                                    </td>
                                </tr>

                                <!-- Order Value Banner -->
                                <tr>
                                    <td style="padding: 24px 30px 14px 30px;">
                                        <table width="100%" cellpadding="0" cellspacing="0" style="background-color: rgba(255, 255, 255, 0.03); border: 1px solid rgba(255, 255, 255, 0.08); border-radius: 12px; padding: 18px;">
                                            <tr>
                                                <td width="50%" style="padding: 6px 12px;">
                                                    <div style="font-size: 11px; text-transform: uppercase; color: #9CA3AF; letter-spacing: 1px;">Order Reference</div>
                                                    <div style="font-size: 17px; font-weight: 800; color: #B5945B; margin-top: 4px;">#${orderData.orderNumber}</div>
                                                </td>
                                                <td width="50%" style="padding: 6px 12px; text-align: right;">
                                                    <div style="font-size: 11px; text-transform: uppercase; color: #9CA3AF; letter-spacing: 1px;">Total Amount</div>
                                                    <div style="font-size: 22px; font-weight: 800; color: #10B981; margin-top: 4px;">₹${orderData.totalAmount.toLocaleString('en-IN')}</div>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td width="50%" style="padding: 6px 12px;">
                                                    <div style="font-size: 11px; text-transform: uppercase; color: #9CA3AF; letter-spacing: 1px;">Payment Method</div>
                                                    <div style="font-size: 13px; font-weight: 700; color: #FFFFFF; margin-top: 4px; text-transform: uppercase;">${orderData.paymentMethod}</div>
                                                </td>
                                                <td width="50%" style="padding: 6px 12px; text-align: right;">
                                                    <div style="font-size: 11px; text-transform: uppercase; color: #9CA3AF; letter-spacing: 1px;">Payment Status</div>
                                                    <div style="font-size: 13px; font-weight: 800; color: ${statusColor}; margin-top: 4px; text-transform: uppercase;">
                                                        ${statusBadge}
                                                    </div>
                                                </td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>

                                <!-- Customer Profile & Address -->
                                <tr>
                                    <td style="padding: 0 30px 18px 30px;">
                                        <table width="100%" cellpadding="0" cellspacing="0" style="background-color: rgba(255, 255, 255, 0.03); border: 1px solid rgba(255, 255, 255, 0.08); border-radius: 12px; padding: 18px;">
                                            <tr>
                                                <td width="50%" style="vertical-align: top; padding: 6px 12px;">
                                                    <div style="font-size: 11px; font-weight: 700; text-transform: uppercase; color: #B5945B; letter-spacing: 1px; margin-bottom: 8px;">👤 Customer</div>
                                                    <div style="font-size: 14px; font-weight: 700; color: #FFFFFF;">${orderData.customerName}</div>
                                                    <div style="font-size: 13px; color: #D1D5DB; margin-top: 4px;">📞 ${orderData.customerPhone || 'N/A'}</div>
                                                    <div style="font-size: 13px; color: #9CA3AF; margin-top: 2px;">✉️ ${orderData.customerEmail || 'N/A'}</div>
                                                </td>
                                                <td width="50%" style="vertical-align: top; padding: 6px 12px;">
                                                    <div style="font-size: 11px; font-weight: 700; text-transform: uppercase; color: #B5945B; letter-spacing: 1px; margin-bottom: 8px;">📍 Shipping Address</div>
                                                    <div style="font-size: 13px; color: #E5E7EB; line-height: 1.5;">
                                                        ${orderData.shippingAddress.addressLine1}
                                                        ${orderData.shippingAddress.addressLine2 ? '<br>' + orderData.shippingAddress.addressLine2 : ''}<br>
                                                        ${orderData.shippingAddress.city}, ${orderData.shippingAddress.state} - ${orderData.shippingAddress.pincode}<br>
                                                        ${orderData.shippingAddress.country || 'India'}
                                                    </div>
                                                </td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>

                                <!-- Items List -->
                                <tr>
                                    <td style="padding: 0 30px 24px 30px;">
                                        <div style="font-size: 12px; font-weight: 700; text-transform: uppercase; color: #B5945B; letter-spacing: 1px; margin-bottom: 10px;">
                                            📦 Items in Order (${orderData.items.length})
                                        </div>
                                        <table width="100%" cellpadding="6" cellspacing="0" style="border-collapse: collapse; font-size: 12px;">
                                            <thead>
                                                <tr style="border-bottom: 1px solid rgba(181, 148, 91, 0.2); color: #9CA3AF; text-align: left;">
                                                    <th style="padding-bottom: 8px;">Item</th>
                                                    <th style="padding-bottom: 8px; text-align: center;">Size</th>
                                                    <th style="padding-bottom: 8px; text-align: center;">Qty</th>
                                                    <th style="padding-bottom: 8px; text-align: right;">Price</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                ${orderData.items.map(item => `
                                                    <tr style="border-bottom: 1px solid rgba(255, 255, 255, 0.05);">
                                                        <td style="color: #FFFFFF; font-weight: 600; padding: 10px 0;">${item.title}</td>
                                                        <td style="color: #B5945B; text-align: center; font-weight: 700; padding: 10px 0;">${item.size}</td>
                                                        <td style="color: #E5E7EB; text-align: center; padding: 10px 0;">${item.quantity}</td>
                                                        <td style="color: #10B981; text-align: right; font-weight: 700; padding: 10px 0;">₹${(item.price * item.quantity).toLocaleString('en-IN')}</td>
                                                    </tr>
                                                `).join('')}
                                            </tbody>
                                        </table>
                                    </td>
                                </tr>

                                <!-- CTA Button -->
                                <tr>
                                    <td style="padding: 0 30px 30px 30px; text-align: center;">
                                        <a href="${adminUrl}" style="display: inline-block; background: linear-gradient(135deg, #B5945B, #D4AF37); color: #070F2B; font-weight: 800; font-size: 13px; letter-spacing: 1.5px; text-transform: uppercase; text-decoration: none; padding: 14px 32px; border-radius: 12px; box-shadow: 0 4px 15px rgba(181, 148, 91, 0.4);">
                                            Open in Admin Panel →
                                        </a>
                                    </td>
                                </tr>

                                <!-- Footer -->
                                <tr>
                                    <td style="padding: 18px; text-align: center; background-color: rgba(0, 0, 0, 0.25); border-top: 1px solid rgba(255, 255, 255, 0.05); font-size: 11px; color: #6B7280;">
                                        Zeynix Atelier • Automated Live Order Alert<br>
                                        Sent to ${recipient}
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                </table>
            </body>
            </html>
        `;

        const { data, error } = await resend.emails.send({
            from: 'Zeynix Orders <noreply@zeynix.in>',
            to: [recipient],
            subject,
            html,
        });

        if (error) {
            console.error('❌ Resend admin order notification error:', error);
            return { success: false, error: error.message };
        }

        console.log(`✅ Admin order notification sent to ${recipient}:`, data?.id);
        return { success: true, messageId: data?.id };

    } catch (error) {
        console.error('❌ Failed to send admin order notification email:', error);
        return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
};

export default {
    sendPasswordResetEmail,
    sendPasswordResetSuccessEmail,
    sendAdminNewOrderNotification,
};