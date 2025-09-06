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
        // Check for token in cookies (for remember me functionality)
        else {
            const cookies = req.headers.get('cookie');
            if (cookies) {
                const tokenMatch = cookies.match(/token=([^;]+)/);
                if (tokenMatch) {
                    token = tokenMatch[1];
                }
            }
        }

        if (!token) {
            return { user: null, error: 'Access denied. No token provided.' };
        }

        try {
            // Verify token
            const jwtSecret = process.env.JWT_SECRET || 'fallback-secret-change-in-production';
            const decoded = jwt.verify(token, jwtSecret) as { id: string };

            // Get user from token
            const user = await User.findById(decoded.id).select('-password');

            if (!user) {
                return { user: null, error: 'Token is not valid. User not found.' };
            }

            if (!user.isActive) {
                return { user: null, error: 'User account is deactivated.' };
            }

            return { user };
        } catch (error) {
            return { user: null, error: 'Token is not valid.' };
        }
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
export const setTokenCookie = (token: string, rememberMe: boolean = false) => {
    const maxAge = rememberMe ? 30 * 24 * 60 * 60 * 1000 : 24 * 60 * 60 * 1000; // 30 days or 1 day
    const isProduction = process.env.NODE_ENV === 'production';
    const secureFlag = isProduction ? 'Secure' : '';
    const sameSite = 'SameSite=Lax'; // Use Lax for both production and development
    const domain = isProduction ? '; Domain=.zeynix.in' : ''; // Set domain for production
    return `token=${token}; HttpOnly; ${secureFlag}; ${sameSite}; Path=/; ${domain} Max-Age=${maxAge}`;
};
