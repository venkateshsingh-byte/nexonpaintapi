const mongoose = require('mongoose');

const bucketSchema = new mongoose.Schema({
  product_small_img: { type: String},
  product_img: { type: String, required: true },
  product_bucket_title: { type: String, required: true },
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
});

const colorProductBucketSchema = new mongoose.Schema({
  buckets: {
    type: [bucketSchema], 
    default: []
  },
  dateCreated: {
    type: Date,
    default: Date.now
  }
});

colorProductBucketSchema.virtual('id').get(function () {
  return this._id.toHexString();
});

colorProductBucketSchema.set('toJSON', { virtuals: true });

const ColorProductBucket = mongoose.model('ColorProductBucket', colorProductBucketSchema);

module.exports = ColorProductBucket;
