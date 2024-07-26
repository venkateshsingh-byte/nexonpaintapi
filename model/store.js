const mongoose = require('mongoose');

const storeSchema = new mongoose.Schema({
    store_name:{
        type:String,
        required:true,
    },
    city:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'city',
        required:true,
    },
    dateCreated: {
        type: Date,
        default: Date.now,
    }
});

storeSchema.virtual('id').get(function() {
    return this._id.toHexString();
});

storeSchema.set('toJSON', {
    virtuals: true,
});

const Store = mongoose.model('Store', storeSchema);

module.exports = Store;