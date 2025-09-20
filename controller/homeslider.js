const HomeSlider = require('../model/homeslider');

module.exports.getHomeSlider = async function(req, res){
    try{
        const homeslider = await HomeSlider.find().sort();
        if(homeslider){
            return res.status(200).json({success:true, message:"Get All Home Slider Successfully", homeslider});
        }else{
            return res.status(404).json({success:false, message:"Home Slider Not found"});
        }
    }catch{
        return res.status(500).json({success:false, message:"Internal Server Error"});
    }
}

module.exports.getHomeSliderById = async function(req, res){
    try{
        const homeslider = await HomeSlider.findById(req.params.id);
        if(homeslider){
            return res.status(200).json({success:true, message:"Get Home slider By Id Successfully", homeslider})
        }else{
            return res.status(404).json({success:false, message:"Home slider Not Found"})
        }
    } catch{
        return res.status(500).json({success:false, message:"Internal Server Error"})
    }
} 

module.exports.addHomeSlider = async function (req, res) {
  try {
    const sliderImg = req.files?.slider_img?.[0];

    if (!sliderImg) {
      return res.status(400).json({ message: "Attached Slider Image is required!" });
    }

    const homeslider = new HomeSlider({
      left_text: req.body.left_text,
      right_text: req.body.right_text,
      slider_img: sliderImg.filename || sliderImg.path, // ✅ store only filename/path
      slider_link: req.body.slider_link,
      color_code: req.body.color_code,
      color_name: req.body.color_name,
    });

    await homeslider.save();
    return res
      .status(200)
      .json({ success: true, message: "Home Slider added successfully" });
  } catch (error) {
    console.error("Error saving Home Slider:", error.message);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};

module.exports.editHomeSlider = async function (req, res) {
  try {
    const sliderImg = req.files?.slider_img?.[0];

    // Prepare update data
    const updateData = {
      left_text: req.body.left_text,
      right_text: req.body.right_text,
      slider_link: req.body.slider_link,
      color_code: req.body.color_code,
      color_name: req.body.color_name,
    };

    // Only update image if a new one is uploaded
    if (sliderImg) {
      updateData.slider_img = sliderImg.filename || sliderImg.path;
    }

    const updateHomeSlider = await HomeSlider.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    if (!updateHomeSlider) {
      return res.status(404).json({ success: false, message: "Home Slider not found" });
    }

    return res.status(200).json({
      success: true,
      message: "Home Slider updated successfully",
      data: updateHomeSlider,
    });
  } catch (error) {
    console.error("Error updating Home Slider:", error.message);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};

module.exports.deleteHomeSlider = async function(req, res){
    try{
        const homeslider = await HomeSlider.findByIdAndDelete(req.params.id);
        if(homeslider){
            return res.status(200).json({success:true, message:"Home Slider Deleted Successfully", homeslider})
        }else{
            return res.status(404).json({success:false, message:"Home Slider Can not deleted"})
        }
    }catch{
        return res.status(500).json({success:false, message:"Home Slider Deleted Successfully"})
    }
}


module.exports.countHomeSlider = async function (req, res) {
    try{
      const homesliderCount = await HomeSlider.countDocuments();
      if (homesliderCount) {
        return res.status(200).json({ success: true, success: true,homesliderCount: homesliderCount });
      } else {
        return res.status(404).json({ success: false, message: "User Cannot be Count" });
      }
    } catch (err) {
      return res.status(500).json({ success: false, message: "Internal Server Error", error: err.message });
    }
}