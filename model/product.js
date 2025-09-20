const mongoose = require('mongoose');

const productDetailSchema = new mongoose.Schema({
  product_name: { type: String, required: false },   
  product_img: { type: String, required: false },
  product_small_img:{ type: String, required: false },
  product_subname: { type: String, required: false },
  product_desc: { type: String, required: false },
  technical_datasheet: { type: String },
  warranty_document: { type: String },
  benefit: { type: String },
  green_pro_certificate: { type: String },
  application_process: { type: String },
  meta_title: { type: String },
	meta_desc: { type: String },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
    required: false,
  },
  subcategory: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Subcategory",
    required: false,
  },
  typeofproduct: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "TypeOfProduct", // matches your current model registration
    required: false,
  },
  slug: { type: String, required: false, unique: true },
  dateCreated: {
    type: Date,
    default: Date.now,
  },
});

const productSchema = new mongoose.Schema(
  {
    details: [productDetailSchema],   
  },
  { timestamps: true }
);

productSchema.virtual('id').get(function () {
    return this._id.toHexString();
});

productSchema.set('toJSON', {
    virtuals: true,
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
