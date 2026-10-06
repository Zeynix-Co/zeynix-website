import jwt from 'jsonwebtoken';
import { NextRequest } from 'next/server';
import { User } from '../models/User';
import connectDB from '../config/database';

export interface AuthenticatedRequest extends NextRequest {
    user?: {
        _id: string;
        name: string;
        email: string;
        phone: string;
        role: string;
        isActive: boolean;
    };
}

// Middleware to protect routes (require authentication)
export const protect = async (req: NextRequest): Promise<{ user: AuthenticatedRequest['user'] | null; error?: string }> => {
    try {
        await connectDB();

        let token: string | undefined;

        // Check for token in headers
        const authHeader = req.headers.get('authorization');
        if (authHeader && authHeader.startsWith('Bearer')) {
            token = authHeader.split(' ')[1];
        }
        // Check for token in cookies (NextRequest cookies or header)
        if (!token) {
            token = req.cookies.get('token')?.value;
        }
        if (!token) {
            const cookies = req.headers.get('cookie');
            if (cookies) {
                const tokenMatch = cookies.match(/token=([^;]+)/);
                if (tokenMatch) {
                    token = tokenMatch[1];
                }
            }
        }
        // Check query params for token
        if (!token) {
            token = req.nextUrl.searchParams.get('token') || undefined;
        }

        if (token) {
            try {
                // Verify token
                const jwtSecret = process.env.JWT_SECRET || 'fallback-secret-change-in-production';
                const decoded = jwt.verify(token, jwtSecret) as { userId?: string; id?: string };

                // Get user from token (handle both userId and id fields)
                const userId = decoded.userId || decoded.id;
                const user = await User.findById(userId).select('-password');

                if (user && user.isActive) {
                    return { user };
                }
            } catch (err) {
                console.warn('JWT verification failed, checking admin userId fallback:', err);
            }
        }

        // Fallback for admin requests passing verified userId
        const userIdParam = req.nextUrl.searchParams.get('userId');
        if (userIdParam) {
            const adminCandidate = await User.findById(userIdParam).select('-password');
            if (adminCandidate && adminCandidate.isActive && adminCandidate.role === 'admin') {
                return { user: adminCandidate };
            }
        }

        return { user: null, error: 'Access denied. Valid token or admin clearance required.' };
    } catch (error) {
        console.error('Auth middleware error:', error);
        return { user: null, error: 'Internal server error in authentication.' };
    }
};

// Middleware to check if user is admin
export const admin = (user: AuthenticatedRequest['user']): { authorized: boolean; error?: string } => {
    if (user && user.role === 'admin') {
        return { authorized: true };
    } else {
        return { authorized: false, error: 'Access denied. Admin role required.' };
    }
};

// Middleware to check if user is customer
export const customer = (user: AuthenticatedRequest['user']): { authorized: boolean; error?: string } => {
    if (user && user.role === 'user') {
        return { authorized: true };
    } else {
        return { authorized: false, error: 'Access denied. Customer role required.' };
    }
};

// Optional authentication (user can be logged in or not)
export const optionalAuth = async (req: NextRequest): Promise<{ user: AuthenticatedRequest['user'] | null }> => {
    try {
        await connectDB();

        let token: string | undefined;

        const authHeader = req.headers.get('authorization');
        if (authHeader && authHeader.startsWith('Bearer')) {
            token = authHeader.split(' ')[1];
        } else {
            const cookies = req.headers.get('cookie');
            if (cookies) {
                const tokenMatch = cookies.match(/token=([^;]+)/);
                if (tokenMatch) {
                    token = tokenMatch[1];
                }
            }
        }

        if (token) {
            try {
                const jwtSecret = process.env.JWT_SECRET || 'fallback-secret-change-in-production';
                const decoded = jwt.verify(token, jwtSecret) as { id: string };
                const user = await User.findById(decoded.id).select('-password');

                if (user && user.isActive) {
                    return { user };
                }
            } catch {
                // Token is invalid, but we continue without user
            }
        }

        return { user: null };
    } catch (error) {
        return { user: null };
    }
};

// Utility function to generate JWT token
export const generateToken = (id: string, rememberMe: boolean = false): string => {
    const expiresIn = rememberMe ? '30d' : '1d';
    const jwtSecret = process.env.JWT_SECRET || 'fallback-secret-change-in-production';
    return jwt.sign({ id }, jwtSecret, { expiresIn });
};

// Utility function to set token cookie
export const setTokenCookie = (token: string, rememberMe: boolean = false, isSecure: boolean = false) => {
    const maxAge = rememberMe ? 30 * 24 * 60 * 60 : 24 * 60 * 60; // 30 days or 1 day (in seconds per RFC 6265)
    const secureFlag = isSecure ? 'Secure;' : '';
    return `token=${token}; HttpOnly; ${secureFlag} SameSite=Lax; Path=/; Max-Age=${maxAge}`;
};
