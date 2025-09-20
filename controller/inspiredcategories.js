const InspiredCategory = require('../model/inspiredcategory');

module.exports.getInspiredCategory = async function(req, res){
    try{
        const inspiredcategory = await InspiredCategory.find().sort();
        if(inspiredcategory){
            return res.status(200).json({success:true, message:"Get All Inspired Category Successfully", inspiredcategory});
        }else{
            return res.status(404).json({success:false, message:"Inspired Category Not found"});
        }
    }catch{
        return res.status(500).json({success:false, message:"Internal Server Error"});
    }
}

module.exports.getInspiredCategoryById = async function(req, res){
    try{
        const inspiredcategory = await InspiredCategory.findById(req.params.id);
        if(inspiredcategory){
            return res.status(200).json({success:true, message:"Get Inspired Category By Id Successfully", inspiredcategory})
        }else{
            return res.status(404).json({success:false, message:"Inspired Category Not Found"})
        }
    } catch{
        return res.status(500).json({success:false, message:"Internal Server Error"})
    }
} 

module.exports.addInspiredCategory = async function (req, res) {
    try {
        const inspiredCategory = new InspiredCategory({
            cat_inspired_name: req.body.cat_inspired_name,
        });

        await inspiredCategory.save();

        return res.status(201).json({
            success: true,
            message: "Inspired Category added successfully",
            inspiredCategory,
        });
    } catch (error) {
        console.error("Error saving Inspired Category:", error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: error.message,
        });
    }
};

module.exports.editInspiredCategory = async function (req, res) {
    try {
        const inspiredCategory = await InspiredCategory.findByIdAndUpdate(
            req.params.id,
            {
                cat_inspired_name: req.body.cat_inspired_name,
            },
            { new: true, runValidators: true }
        );

        if (!inspiredCategory) {
            return res.status(404).json({
                success: false,
                message: "Inspired Category not found",
            });
        }

        return res.status(200).json({
            success: true,
            message: "Inspired Category updated successfully",
            inspiredCategory,
        });
    } catch (error) {
        console.error("Error updating Inspired Category:", error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: error.message,
        });
    }
};

module.exports.deleteInspiredCategory = async function(req, res){
    try{
        const inspiredcategory = await InspiredCategory.findByIdAndDelete(req.params.id);
        if(inspiredcategory){
            return res.status(200).json({success:true, message:"Inspired Category Deleted Successfully", inspiredcategory})
        }else{
            return res.status(404).json({success:false, message:"Inspired Category Can not deleted"})
        }
    }catch{
        return res.status(500).json({success:false, message:"Inspired Category Deleted Successfully"})
    }
}


module.exports.countInspiredCategory = async function (req, res) {
    try{
      const inspiredcategoryCount = await InspiredCategory.countDocuments();
      if (inspiredcategoryCount) {
        return res.status(200).json({ success: true, success: true,inspiredcategoryCount: inspiredcategoryCount });
      } else {
        return res.status(404).json({ success: false, message: "User Cannot be Count" });
      }
    } catch (err) {
      return res.status(500).json({ success: false, message: "Internal Server Error", error: err.message });
    }
}