const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ensure local uploads directory exists
const uploadsDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Disk storage (local fallback)
const diskStorage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadsDir),
  filename: (_req, file, cb) => {
    const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, `${file.fieldname}-${unique}${ext}`);
  },
});

// Memory storage — use this when uploading to Cloudinary via uploadBuffer()
const memoryStorage = multer.memoryStorage();

// File type filter
const imageFilter = (_req, file, cb) => {
  const allowed = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
  if (allowed.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Only image files (JPEG, PNG, WebP, GIF) are allowed'), false);
  }
};

const FILE_SIZE_LIMIT = 5 * 1024 * 1024; // 5 MB

// Multer instances
const _diskSingle     = multer({ storage: diskStorage,   fileFilter: imageFilter, limits: { fileSize: FILE_SIZE_LIMIT } }).single('image');
const _diskMultiple   = multer({ storage: diskStorage,   fileFilter: imageFilter, limits: { fileSize: FILE_SIZE_LIMIT } }).array('images', 10);
const _memorySingle   = multer({ storage: memoryStorage, fileFilter: imageFilter, limits: { fileSize: FILE_SIZE_LIMIT } }).single('image');
const _memoryMultiple = multer({ storage: memoryStorage, fileFilter: imageFilter, limits: { fileSize: FILE_SIZE_LIMIT } }).array('images', 10);

// Wrap any multer handler with consistent error responses
const handleUpload = (uploadFn) => (req, res, next) => {
  uploadFn(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      const msg = err.code === 'LIMIT_FILE_SIZE'
        ? 'File too large. Maximum size is 5 MB.'
        : err.message;
      return res.status(400).json({ success: false, message: msg });
    }
    if (err) {
      return res.status(400).json({ success: false, message: err.message });
    }
    next();
  });
};

module.exports = {
  uploadSingle:           handleUpload(_diskSingle),     // disk — single file
  uploadMultiple:         handleUpload(_diskMultiple),   // disk — multiple files
  uploadToMemory:         handleUpload(_memorySingle),   // memory — single (for Cloudinary)
  uploadMultipleToMemory: handleUpload(_memoryMultiple), // memory — multiple (for Cloudinary)
};
