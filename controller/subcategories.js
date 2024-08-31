const mongoose = require('mongoose');
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

module.exports.getSubcategoryByCategory = async (req, res) => {
    try {
      const { categoryId } = req.params;
      console.log('Category ID:', categoryId); // Log category ID
      const subcategories = await Subcategory.find({ category: categoryId });
      console.log('Found subcategories:', subcategories); // Log found subcategories
      
      if (!subcategories || subcategories.length === 0) {
        return res.status(404).json({ success: false, message: 'Subcategory Not found' });
      }
      
      return res.status(200).json({ success: true, subcategories });
    } catch (error) {
      console.error('Error fetching subcategories:', error);
      return res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
};

module.exports.addSubcategory = async function(req, res){
    console.log("Check Cat",req.body);
    try{
        const {category, subcat_name, subcat_url, meta_title, meta_desc} = req.body
        if (!mongoose.Types.ObjectId.isValid(category)) {
            return res.status(400).json({ success: false, message: 'Invalid Category ID' });
        }

        const cat = await Category.findById(category);
        if (!cat) {
            return res.status(404).json({ success: false, message: 'Subcategory Not Found' });
        }  
        const subcat = new Subcategory({ 
            category:cat._id,
            subcat_name,
            subcat_url,
            meta_title,
            meta_desc,
        });
        await subcat.save();
        return res.status(200).json({success:true, message:"Get All Subcategory", subcat})
    }catch{
        return res.status(500).json({success:false, message:"Internal Srever Error"})
    }
}

module.exports.editSubcategory = async function(req, res) {
    try {
        const { category, subcat_name, subcat_url, meta_title, meta_desc } = req.body;

        // Validate category ID
        if (!mongoose.Types.ObjectId.isValid(category)) {
            return res.status(400).json({ success: false, message: 'Invalid Category ID' });
        }

        const cat = await Category.findById(category);
        if (!cat) {
            return res.status(404).json({ success: false, message: 'Subcategory Not Found' });
        }

        const subcat = await Subcategory.findByIdAndUpdate(
            req.params.id,
            {
                subcat_name,
                subcat_url,
                meta_title,
                meta_desc,
                category: cat._id
            },
            { new: true }
        );

        if (subcat) {
            return res.status(200).json({ success: true, message: 'Subcategory Updated Successfully', subcat });
        } else {
            return res.status(404).json({ success: false, message: 'Subcategory Not Updated' });
        }
    } catch (error) {
        console.error('Error:', error);
        return res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
}

module.exports.deleteSubcategory = async function(req, res){
    try{
        const subcat = await Subcategory.findByIdAndDelete(req.params.id);
        if(subcat){
            return res.status(200).json({success:true, message:"Subcategory Deleted Successfully", subcat})
        }else{
            return res.status(404).json({success:false, message:"Subcategory Not found"})
        }
    }catch{
        return res.status(500).json({success:false, message:"Internal Srever Error"})
    }
}


module.exports.countSubcategory = async function (req, res) {
    try{
      const subcategoryCount = await Subcategory.countDocuments();
      if (subcategoryCount) {
        return res.status(200).json({ success: true, success: true,subcategoryCount: subcategoryCount });
      } else {
        return res.status(404).json({ success: false, message: "User Cannot be Count" });
      }
    } catch (err) {
      return res.status(500).json({ success: false, message: "Internal Server Error", error: err.message });
    }
}