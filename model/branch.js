const mongoose = require('mongoose');

const branchSchema = new mongoose.Schema({
  branch_name: { type: String },
  branch_img: { type: String },
  branch_map: { type: String }, // ✅ Google Maps URL stored here
  branch_all_add: { type: String },
  slug_url: { type: String, index: true, unique: true, required: true },
  meta_title: { type: String },
  meta_desc: { type: String },
  dateCreated: { type: Date, default: Date.now }
});

branchSchema.virtual('id').get(function () {
  return this._id.toHexString();
});

branchSchema.set('toJSON', { virtuals: true });

const Branch = mongoose.model('Branch', branchSchema);
module.exports = Branch;
