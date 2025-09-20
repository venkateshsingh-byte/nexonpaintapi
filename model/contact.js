const mongoose = require('mongoose')

const contactSchema = new mongoose.Schema({
    help_you: {
        type: String,
        required: true,
    },
    reaching_out: {
        type: String,
        required: true,
    },
    full_name: {
        type: String,
        required: true,
    },
    mobile_number: {
        type: String,
    },
    active_email: {
        type: String,
    },
    your_state: {
        type: String,
    },
    your_city: {
        type: String,
    },
    surface_painting: {
        type: String,
    },
    tell_more: {
        type: String,
    },
    agree: {
        type: String,
    },
    createdDate: {
        type: Date,
        default: Date.now,
    }
});

contactSchema.virtual('id').get(function () {
    return this._id.toHexString();
});

contactSchema.set('toJSON', {
    virtuals: true,
});

const Contact = mongoose.model('Contact', contactSchema);

module.exports = Contact;