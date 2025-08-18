const cloudinary = require('../config/cloudinary');

// @desc    Upload single image to Cloudinary
// @route   POST /api/admin/upload-image
// @access  Private (Admin only)
const uploadImage = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: 'No image file provided'
            });
        }

        // Convert buffer to base64 for Cloudinary upload
        const base64Image = `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`;

        // Upload to Cloudinary directly from memory
        const result = await cloudinary.uploader.upload(base64Image, {
            folder: 'zeynix/products',
            quality: 'auto:best', // Maintain high quality
            transformation: [
                { width: 1200, height: 1200, crop: 'limit' } // Max dimensions
            ]
        });

        res.status(200).json({
            success: true,
            message: 'Image uploaded successfully',
            data: {
                url: result.secure_url,
                public_id: result.public_id,
                width: result.width,
                height: result.height,
                format: result.format,
                size: result.bytes
            }
        });

    } catch (error) {
        console.error('Image upload error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to upload image',
            error: error.message
        });
    }
};

// @desc    Upload multiple images to Cloudinary
// @route   POST /api/admin/upload-multiple
// @access  Private (Admin only)
const uploadMultipleImages = async (req, res) => {
    try {
        if (!req.files || req.files.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'No image files provided'
            });
        }

        const uploadPromises = req.files.map(file => {
            // Convert buffer to base64 for Cloudinary upload
            const base64Image = `data:${file.mimetype};base64,${file.buffer.toString('base64')}`;

            return cloudinary.uploader.upload(base64Image, {
                folder: 'zeynix/products',
                quality: 'auto:best',
                transformation: [
                    { width: 1200, height: 1200, crop: 'limit' }
                ]
            });
        });

        const results = await Promise.all(uploadPromises);

        const uploadedImages = results.map(result => ({
            url: result.secure_url,
            public_id: result.public_id,
            width: result.width,
            height: result.height,
            format: result.format,
            size: result.bytes
        }));

        res.status(200).json({
            success: true,
            message: `${uploadedImages.length} images uploaded successfully`,
            data: uploadedImages
        });

    } catch (error) {
        console.error('Multiple image upload error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to upload images',
            error: error.message
        });
    }
};

// @desc    Delete image from Cloudinary
// @route   DELETE /api/admin/delete-image
// @access  Private (Admin only)
const deleteImage = async (req, res) => {
    try {
        const { public_id } = req.body;

        if (!public_id) {
            return res.status(400).json({
                success: false,
                message: 'Public ID is required'
            });
        }

        const result = await cloudinary.uploader.destroy(public_id);

        if (result.result === 'ok') {
            res.status(200).json({
                success: true,
                message: 'Image deleted successfully'
            });
        } else {
            res.status(400).json({
                success: false,
                message: 'Failed to delete image'
            });
        }

    } catch (error) {
        console.error('Image deletion error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to delete image',
            error: error.message
        });
    }
};

module.exports = {
    uploadImage,
    uploadMultipleImages,
    deleteImage
};
