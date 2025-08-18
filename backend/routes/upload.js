const express = require('express');
const router = express.Router();
const multer = require('multer');
const {
    uploadImage,
    uploadMultipleImages,
    deleteImage
} = require('../controllers/uploadController');

// File filter for images only
const fileFilter = (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Invalid file type. Only JPEG, PNG and WebP images are allowed.'), false);
    }
};

// Use memory storage instead of disk storage for direct Cloudinary upload
const upload = multer({
    storage: multer.memoryStorage(), // Store files in memory instead of disk
    fileFilter: fileFilter,
    limits: {
        fileSize: 10 * 1024 * 1024, // 10MB limit
        files: 5 // Maximum 5 files
    }
});

// Upload single image
router.post('/image', upload.single('image'), uploadImage);

// Upload multiple images
router.post('/multiple', upload.array('images', 5), uploadMultipleImages);

// Delete image
router.delete('/image', deleteImage);



module.exports = router;
