const Inspired = require('../model/inspired');
const InspiredCategory = require('../model/inspiredcategory');

module.exports.getInspired = async function(req, res){
    try{
        const inspired = await Inspired.find().sort().populate('inspiredcategory');
        if(inspired){
            return res.status(200).json({success:true, message:"Get All Inspired  Successfully", inspired});
        }else{
            return res.status(404).json({success:false, message:"Inspired Not found"});
        }
    }catch{
        return res.status(500).json({success:false, message:"Internal Server Error"});
    }
}

module.exports.getInspiredById = async function(req, res){
    try{
        const inspired = await Inspired.findById(req.params.id).populate('inspiredcategory');
        if(inspired){
            return res.status(200).json({success:true, message:"Get Inspired By Id Successfully", inspired})
        }else{
            return res.status(404).json({success:false, message:"Inspired Not Found"})
        }
    } catch{
        return res.status(500).json({success:false, message:"Internal Server Error"})
    }
} 

module.exports.addInspired = async function (req, res) {
    try {
        const inspiredfullImg = req.files?.inspired_full_img?.[0];
        if (!inspiredfullImg) {
            return res.status(400).json({ message: "Inspired Full Image is required!" });
        }

        const inspiredsmallImg = req.files?.inspired_small_img?.[0];
        if (!inspiredsmallImg) {
            return res.status(400).json({ message: "Inspired Small Image is required!" });
        }

        const inspiredCat = await InspiredCategory.findById(req.body.inspiredcategory);
        if (!inspiredCat) {
            return res.status(404).json({ success: false, message: "Inspired Category not found" });
        }

        const inspired = new Inspired({
            inspired_name: req.body.inspired_name,
            inspired_full_img: inspiredfullImg.filename || inspiredfullImg.path, 
            inspired_small_img: inspiredsmallImg.filename || inspiredsmallImg.path,
            inspiredcategory: inspiredCat._id,
        });

        await inspired.save();

        return res.status(201).json({
            success: true,
            message: "Inspired added successfully",
            inspired,
        });
    } catch (error) {
        console.error("Error saving Inspired:", error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: error.message,
        });
    }
};


module.exports.editInspired = async function (req, res) {
  try {
    const inspiredfullImg = req.files?.inspired_full_img?.[0];
    const inspiredsmallImg = req.files?.inspired_small_img?.[0];
    const { inspired_name, inspiredcategory } = req.body;

    // Validate category
    const inspiredCat = await InspiredCategory.findById(inspiredcategory);
    if (!inspiredCat) {
      return res
        .status(404)
        .json({ success: false, message: "Inspired Category not found" });
    }

    // Build update data
    const updateData = {
      inspired_name,
      inspiredcategory: inspiredCat._id,
    };

    if (inspiredfullImg) {
      updateData.inspired_full_img =
        inspiredfullImg.filename || inspiredfullImg.path;
    }

    if (inspiredsmallImg) {
      updateData.inspired_small_img =
        inspiredsmallImg.filename || inspiredsmallImg.path;
    }

    // Update inspired item
    const updateInspired = await Inspired.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    if (!updateInspired) {
      return res
        .status(404)
        .json({ success: false, message: "Inspired not found" });
    }

    return res.status(200).json({
      success: true,
      message: "Inspired updated successfully",
      data: updateInspired,
    });
  } catch (error) {
    console.error("Error updating Inspired:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};


module.exports.deleteInspired = async function(req, res){
    try{
        const inspired = await Inspired.findByIdAndDelete(req.params.id);
        if(inspired){
            return res.status(200).json({success:true, message:"Inspired Deleted Successfully", inspired})
        }else{
            return res.status(404).json({success:false, message:"Inspired Can not deleted"})
        }
    }catch{
        return res.status(500).json({success:false, message:"Inspired Deleted Successfully"})
    }
}


module.exports.countInspired = async function (req, res) {
    try{
      const inspiredCount = await Inspired.countDocuments();
      if (inspiredCount) {
        return res.status(200).json({ success: true, success: true,inspiredCount: inspiredCount });
      } else {
        return res.status(404).json({ success: false, message: "User Cannot be Count" });
      }
    } catch (err) {
      return res.status(500).json({ success: false, message: "Internal Server Error", error: err.message });
    }
}