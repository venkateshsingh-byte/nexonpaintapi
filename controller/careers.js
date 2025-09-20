const Career = require('../model/career');
 
module.exports.getCareer = async function(req, res){
    try{
        const career = await Career.find().sort();
        return res.status(200).json({success:true,career});
    } catch {
        return res.status(500).json({success:false, message:"Internal Server Error"})
    }
}

module.exports.getCareerById = async function(req, res){
    try{
        const careerId = req.params.id
        const career = await Career.findById(careerId).sort();
        return res.status(200).json({success:true,career});
    } catch {
        return res.status(500).json({success:false, message:"Internal Server Error"})
    }
}

module.exports.addCareer = async function (req, res) {
  try {
    const { name, phone, email } = req.body;

    ///console.log("Check Data", req.body);

    // Check for uploaded CV
    const cvFile = req.files?.upload_cv?.[0];
    //console.log("Check Data", cvFile);
    if (!cvFile) {
      return res.status(400).json({ message: 'Upload CV is required' });
    }

    const career = new Career({
      name,
      phone,
      email,
      upload_cv: cvFile.filename
    });

    await career.save();

    return res.status(201).json({
      success: true,
      message: "Career form submitted successfully",
      career,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: err.message,
    });
  }
};

/*
{
    "name":"Sia",
    "phone":"9555400872",
    "email":"ram@gmail.com",
    "upload_cv":"File_Name",
}
*/
