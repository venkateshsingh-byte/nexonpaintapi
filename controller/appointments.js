const { default: mongoose } = require('mongoose');
const Appointment = require('../model/appointment');
const City    = require('../model/city');
const Store = require('../model/store')
 
module.exports.getAppointment = async function(req, res){
    try{
        const appointments = await Appointment.find().populate('city').populate('store').sort();
        if(!appointments){
            return res.status(404).json({success:false,message:"Appointment can not found"})
        }
        return res.status(200).json({success:true,appointments});
    } catch {
        return res.status(500).json({success:false, message:"Internal Server Error"})
    }
}

module.exports.getAppointmentById = async function(req, res){
    try{
        const appointment = await Appointment.findById(req.params.id)
            .populate('city')
            .populate('store');
            
        if (!appointment) {
            return res.status(404).json({ success: false, message: "Appointment not found" });
        }
        
        return res.status(200).json({ success: true, appointment });
    } catch (err) {
        return res.status(500).json({ success: false, message: "Internal Server Error", error: err.message });
    }
}; 

module.exports.addAppointment = async function (req, res) {
    try {
        const { toa, fname, lname, email, phone, city, store, ap_date, ap_time, i_am } = req.body;

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

        const appointment = new Appointment({
            toa,
            fname,
            lname,
            email,
            phone,
            city: cityCheck._id,
            store: storeCheck._id,
            ap_date,
            ap_time,
            i_am
        });

        await appointment.save();
        return res.status(201).json({ success: true, message: "Appointment Form Successfully Submit", appointment });
    } catch (err) {
        return res.status(500).json({ success: false, message: "Internal Server Error", error: err.message });
    }
};

/*
{
    "toa":"Store visit",
    "fname":"Sia",
    "lname":"Ram",
    "email":"ram@gmail.com",
    "phone":"9555400872",
    "city":"66a34ceeb9f8c28a38e6e2cd",
    "store":"66a352a876fd5ac45c6823af",
    "ap_date":"12/01/2022",
    "ap_time":"10:20",
    "i_am":"Owner"
}
*/
