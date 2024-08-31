const mongoose = require('mongoose')

const appointmentSchema = new mongoose.Schema({
    toa: {
        type: String,
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
        type: String,
        required: true,
    },
    store: {
        type: String,
    },
    ap_date: {
        type: String,
    },
    ap_time: {
        type: String,
    },
    i_am: {
        type: String,
    },
    utm_source:{
        type: String,
    },
    utm_medium:{
        type: String,
    },
    utm_campaign:{
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