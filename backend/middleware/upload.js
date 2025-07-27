const multer = require('multer');
const path = require('path');

// تهيئة تخزين الصور
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/uploads/cars/'); // المجلد الذي سيحفظ الصور
  },
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'car-' + uniqueName + path.extname(file.originalname)); // تسمية الملف
  }
});

// تصفية أنواع الملفات المسموحة
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|webp/;
  const isExtValid = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const isMimeValid = allowedTypes.test(file.mimetype);

  if (isExtValid && isMimeValid) {
    cb(null, true);
  } else {
    cb(new Error('فقط الصور (JPEG, JPG, PNG, WEBP) مسموح بها!'), false);
  }
};

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB كحد أقصى
  fileFilter: fileFilter
});

module.exports = upload;