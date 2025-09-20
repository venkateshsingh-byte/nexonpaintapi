const mongoose = require('mongoose');

const inspiredcategorySchema = new mongoose.Schema({
    cat_inspired_name:{
        type:String,
        reqiired:true,
    },
    dateCreated:{
        type:Date,
        default:Date.now
    }
});

inspiredcategorySchema.virtual('id').get(function(){
    return this._id.toHexString();
});

inspiredcategorySchema.set('toJSON', {
    virtuals:true
});

const InspiredCategory = mongoose.model('InspiredCategory',inspiredcategorySchema);

module.exports= InspiredCategory;

