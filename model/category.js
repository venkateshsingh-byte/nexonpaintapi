const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
    cat_name:{
        type:String,
        reqiired:true,
    },
    cat_url:{
        type:String,
        reqiired:true,
    },
    dateCreated:{
        type:Date,
        default:Date.now
    }
});

categorySchema.virtual('id').get(function(){
    return this._id.toHexString();
});

categorySchema.set('toJSON', {
    virtuals:true
});

const Category = mongoose.model('Category',categorySchema);

module.exports= Category;

