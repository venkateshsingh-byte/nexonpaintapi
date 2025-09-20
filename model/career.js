const mongoose = require('mongoose')

const careerSchema = new mongoose.Schema({
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
    upload_cv: { 
        type: String,
        required: true,
    },
    createdDate: {
        type: Date,
        default: Date.now,
    }
});

careerSchema.virtual('id').get(function () {
    return this._id.toHexString();
});

careerSchema.set('toJSON', {
    virtuals: true,
});

const Career = mongoose.model('Career', careerSchema);

module.exports = Career;