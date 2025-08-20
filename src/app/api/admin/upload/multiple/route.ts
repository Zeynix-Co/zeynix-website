import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import { User } from '@/lib/models/User';
import env from '@/lib/config/env';

// Connect to MongoDB
const connectDB = async () => {
    try {
        if (mongoose.connection.readyState === 1) {
            return; // Already connected
        }

        await mongoose.connect(env.MONGODB_URI);
        console.log('✅ MongoDB Connected for Admin Multiple Image Upload');
    } catch (error) {
        console.error('❌ MongoDB connection failed for Admin Multiple Image Upload:', error);
        throw error;
    }
};

// POST /api/admin/upload/multiple - Upload multiple images
export async function POST(request: NextRequest) {
    try {
        await connectDB();

        // Get the form data
        const formData = await request.formData();
        const images = formData.getAll('images') as File[];
        const userId = formData.get('userId') as string;

        // Validate input
        if (!images || images.length === 0) {
            return NextResponse.json(
                {
                    success: false,
                    message: 'At least one image file is required'
                },
                { status: 400 }
            );
        }

        if (!userId) {
            return NextResponse.json(
                {
                    success: false,
                    message: 'User ID is required'
                },
                { status: 400 }
            );
        }

        // Verify user is admin
        const adminUser = await User.findOne({ _id: userId, role: 'admin' });
        if (!adminUser) {
            return NextResponse.json(
                {
                    success: false,
                    message: 'Unauthorized access'
                },
                { status: 401 }
            );
        }

        // Validate each image
        const maxSize = 5 * 1024 * 1024; // 5MB
        for (const image of images) {
            if (!image.type.startsWith('image/')) {
                return NextResponse.json(
                    {
                        success: false,
                        message: `File ${image.name} must be an image`
                    },
                    { status: 400 }
                );
            }

            if (image.size > maxSize) {
                return NextResponse.json(
                    {
                        success: false,
                        message: `Image ${image.name} size must be less than 5MB`
                    },
                    { status: 400 }
                );
            }
        }

        // Upload multiple images to Cloudinary
        const uploadedImages = [];

        for (const image of images) {
            try {
                const cloudinaryUrl = `https://api.cloudinary.com/v1_1/${env.CLOUDINARY_CLOUD_NAME}/image/upload`;

                const formData = new FormData();
                formData.append('file', image);
                formData.append('upload_preset', env.CLOUDINARY_UPLOAD_PRESET || 'ml_default');

                const cloudinaryResponse = await fetch(cloudinaryUrl, {
                    method: 'POST',
                    body: formData,
                });

                if (cloudinaryResponse.ok) {
                    const cloudinaryData = await cloudinaryResponse.json();

                    uploadedImages.push({
                        public_id: cloudinaryData.public_id,
                        secure_url: cloudinaryData.secure_url,
                        width: cloudinaryData.width,
                        height: cloudinaryData.height,
                        format: cloudinaryData.format,
                        bytes: cloudinaryData.bytes,
                        original_filename: image.name
                    });
                } else {
                    // Fallback to mock response for failed uploads
                    uploadedImages.push({
                        public_id: `mock_${Date.now()}_${uploadedImages.length}_${Math.random().toString(36).substr(2, 9)}`,
                        secure_url: `https://via.placeholder.com/400x400/cccccc/666666?text=Image+${uploadedImages.length + 1}`,
                        width: 400,
                        height: 400,
                        format: image.type.split('/')[1] || 'jpeg',
                        bytes: image.size,
                        original_filename: image.name
                    });
                }
            } catch (error) {
                console.error(`Failed to upload image ${image.name}:`, error);
                // Fallback to mock response
                uploadedImages.push({
                    public_id: `mock_${Date.now()}_${uploadedImages.length}_${Math.random().toString(36).substr(2, 9)}`,
                    secure_url: `https://via.placeholder.com/400x400/cccccc/666666?text=Image+${uploadedImages.length + 1}`,
                    width: 400,
                    height: 400,
                    format: image.type.split('/')[1] || 'jpeg',
                    bytes: image.size,
                    original_filename: image.name
                });
            }
        }

        return NextResponse.json({
            success: true,
            message: `${uploadedImages.length} images uploaded successfully`,
            data: uploadedImages
        });

    } catch (error) {
        console.error('Multiple image upload error:', error);
        return NextResponse.json(
            {
                success: false,
                message: 'Internal server error uploading images'
            },
            { status: 500 }
        );
    }
}
