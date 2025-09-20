const mongoose = require('mongoose');

const homesliderSchema = new mongoose.Schema({
    left_text:{
        type:String,
    },
    right_text:{
        type:String,
    },
    slider_img:{
        type:String,
    },
    slider_link:{
        type:String,
    },
    color_code:{
        type:String,
    },
    color_name:{
        type:String,
    },
    dateCreated:{
        type:Date,
        default:Date.now
    }
});

homesliderSchema.virtual('id').get(function(){
    return this._id.toHexString();
});

homesliderSchema.set('toJSON', {
    virtuals:true
});

const HomeSlider = mongoose.model('HomeSlider',homesliderSchema);

module.exports= HomeSlider;

