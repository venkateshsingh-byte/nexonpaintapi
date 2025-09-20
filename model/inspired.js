const mongoose = require('mongoose');

const inspiredSchema = new mongoose.Schema({
    inspired_name:{
        type:String,
        reqiired:true,
    },
    inspired_full_img:{
        type:String,
    },
    inspired_small_img:{
        type:String,
    },
    inspiredcategory: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'InspiredCategory',
        required: true,
    },
    dateCreated:{
        type:Date,
        default:Date.now
    }
});

inspiredSchema.virtual('id').get(function(){
    return this._id.toHexString();
});

inspiredSchema.set('toJSON', {
    virtuals:true
});

const Inspired = mongoose.model('Inspired',inspiredSchema);

module.exports= Inspired;

