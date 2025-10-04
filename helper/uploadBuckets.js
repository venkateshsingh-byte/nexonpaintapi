const multer = require("multer");
const path = require("path");

const FILE_TYPE_MAP = {
  "image/png": "png",
  "image/jpeg": "jpeg",
  "image/jpg": "jpg",
  "image/jfif": "jfif",
};

// Storage setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let uploadPath = "public/uploads/product_img"; // default folder
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const nameWithoutExt = file.originalname
      .split(" ")
      .join("-")
      .replace(/\.[^/.]+$/, "");
    const ext = FILE_TYPE_MAP[file.mimetype];
    cb(null, `${nameWithoutExt}-${Date.now()}.${ext}`);
  },
});

// Filter files
const fileFilter = (req, file, cb) => {
  const isValid = FILE_TYPE_MAP[file.mimetype];
  cb(isValid ? null : new Error("Invalid file type"), !!isValid);
};

// Multer instance
const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 50 * 1024 * 1024 }, // 50 MB
});

// Middleware to handle dynamic bucket fields
const uploadBuckets = (req, res, next) => {
  upload.any()(req, res, function (err) {
    if (err) {
      return res.status(400).json({ response: "error", message: err.message });
    }

    // Process files into req.body.buckets
    const buckets = req.body.buckets || [];

    if (req.files && req.files.length > 0) {
      req.files.forEach((file) => {
        // Extract index from fieldname: buckets[0][product_img] → 0, key → product_img
        const match = file.fieldname.match(/buckets\[(\d+)\]\[(.+)\]/);
        if (match) {
          const index = match[1];
          const key = match[2];

          if (!buckets[index]) buckets[index] = {};
          buckets[index][key] = file.filename;
        }
      });
    }

    req.body.buckets = buckets;
    next();
  });
};

module.exports = uploadBuckets;
