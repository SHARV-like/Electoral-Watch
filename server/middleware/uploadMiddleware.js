const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('cloudinary').v2;

// Configure Cloudinary with environment variables
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

// Cloudinary storage engine for Multer
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'electoral-watch-evidence', // All uploads go into this Cloudinary folder
        allowed_formats: ['jpg', 'jpeg', 'png', 'mp4', 'mkv'],
        resource_type: 'auto' // Automatically detect image vs video
    }
});

const upload = multer({ storage });

module.exports = upload;
