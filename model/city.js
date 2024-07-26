const mongoose = require('mongoose');

const citySchema = new mongoose.Schema({
    city_name:{
        type:String,
        required:true,
    },
    dateCreated: {
        type: Date,
        default: Date.now
    }
});

citySchema.virtual('id').get(function () {
    return this._id.toHexString();
  });
  
  citySchema.set('toJSON', {
    virtuals: true
  });

const City = mongoose.model('City', citySchema);
module.exports = City;