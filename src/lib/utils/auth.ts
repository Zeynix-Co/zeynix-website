import jwt from 'jsonwebtoken';

interface TokenPayload {
    id: string;
    iat: number;
    exp: number;
}

export function verifyToken(token: string): TokenPayload | null {
    try {
        const secret = process.env.JWT_SECRET;
        if (!secret) {
            console.error('JWT_SECRET not found in environment variables');
            return null;
        }

        const decoded = jwt.verify(token, secret) as TokenPayload;
        return decoded;
    } catch (error) {
        console.error('Token verification failed:', error);
        return null;
    }
}

export function generateToken(payload: { userId: string; email: string; role: string }): string {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
        throw new Error('JWT_SECRET not found in environment variables');
    }

    return jwt.sign(payload, secret, { expiresIn: '24h' });
}