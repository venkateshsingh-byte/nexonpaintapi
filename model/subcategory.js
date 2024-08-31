const mongoose = require('mongoose');

const subcategorySchema = new mongoose.Schema({
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: true
    },
    subcat_name: {
        type: String,
        required: true,
    },
    subcat_url:{
        type:String,
        reqiired:true,
    },
    meta_title: {
        type: String,
        required: false
    },
    meta_desc: {
        type: String,
        required: false
    },
    dateCreated: {
        type: Date,
        default: Date.now,
    }
});

subcategorySchema.virtual('id').get(function() {
    return this._id.toHexString();
});

subcategorySchema.set('toJSON', {
    virtuals: true,
});

const Subcategory = mongoose.model('Subcategory', subcategorySchema);

module.exports = Subcategory;