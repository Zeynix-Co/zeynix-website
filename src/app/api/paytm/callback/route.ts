import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/config/database';
import { Order } from '@/lib/models/Order';
import { verifyPaymentResponse, updateOrderPaymentStatus, validatePaymentCallback } from '@/lib/utils/paytm-simple';
import { TRANSACTION_STATUS } from '@/lib/config/paytm';

export async function POST(request: NextRequest) {
    try {
        // Get callback data from request body
        const callbackData = await request.json();

        // Validate callback data
        if (!validatePaymentCallback(callbackData)) {
            return NextResponse.json(
                { success: false, message: 'Invalid callback data' },
                { status: 400 }
            );
        }

        // Verify payment response
        const verificationResult = await verifyPaymentResponse(callbackData);

        if (!verificationResult.isValid) {
            return NextResponse.json(
                {
                    success: false,
                    message: 'Payment verification failed',
                    error: verificationResult.error
                },
                { status: 400 }
            );
        }

        // Update order payment status
        const updateResult = await updateOrderPaymentStatus(
            verificationResult.orderId!,
            {
                transactionId: verificationResult.transactionId!,
                status: verificationResult.status!,
                amount: verificationResult.amount!,
                paymentMethod: 'paytm'
            }
        );

        if (!updateResult.success) {
            return NextResponse.json(
                {
                    success: false,
                    message: 'Failed to update order status',
                    error: updateResult.error
                },
                { status: 500 }
            );
        }

        // Determine redirect URL based on payment status
        const isSuccess = verificationResult.status === TRANSACTION_STATUS.SUCCESS;
        const redirectUrl = isSuccess
            ? `/payment/success?orderId=${verificationResult.orderId}&transactionId=${verificationResult.transactionId}`
            : `/payment/failure?orderId=${verificationResult.orderId}&error=${encodeURIComponent(verificationResult.error || 'Payment failed')}`;

        // Return success response
        return NextResponse.json({
            success: true,
            data: {
                orderId: verificationResult.orderId,
                transactionId: verificationResult.transactionId,
                status: verificationResult.status,
                amount: verificationResult.amount,
                redirectUrl
            },
            message: 'Payment processed successfully'
        });

    } catch (error) {
        console.error('Payment callback error:', error);
        return NextResponse.json(
            {
                success: false,
                message: 'Payment callback processing failed',
                error: process.env.NODE_ENV === 'development' ? (error instanceof Error ? error.message : String(error)) : undefined
            },
            { status: 500 }
        );
    }
}

// Handle GET requests (for browser redirects)
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);

        // Extract callback parameters from URL
        const callbackData = {
            ORDERID: searchParams.get('ORDERID'),
            TXNID: searchParams.get('TXNID'),
            TXNAMOUNT: searchParams.get('TXNAMOUNT'),
            STATUS: searchParams.get('STATUS'),
            RESPCODE: searchParams.get('RESPCODE'),
            RESPMSG: searchParams.get('RESPMSG'),
            BANKTXNID: searchParams.get('BANKTXNID'),
            TXNDATE: searchParams.get('TXNDATE'),
            GATEWAYNAME: searchParams.get('GATEWAYNAME'),
            BANKNAME: searchParams.get('BANKNAME'),
            PAYMENTMODE: searchParams.get('PAYMENTMODE'),
            CHECKSUMHASH: searchParams.get('CHECKSUMHASH'),
        };

        // Validate callback data
        if (!validatePaymentCallback(callbackData)) {
            return NextResponse.redirect(
                new URL('/payment/failure?error=Invalid callback data', request.url)
            );
        }

        // Verify payment response
        const verificationResult = await verifyPaymentResponse(callbackData);

        if (!verificationResult.isValid) {
            return NextResponse.redirect(
                new URL(`/payment/failure?orderId=${callbackData.ORDERID}&error=${encodeURIComponent(verificationResult.error || 'Payment verification failed')}`, request.url)
            );
        }

        // Update order payment status
        const updateResult = await updateOrderPaymentStatus(
            verificationResult.orderId!,
            {
                transactionId: verificationResult.transactionId!,
                status: verificationResult.status!,
                amount: verificationResult.amount!,
                paymentMethod: 'paytm'
            }
        );

        if (!updateResult.success) {
            return NextResponse.redirect(
                new URL(`/payment/failure?orderId=${verificationResult.orderId}&error=${encodeURIComponent(updateResult.error || 'Failed to update order')}`, request.url)
            );
        }

        // Redirect to success or failure page
        const isSuccess = verificationResult.status === TRANSACTION_STATUS.SUCCESS;
        const redirectUrl = isSuccess
            ? `/payment/success?orderId=${verificationResult.orderId}&transactionId=${verificationResult.transactionId}`
            : `/payment/failure?orderId=${verificationResult.orderId}&error=${encodeURIComponent('Payment failed')}`;

        return NextResponse.redirect(new URL(redirectUrl, request.url));

    } catch (error) {
        console.error('Payment callback GET error:', error);
        return NextResponse.redirect(
            new URL('/payment/failure?error=Payment processing failed', request.url)
        );
    }
}
