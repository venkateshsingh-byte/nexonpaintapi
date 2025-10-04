const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    product_name: { type: String, required: true, trim: true },
    product_subname: { type: String, trim: true },
    product_desc: { type: String },
    technical_datasheet: { type: String },
    warranty_document: { type: String },
    benefit: { type: String },
    green_pro_certificate: { type: String },
    product_single_image_banner: { type: String },
    product_single_image_banner_small: { type: String },
    product_home_banner_img: { type: String },
    application_process: { type: String },
    meta_title: { type: String, trim: true },
    meta_desc: { type: String, trim: true },

    category: { type: mongoose.Schema.Types.ObjectId, ref: "Category" },
    subcategory: { type: mongoose.Schema.Types.ObjectId, ref: "Subcategory" },
    typeofproduct: { type: mongoose.Schema.Types.ObjectId, ref: "TypeOfProduct" },

    slug: { type: String, required: true, trim: true, lowercase: true },
  },
  {
    timestamps: true, // adds createdAt, updatedAt
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// virtual id
productSchema.virtual('id').get(function () {
  return this._id.toHexString();
});

// unique index on slug
productSchema.index({ slug: 1 }, { unique: true });

// auto-generate slug if missing
productSchema.pre('validate', function (next) {
  if (!this.slug && this.product_name) {
    this.slug = this.product_name
      .toString()
      .trim()
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^a-z0-9-]/g, '')
      .replace(/-+/g, '-');
  }
  next();
});

const Product = mongoose.model('Product', productSchema);
module.exports = Product;
