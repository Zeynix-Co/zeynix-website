import env from './env';

export const cloudinaryConfig = {
    cloudName: process.env.CLOUDINARY_CLOUD_NAME || env.CLOUDINARY_CLOUD_NAME,
    apiKey: process.env.CLOUDINARY_API_KEY || env.CLOUDINARY_API_KEY,
    apiSecret: process.env.CLOUDINARY_API_SECRET || env.CLOUDINARY_API_SECRET,
    uploadPreset: process.env.CLOUDINARY_UPLOAD_PRESET || env.CLOUDINARY_UPLOAD_PRESET
};

export const validateCloudinaryConfig = () => {
    if (!cloudinaryConfig.cloudName || !cloudinaryConfig.apiKey || !cloudinaryConfig.apiSecret) {
        console.warn('⚠️ Cloudinary configuration incomplete. Image uploads will use placeholder images.');
        return false;
    }
    return true;
};
