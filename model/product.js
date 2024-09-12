const mongoose = require('mongoose');

const variationSchema = new mongoose.Schema({
    sku: {
        type: String,
        required: true,
    },
    sku_subtitle: {
        type: String,
        required: true,
    },
    single_img: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    sale_price: {
        type: Number,
        required: true,
    },
    color_name: {
        type: String,
        required: true,
    },
    color_image: {
        type: String,
        required: true,
    },
    stock: {
        type: Number,
        default: 0,
    },
});

const productSchema = new mongoose.Schema({
    product_title: {
        type: String,
        required: true,
    },
    product_subtitle: {
        type: String,
        required: true,
    },
    short_desc: {
        type: String,
        required: false,
    },
    long_desc: {
        type: String,
        required: false,
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: true,
    },
    subcategory: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Subcategory',
        required: true,
    },
    subsubcategory: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Subsubcategory',
        required: true,  
    },
    attributes: [variationSchema],
    features:{
        type:String
    },
    specs:{
        type:String
    },
    installation_service:{
        type:String
    },
    additional_info:{
        type:String
    },
    returns_warranty:{
        type:String
    },
    spend_save:{
        type:String
    },
    need_help:{
        type:String
    },
    free_shipping:{
        type:String
    },
    dateCreated: {
        type: Date,
        default: Date.now,
    },
});

productSchema.virtual('id').get(function () {
    return this._id.toHexString();
});

productSchema.set('toJSON', {
    virtuals: true,
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
