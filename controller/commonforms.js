const { default: mongoose } = require('mongoose');
const CommonForm = require('../model/commonform');
const City    = require('../model/city');
const Store = require('../model/store')
 
module.exports.getCommonForm = async function(req, res){
    try{
        const commonForm = await CommonForm.find().sort().populate('city').populate('store');
        return res.status(200).json({success:true,commonForm});
    } catch {
        return res.status(500).json({success:false, message:"Internal Server Error"})
    }
}

module.exports.getCommonFormById = async function(req, res){
    try{
        const commonForm = await CommonForm.findById(req.params.id).populate('city').populate('store');
        if(!commonForm){
            return res.status(404).json({success:false,message:"Form Can not found!"})
        }
        return res.status(200).json({success:true,commonForm});  
    } catch {
        return res.status(500).json({success:false, message:"Internal Server Error"})
    }
}

module.exports.addCommonForm = async function (req, res) {
    try {
        const { fname, lname, email, phone, city, store, npuser, message } = req.body;

        if (!mongoose.Types.ObjectId.isValid(city)) {
            return res.status(400).json({ success: false, message: "Invalid City ID" });
        }

        const cityCheck = await City.findById(city);
        if (!cityCheck) {
            return res.status(404).json({ success: false, message: "City Not Found" });
        }

        if (!mongoose.Types.ObjectId.isValid(store)) {
            return res.status(400).json({ success: false, message: "Invalid Store ID" });
        }

        const storeCheck = await Store.findById(store);
        if (!storeCheck) {
            return res.status(404).json({ success: false, message: "Store Not Found" });
        }

        const commonForm = new CommonForm({
            fname,
            lname,
            email,
            phone,
            city: cityCheck._id,
            store: storeCheck._id,
            npuser,
            message,
        });

        await commonForm.save();
        return res.status(201).json({ success: true, message: "Form Submited Successfully ", commonForm });
    } catch (err) {
        return res.status(500).json({ success: false, message: "Internal Server Error", error: err.message });
    }
};

/*
{
    "fname":"Sia",
    "lname":"Ram",
    "email":"ram@gmail.com",
    "phone":"9555400872",
    "city":"66a34ceeb9f8c28a38e6e2cd",
    "store":"66a352a876fd5ac45c6823af",
    "npuser":"Products",
    "message":"Describe your request",
}
*/
