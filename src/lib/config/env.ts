// Environment configuration with defaults
export const env = {
    MONGODB_URI: process.env.MONGODB_URI || 'mongodb://localhost:27017/zeynix-website',
    JWT_SECRET: process.env.JWT_SECRET || 'fallback-secret-change-in-production',
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET || 'fallback-nextauth-secret',
    NEXTAUTH_URL: process.env.NEXTAUTH_URL || 'http://localhost:3000',
    NODE_ENV: process.env.NODE_ENV || 'development',
    CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME || '',
    CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY || '',
    CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET || '',
    CLOUDINARY_UPLOAD_PRESET: process.env.CLOUDINARY_UPLOAD_PRESET || ''
};

// Validate required environment variables
export const validateEnv = () => {
    const required = ['MONGODB_URI', 'JWT_SECRET'];
    const missing = required.filter(key => !process.env[key]);

    if (missing.length > 0) {
        console.warn(`⚠️  Missing environment variables: ${missing.join(', ')}`);
        console.warn('Using fallback values. Please set these in production.');
    }

    return env;
};

// Export validated environment
export default validateEnv();
