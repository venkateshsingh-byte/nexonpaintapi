const mongoose = require('mongoose')

const warrantySchema = new mongoose.Schema({
    product_name: {
        type: String,
        required: true,
    },
    purchase_date:{
        type: Date,
    },
    purchase_invoice_no:{
        type: String,
    },
    sku_purchased:{
        type: String,
    },
    no_bucket:{
        type: Number,
    },
    quantity_titres:{
        type: String,
    },
    attached_invoices:{
        type: String,
    },
    mfg_date:{
        type: Date,
    },
    application_completion_date:{
        type: Date,
    },
    dealer_name:{
        type: String,
    },
    dealer_mobile:{
        type: String,
    },
    dealer_address:{
        type: String,
    },
    contractor_name:{
        type: String,
    },
    contractor_molile:{
        type: String,
    },
    full_name:{
        type: String,
    },
    mobile_number:{
        type: String,
    },
    active_mail:{
        type: String,
    },
    site_address: {
        type: String,
        required: true,
    },
    your_state: {
        type: String,
        required: true,
    },
    your_city: {
        type: String,
        required: true,
    },
    createdDate: {
        type: Date,
        default: Date.now,
    }
});

warrantySchema.virtual('id').get(function () {
    return this._id.toHexString();
});

warrantySchema.set('toJSON', {
    virtuals: true,
});

const Warranty = mongoose.model('Warranty', warrantySchema);

module.exports = Warranty;