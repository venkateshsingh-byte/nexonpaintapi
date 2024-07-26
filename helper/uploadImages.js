const multer = require('multer');

const FILE_TYPE_MAP = {
  'image/png': 'png',
  'image/jpeg': 'jpeg',
  'image/jpg': 'jpg',
  'image/jfif': 'jfif'
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const isValid = FILE_TYPE_MAP[file.mimetype];
    let uploadError = new Error('Invalid image type');

    if (isValid) {
      uploadError = null;
    }

    const uploadPath = file.fieldname.includes('single_img') ? 'public/uploads/singleImg' : 'public/uploads/colorImg';
    cb(uploadError, uploadPath);
  },
  filename: (req, file, cb) => {
    const fileName = file.originalname.split(' ').join('-');
    const extension = FILE_TYPE_MAP[file.mimetype];
    cb(null, `${fileName}-${Date.now()}.${extension}`);
  }
});

const fileFilter = (req, file, cb) => {
  console.log('MIME Type:', file.mimetype); // Log the MIME type
  const isValid = FILE_TYPE_MAP[file.mimetype];
  if (isValid) {
    cb(null, true);
  } else {
    console.error('Invalid file type:', file.mimetype); // Log invalid file types
    cb(new Error('Invalid file type'), false);
  }
};

// Dynamic fields configuration
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 50 * 1024 * 1024 } // 50MB file size limit
}).any();

module.exports = upload;
