const mongoose = require('mongoose')

const contactSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    city: {
        type: String,
        required: true,
    },
    phone: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    request: {
        type: String,
        required: true,
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