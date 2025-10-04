const Category = require('../model/category');

module.exports.getCategory = async function(req, res){
    try{
        const category = await Category.find().sort();
        if(category){
            return res.status(200).json({success:true, message:"Get All category Successfully", category});
        }else{
            return res.status(404).json({success:false, message:"Category Not found"});
        }
    }catch{
        return res.status(500).json({success:false, message:"Internal Server Error"});
    }
}

module.exports.getCategoryById = async function(req, res){
    try{
        const category = await Category.findById(req.params.id);
        if(category){
            return res.status(200).json({success:true, message:"Get Category By Id Successfully"})
        }else{
            return res.status(404).json({success:false, message:"Category Not Found"})
        }
    } catch{
        return res.status(500).json({success:false, message:"Internal Server Error"})
    }
} 

module.exports.addCategory = async function(req, res) {
    try {
        const category = new Category({
            cat_name: req.body.cat_name,
            cat_subname: req.body.cat_subname,
            cat_url: req.body.cat_url,
            meta_title:req.body.meta_title,
            meta_desc:req.body.meta_desc
        });

        await category.save();
        return res.status(200).json({ success: true, message: "Category added successfully" });
    } catch (error) {
        console.error('Error saving category:', error);
        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

module.exports.editCategory = async function(req, res){
    try{
        const updateCategory = await Category.findByIdAndUpdate(
            req.params.id,
            {
                cat_name:req.body.cat_name,
                cat_subname: req.body.cat_subname,
                cat_url :req.body.cat_url,
                meta_title:req.body.meta_title,
                meta_desc:req.body.meta_desc
            },
            {new:true},
        )
        return res.status(200).json({success:true,message:"Category Updated Successfully", updateCategory})
    } catch{
        return res.status(500).json({success:false,message:"Internal Server Error"})
    }
}

module.exports.deleteCategory = async function(req, res){
    try{
        const category = await Category.findByIdAndDelete(req.params.id);
        if(category){
            return res.status(200).json({success:true, message:"Category Deleted Successfully", category})
        }else{
            return res.status(404).json({success:false, message:"Category Can not deleted"})
        }
    }catch{
        return res.status(500).json({success:false, message:"Category Deleted Successfully"})
    }
}


module.exports.countCategory = async function (req, res) {
    try{
      const categoryCount = await Category.countDocuments();
      if (categoryCount) {
        return res.status(200).json({ success: true, success: true,categoryCount: categoryCount });
      } else {
        return res.status(404).json({ success: false, message: "User Cannot be Count" });
      }
    } catch (err) {
      return res.status(500).json({ success: false, message: "Internal Server Error", error: err.message });
    }
}