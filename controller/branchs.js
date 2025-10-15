const Branch = require('../model/branch');

// ✅ Get all branches
module.exports.getBranch = async function (req, res) {
  try {
    const branch = await Branch.find().sort({ dateCreated: -1 });
    if (branch.length > 0) {
      return res
        .status(200)
        .json({ success: true, message: "Get all branches successfully", branch });
    } else {
      return res.status(404).json({ success: false, message: "No branches found" });
    }
  } catch (err) {
    console.error("Error fetching branches:", err.message);
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

// ✅ Get branch by ID
module.exports.getBranchById = async function (req, res) {
  try {
    const branch = await Branch.findById(req.params.id);
    if (branch) {
      return res
        .status(200)
        .json({ success: true, message: "Get branch by ID successfully", branch });
    } else {
      return res.status(404).json({ success: false, message: "Branch not found" });
    }
  } catch (err) {
    console.error("Error fetching branch by ID:", err.message);
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

// ✅ Add new branch
module.exports.addBranch = async function (req, res) {
  try {
    const branchImg = req.files?.branch_img?.[0]; // ✅ match field name
   console.log("BODY:", req.body);
    console.log("FILES:", req.files);
    if (!branchImg) {
      return res.status(400).json({ message: "Branch image is required!" });
    }

    const branch = new Branch({
      branch_name: req.body.branch_name,
      branch_all_add: req.body.branch_all_add,
      branch_map: req.body.branch_map, 
      branch_img: branchImg.filename || branchImg.path, // ✅ save correct image
      meta_title: req.body.meta_title,
      meta_desc: req.body.meta_desc,
      slug_url: req.body.slug_url,
    });

    await branch.save();
    return res
      .status(200)
      .json({ success: true, message: "Branch added successfully", data: branch });
  } catch (error) {
    console.error("Error saving Branch:", error.message);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};


// ✅ Edit branch
module.exports.editBranch = async function (req, res) {
  try {
    const branchImg = req.files?.branch_img?.[0];

    const updateData = {
      branch_name: req.body.branch_name,
      branch_map: req.body.branch_map, // ✅ update Google Map URL
      branch_all_add: req.body.branch_all_add,
      meta_title: req.body.meta_title,
      meta_desc: req.body.meta_desc,
      slug_url: req.body.slug_url,
    };

    if (branchImg) {
      updateData.branch_img = branchImg.filename || branchImg.path;
    }

    const updateBranch = await Branch.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    if (!updateBranch) {
      return res.status(404).json({ success: false, message: "Branch not found" });
    }

    return res.status(200).json({
      success: true,
      message: "Branch updated successfully",
      data: updateBranch,
    });
  } catch (error) {
    console.error("Error updating branch:", error.message);
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

// ✅ Delete branch
module.exports.deleteBranch = async function (req, res) {
  try {
    const branch = await Branch.findByIdAndDelete(req.params.id);
    if (branch) {
      return res.status(200).json({ success: true, message: "Branch deleted successfully" });
    } else {
      return res.status(404).json({ success: false, message: "Branch not found" });
    }
  } catch (err) {
    console.error("Error deleting branch:", err.message);
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

// ✅ Count branches
module.exports.countBranch = async function (req, res) {
  try {
    const branchCount = await Branch.countDocuments();
    return res.status(200).json({ success: true, branchCount });
  } catch (err) {
    console.error("Error counting branches:", err.message);
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

//https://nexonpaintapi.onrender.com/api/v1/branchs/slug/uttar-pradesh-radha
module.exports.getBranchBySlug = async function (req, res) {
  try {
    const { slug } = req.params; // read from URL
    if (!slug) {
      return res.status(400).json({ success: false, message: 'Missing slug' });
    }

    let doc = await Branch.findOne({ slug_url: slug }).lean();

    if (!doc) {
      doc = await Branch.findOne({ }).lean().then((b) => null);
    }

    if (!doc) {
      return res
        .status(404)
        .json({ success: false, message: 'Branch not found' });
    }

    return res.status(200).json({
      success: true,
      message: 'Branch fetched successfully',
      data: doc,
    });
  } catch (err) {
    console.error('Error Slug Based Branch:', err);
    return res
      .status(500)
      .json({ success: false, message: 'Internal Server Error' });
  }
};
