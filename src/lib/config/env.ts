// Environment configuration with defaults
export const env = {
    MONGODB_URI: process.env.MONGODB_URI || 'mongodb://localhost:27017/zeynix-website',
    JWT_SECRET: process.env.JWT_SECRET || 'fallback-secret-change-in-production',
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET || 'fallback-nextauth-secret',
    NEXTAUTH_URL: process.env.NEXTAUTH_URL || 'http://localhost:3000',
    NODE_ENV: process.env.NODE_ENV || 'production',
    CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME || '',
    CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY || '',
    CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET || '',
    CLOUDINARY_UPLOAD_PRESET: process.env.CLOUDINARY_UPLOAD_PRESET || '',
    EMAIL_USER: process.env.EMAIL_USER || '',
    EMAIL_PASSWORD: process.env.EMAIL_PASSWORD || '',
    CLIENT_URL: process.env.CLIENT_URL || 'http://localhost:3001',
    RESEND_API_KEY: process.env.RESEND_API_KEY || '',
    // Razorpay Configuration (Live API Only)
    RAZORPAY_KEY_ID_LIVE: process.env.RAZORPAY_KEY_ID_LIVE || '',
    RAZORPAY_KEY_SECRET_LIVE: process.env.RAZORPAY_KEY_SECRET_LIVE || ''
};

// Debug function to check environment variables
export const debugEnv = () => {
    console.log('🔍 Environment Variables Debug:');
    console.log('MONGODB_URI:', process.env.MONGODB_URI ? '✅ Set' : '❌ Missing');
    console.log('JWT_SECRET:', process.env.JWT_SECRET ? '✅ Set' : '❌ Missing');
    console.log('NODE_ENV:', process.env.NODE_ENV || 'development');
    console.log('CLOUDINARY_CLOUD_NAME:', process.env.CLOUDINARY_CLOUD_NAME ? '✅ Set' : '❌ Missing');
    console.log('EMAIL_USER:', process.env.EMAIL_USER ? '✅ Set' : '❌ Missing');
    console.log('EMAIL_PASSWORD:', process.env.EMAIL_PASSWORD ? '✅ Set' : '❌ Missing');
    console.log('CLIENT_URL:', process.env.CLIENT_URL || 'http://localhost:3001');
    console.log('RESEND_API_KEY:', process.env.RESEND_API_KEY ? '✅ Set' : '❌ Missing');
    console.log('RAZORPAY_KEY_ID_LIVE:', process.env.RAZORPAY_KEY_ID_LIVE ? '✅ Set' : '❌ Missing');
    console.log('RAZORPAY_KEY_SECRET_LIVE:', process.env.RAZORPAY_KEY_SECRET_LIVE ? '✅ Set' : '❌ Missing');
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
