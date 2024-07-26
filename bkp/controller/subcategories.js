const Subcategory = require('../model/subcategory');
const Category = require('../model/category')

module.exports.getSubcategory = async function(req, res){
    try{
        const subcat = await Subcategory.find().sort().populate('category');
        if(subcat){
            return res.status(200).json({success:true, message:"Get All Subcategory",subcat})
        }else{
            return res.status(404).json({success:false, message:"Subcategory Not found"})
        }
    }catch{
        return res.status(500).json({success:false, message:"Internal Srever Error"})
    }
}

module.exports.getSubcategoryByID = async function(req, res){
    try{
        const subcat = await Subcategory.findById(req.params.id);
        if(subcat){
            return res.status(200).json({success:true, message:"Get Subcategory By Id", subcat})
        }else{
            return res.status(404).json({success:false, message:"Subcategory Not found"})
        }
    }catch{
        return res.status(500).json({success:false, message:"Internal Srever Error"})
    }
}

module.exports.addSubcategory = async function(req, res){
    console.log("Check Cat",req.body);
    try{
        const {category, subcat_name, meta_title, meta_desc} = req.body
        const cat = await Category.findById(category) 
        if(!cat){
            return res.status(404).json({success:false,message:"Category Can not found"})
        }   
        const subcat = new Subcategory({ 
            category:cat._id,
            subcat_name,
            meta_title,
            meta_desc,
        });
        await subcat.save();
        return res.status(200).json({success:true, message:"Get All Subcategory", subcat})
    }catch{
        return res.status(500).json({success:false, message:"Internal Srever Error"})
    }
}

module.exports.editSubcategory = async function(req, res){
    try{
        const {category,subcat_name,meta_title,meta_desc} = req.body
        const cat = Category.findById(category);
        if(!cat){
            return res.status(404).json({success:true,message:"Category Not Found"})
        }
        const subcat = await Subcategory.findByIdAndUpdate(req.params.id,
            {
                subcat_name,
                meta_title,
                meta_desc,
                category:cat._id
            },
            {new:true}
        );
        if(subcat){
            return res.status(200).json({success:true, message:"Subcategory Updated Succefully", subcat})
        }else{
            return res.status(404).json({success:false, message:"Subcategory Not Updated"})
        }
    }catch{
        return res.status(500).json({success:false, message:"Internal Srever Error"})
    }
}

module.exports.deleteSubcategory = async function(req, res){
    try{
        const subcat = await Subcategory.findByIdAndDelete(req.params.id);
        if(subcat){
            return res.status(200).json({success:true, message:"Get All Subcategory"})
        }else{
            return res.status(404).json({success:false, message:"Subcategory Not found"})
        }
    }catch{
        return res.status(500).json({success:false, message:"Internal Srever Error"})
    }
}
