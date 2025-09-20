const TypeOfProduct = require('../model/typeofproduct');

module.exports.getTypeOfProduct = async function(req, res){
    try{
        const typeofproduct = await TypeOfProduct.find().sort();
        if(typeofproduct){
            return res.status(200).json({success:true, message:"Get All Type Of Product Successfully", typeofproduct});
        }else{
            return res.status(404).json({success:false, message:"Type Of Product Not found"});
        }
    }catch{
        return res.status(500).json({success:false, message:"Internal Server Error"});
    }
}

module.exports.getTypeOfProductById = async function(req, res){
    try{
        const typeofproduct = await TypeOfProduct.findById(req.params.id);
        if(typeofproduct){
            return res.status(200).json({success:true, message:"Get Type Of Product By Id Successfully"})
        }else{
            return res.status(404).json({success:false, message:"Type Of Product Not Found"})
        }
    } catch{
        return res.status(500).json({success:false, message:"Internal Server Error"})
    }
} 

module.exports.addTypeOfProduct = async function(req, res) {
    try {
        const typeofproduct = new TypeOfProduct({
            typeofproduct_name: req.body.typeofproduct_name,
        });

        await typeofproduct.save();
        return res.status(200).json({ success: true, message: "Type Of Product added successfully" });
    } catch (error) {
        console.error('Error saving Type Of Product:', error);
        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

module.exports.editTypeOfProduct = async function(req, res){
    try{
        const typeofproduct = await TypeOfProduct.findByIdAndUpdate(
            req.params.id,
            {
                typeofproduct_name:req.body.typeofproduct_name,
            },
            {new:true},
        )
        return res.status(200).json({success:true,message:"Type of product Updated Successfully", typeofproduct})
    } catch{
        return res.status(500).json({success:false,message:"Internal Server Error"})
    }
}

module.exports.deleteTypeOfProduct = async function(req, res){
    try{
        const typeofproduct = await TypeOfProduct.findByIdAndDelete(req.params.id);
        if(typeofproduct){
            return res.status(200).json({success:true, message:"Type of Product Deleted Successfully"})
        }else{
            return res.status(404).json({success:false, message:"Type of product Can not deleted"})
        }
    }catch{
        return res.status(500).json({success:false, message:"Type of Product Deleted Successfully"})
    }
}


