const multer = require("multer");

const FILE_TYPE_MAP = {
  "image/png": "png",
  "image/jpeg": "jpeg",
  "image/jpg": "jpg",
  "image/jfif": "jfif",
  "application/pdf": "pdf",
  "application/msword": "doc",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document": "docx",
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const isValid = FILE_TYPE_MAP[file.mimetype];
    let uploadPath = "public/uploads/other"; // fallback folder

    if (file.fieldname.includes("upload_cv")) {
      uploadPath = "public/uploads/career_cv";
    } else if (file.fieldname.includes("attached_invoices")) {
      uploadPath = "public/uploads/invoices";
    } else if (file.fieldname.includes("colorImg")) {
      uploadPath = "public/uploads/colorImg";
    } else if (file.fieldname.includes("slider_img")) {
      uploadPath = "public/uploads/slider_img";
    } else if (file.fieldname.includes("inspired_full_img")) {
      uploadPath = "public/uploads/inspired_img";
    } else if (file.fieldname.includes("inspired_small_img")) {
      uploadPath = "public/uploads/inspired_img";
    } else if (file.fieldname.includes("product_img")) {
      uploadPath = "public/uploads/product_img";
    } else if (file.fieldname.includes("product_small_img")) {
      uploadPath = "public/uploads/product_img";
    } else if (file.fieldname.includes("branch_img")) {
      uploadPath = "public/uploads/branch_img";
    } else if (file.fieldname.includes("technical_datasheet")) {
      uploadPath = "public/uploads/product_img";
    } else if (file.fieldname.includes("warranty_document")) {
      uploadPath = "public/uploads/product_img";
    } else if (file.fieldname.includes("green_pro_certificate")) {
      uploadPath = "public/uploads/product_img";
    } else if (file.fieldname.includes("product_single_image_banner")) {
      uploadPath = "public/uploads/product_img";
    } else if (file.fieldname.includes("product_single_image_banner_small")) {
      uploadPath = "public/uploads/product_img";
    } else if (file.fieldname.includes("product_home_banner_img")) {
      uploadPath = "public/uploads/product_img";
    }

    cb(isValid ? null : new Error("Invalid file type"), uploadPath);
  },
  filename: (req, file, cb) => {
    const nameWithoutExt = file.originalname
      .split(" ")
      .join("-")
      .replace(/\.[^/.]+$/, "");
    const extension = FILE_TYPE_MAP[file.mimetype];
    cb(null, `${nameWithoutExt}-${Date.now()}.${extension}`);
  },
});

const fileFilter = (req, file, cb) => {
  const isValid = FILE_TYPE_MAP[file.mimetype];
  cb(isValid ? null : new Error("Invalid file type"), !!isValid);
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 50 * 1024 * 1024 }, // 50 MB
});

module.exports = upload.fields([
  { name: "slider_img", maxCount: 1 },
  { name: "inspired_full_img", maxCount: 1 },
  { name: "inspired_small_img", maxCount: 1 },
  { name: "branch_img", maxCount: 1 },
  { name: "product_img", maxCount: 10 },
  { name: "product_small_img", maxCount: 10 },
  { name: "technical_datasheet", maxCount: 1 },
  { name: "warranty_document", maxCount: 1 },
  { name: "green_pro_certificate", maxCount: 1 },  
  { name: "product_single_image_banner", maxCount: 1 },  
  { name: "product_single_image_banner_small", maxCount: 1 }, 
  { name: "product_home_banner_img", maxCount: 1 },   
  { name: "upload_cv", maxCount: 1 },
  { name: "attached_invoices", maxCount: 1 }, // ✅ allow up to 5 invoices
  { name: "colorImg", maxCount: 5 },
]);
