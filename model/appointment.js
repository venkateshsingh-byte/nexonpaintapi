const mongoose = require('mongoose')

const appointmentSchema = new mongoose.Schema({
    toa: {
        type: String,
        required: true,
    },
    fname: {
        type: String,
        required: true,
    },
    lname: {
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
    city: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'City',
        required: true,
    },
    store: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Store',
        required: true
    },
    ap_date: {
        type: String,
        required: true,
    },
    ap_time: {
        type: String,
        required: true,
    },
    i_am: {
        type: String,
    },
    createdDate: {
        type: Date,
        default: Date.now,
    }
});

appointmentSchema.virtual('id').get(function () {
    return this._id.toHexString();
});

appointmentSchema.set('toJSON', {
    virtuals: true,
});

const Appointment = mongoose.model('Appointment', appointmentSchema);

module.exports = Appointment;