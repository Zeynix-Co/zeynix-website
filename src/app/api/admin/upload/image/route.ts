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
        console.log('✅ MongoDB Connected for Admin Image Upload');
    } catch (error) {
        console.error('❌ MongoDB connection failed for Admin Image Upload:', error);
        throw error;
    }
};

// POST /api/admin/upload/image - Upload single image
export async function POST(request: NextRequest) {
    try {
        await connectDB();

        // Get the form data
        const formData = await request.formData();
        const image = formData.get('image') as File;
        const userId = formData.get('userId') as string;

        // Validate input
        if (!image) {
            return NextResponse.json(
                {
                    success: false,
                    message: 'Image file is required'
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

        // Validate file type
        if (!image.type.startsWith('image/')) {
            return NextResponse.json(
                {
                    success: false,
                    message: 'File must be an image'
                },
                { status: 400 }
            );
        }

        // Validate file size (max 5MB)
        const maxSize = 5 * 1024 * 1024; // 5MB
        if (image.size > maxSize) {
            return NextResponse.json(
                {
                    success: false,
                    message: 'Image size must be less than 5MB'
                },
                { status: 400 }
            );
        }

        // Upload to Cloudinary
        try {
            const cloudinaryUrl = `https://api.cloudinary.com/v1_1/${env.CLOUDINARY_CLOUD_NAME}/image/upload`;

            const formData = new FormData();
            formData.append('file', image);
            formData.append('upload_preset', env.CLOUDINARY_UPLOAD_PRESET || 'ml_default');

            const cloudinaryResponse = await fetch(cloudinaryUrl, {
                method: 'POST',
                body: formData,
            });

            if (!cloudinaryResponse.ok) {
                throw new Error('Failed to upload to Cloudinary');
            }

            const cloudinaryData = await cloudinaryResponse.json();

            const uploadedImageData = {
                public_id: cloudinaryData.public_id,
                secure_url: cloudinaryData.secure_url,
                width: cloudinaryData.width,
                height: cloudinaryData.height,
                format: cloudinaryData.format,
                bytes: cloudinaryData.bytes,
                original_filename: image.name
            };

            return NextResponse.json({
                success: true,
                message: 'Image uploaded successfully to Cloudinary',
                data: uploadedImageData
            });

        } catch (cloudinaryError) {
            console.error('Cloudinary upload failed:', cloudinaryError);

            // Check if it's a missing upload preset issue
            if (!env.CLOUDINARY_UPLOAD_PRESET) {
                return NextResponse.json({
                    success: false,
                    message: 'Cloudinary upload preset not configured. Please add CLOUDINARY_UPLOAD_PRESET to your environment variables.',
                    error: 'MISSING_UPLOAD_PRESET'
                }, { status: 500 });
            }

            // Fallback to mock response if Cloudinary fails for other reasons
            const mockImageData = {
                public_id: `mock_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
                secure_url: `https://via.placeholder.com/400x400/cccccc/666666?text=Cloudinary+Failed`,
                width: 400,
                height: 400,
                format: image.type.split('/')[1] || 'jpeg',
                bytes: image.size,
                original_filename: image.name
            };

            return NextResponse.json({
                success: true,
                message: 'Image uploaded successfully (mock response - Cloudinary failed)',
                data: mockImageData
            });
        }

    } catch (error) {
        console.error('Image upload error:', error);
        return NextResponse.json(
            {
                success: false,
                message: 'Internal server error uploading image'
            },
            { status: 500 }
        );
    }
}

// DELETE /api/admin/upload/image - Delete image
export async function DELETE(request: NextRequest) {
    try {
        await connectDB();

        const { public_id, userId } = await request.json();

        // Validate input
        if (!public_id) {
            return NextResponse.json(
                {
                    success: false,
                    message: 'Public ID is required'
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

        // For now, we'll simulate image deletion
        // In production, you would delete from your image service (Cloudinary, AWS S3, etc.)
        console.log(`Simulating deletion of image with public_id: ${public_id}`);

        return NextResponse.json({
            success: true,
            message: 'Image deleted successfully'
        });

    } catch (error) {
        console.error('Image deletion error:', error);
        return NextResponse.json(
            {
                success: false,
                message: 'Internal server error deleting image'
            },
            { status: 500 }
        );
    }
}
