const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Verify uploads folder exists locally, create if it doesn't
const uploadDir = path.join(__dirname, '../../uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}

// Storage configurations
const storage = multer.diskStorage({
    destination(req, file, cb) {
        cb(null, uploadDir); 
    },
    filename(req, file, cb) {
        cb(null, `evidence-${Date.now()}${path.extname(file.originalname)}`);
    }
});

// File validator rules
function checkFileType(file, cb) {
    const filetypes = /jpg|jpeg|png|mp4|mkv/; 
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);

    if (extname && mimetype) {
        return cb(null, true);
    } else {
        cb('Error: System accepts Images and Videos only!');
    }
}

const upload = multer({
    storage,
    fileFilter: function (req, file, cb) {
        checkFileType(file, cb);
    }
});

module.exports = upload;
