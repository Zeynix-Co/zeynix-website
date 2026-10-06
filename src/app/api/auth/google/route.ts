import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/config/database';
import { User } from '@/lib/models/User';
import { generateToken, setTokenCookie } from '@/lib/middleware/auth';
import crypto from 'crypto';

// POST /api/auth/google - Sign in or register with Google
export async function POST(request: NextRequest) {
    try {
        await connectDB();

        const body = await request.json();
        const { credential, profile } = body;

        let email = '';
        let name = '';
        let picture = '';
        let googleId = '';

        if (credential) {
            // Verify Google ID token via Google's tokeninfo endpoint
            try {
                const googleRes = await fetch(`https://oauth2.googleapis.com/tokeninfo?id_token=${encodeURIComponent(credential)}`);
                const googleData = await googleRes.json();

                if (!googleRes.ok || !googleData.email) {
                    return NextResponse.json(
                        {
                            success: false,
                            message: googleData.error_description || 'Invalid Google credential token'
                        },
                        { status: 400 }
                    );
                }

                email = googleData.email.toLowerCase();
                name = googleData.name || googleData.given_name || email.split('@')[0];
                picture = googleData.picture || '';
                googleId = googleData.sub || '';
            } catch (verifyErr) {
                console.error('Google token verification failed:', verifyErr);
                return NextResponse.json(
                    {
                        success: false,
                        message: 'Could not verify Google authentication'
                    },
                    { status: 400 }
                );
            }
        } else if (profile && profile.email) {
            // Fallback for direct profile payload (e.g. custom OAuth flow)
            email = profile.email.toLowerCase();
            name = profile.name || email.split('@')[0];
            picture = profile.picture || '';
            googleId = profile.googleId || profile.sub || '';
        } else {
            return NextResponse.json(
                {
                    success: false,
                    message: 'Google credential or profile is required'
                },
                { status: 400 }
            );
        }

        // Find or create user in MongoDB
        let user = await User.findOne({ email });

        if (user) {
            if (!user.isActive) {
                return NextResponse.json(
                    {
                        success: false,
                        message: 'This account has been deactivated. Please contact support.'
                    },
                    { status: 403 }
                );
            }

            // Update googleId and avatar if not yet set
            let updated = false;
            if (!user.googleId && googleId) {
                user.googleId = googleId;
                updated = true;
            }
            if (!user.avatar && picture) {
                user.avatar = picture;
                updated = true;
            }
            if (updated) {
                await user.save({ validateBeforeSave: false });
            }
        } else {
            // Create a new user for Google Sign-In
            const randomPassword = crypto.randomBytes(32).toString('hex');
            user = await User.create({
                name,
                email,
                googleId,
                avatar: picture,
                password: randomPassword,
                role: 'user',
                isActive: true
            });
        }

        // Generate Zeynix JWT token
        const token = generateToken(user._id.toString(), true);

        const nextResponse = NextResponse.json({
            success: true,
            message: 'Signed in with Google successfully',
            data: {
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    phone: user.phone || '',
                    role: user.role,
                    avatar: user.avatar || picture
                },
                token
            }
        });

        // Set token cookie
        const cookieString = setTokenCookie(token, true);
        nextResponse.headers.set('Set-Cookie', cookieString);

        return nextResponse;

    } catch (error) {
        console.error('Google auth error:', error);
        return NextResponse.json(
            {
                success: false,
                message: 'Internal server error during Google sign-in'
            },
            { status: 500 }
        );
    }
}
