const mongoose = require('mongoose');

const typeofproductSchema = new mongoose.Schema({
    typeofproduct_name:{
        type:String,
        reqiired:true,
    },
    dateCreated:{
        type:Date,
        default:Date.now
    }
});

typeofproductSchema.virtual('id').get(function(){
    return this._id.toHexString();
});

typeofproductSchema.set('toJSON', {
    virtuals:true
});

const TypeOfProduct = mongoose.model('TypeOfProduct',typeofproductSchema);

module.exports= TypeOfProduct;

