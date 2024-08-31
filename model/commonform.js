const mongoose = require('mongoose')

const commonFormSchema = new mongoose.Schema({
    sku: {
        type: String,
        required: true,
    },
    sku_subtitle: {
        type: String,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    phone: {
        type: String,
        required: true,
    },
    createdDate: {
        type: Date,
        default: Date.now,
    }
});

commonFormSchema.virtual('id').get(function () {
    return this._id.toHexString();
});

commonFormSchema.set('toJSON', {
    virtuals: true,
});

const CommonForm = mongoose.model('CommonForm', commonFormSchema);

module.exports = CommonForm;