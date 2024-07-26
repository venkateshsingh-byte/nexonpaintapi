const Contact = require('../model/contact');
 
module.exports.getContact = async function(req, res){
    try{
        const contact = await Contact.find().sort();
        return res.status(200).json({success:true,contact});
    } catch {
        return res.status(500).json({success:false, message:"Internal Server Error"})
    }
}

module.exports.getContactById = async function(req, res){
    try{
        const contact = await Contact.findById().sort();
        return res.status(200).json({success:true,contact});
    } catch {
        return res.status(500).json({success:false, message:"Internal Server Error"})
    }
}

module.exports.addContact = async function (req, res) {
    try {
        const { name, city, phone, email, request } = req.body;

        const contact = new Contact({
            name,
            city,
            phone,
            email,
            request,
        });

        await contact.save();
        return res.status(201).json({ success: true, message: "Contact Form Submited Successfully", contact });
    } catch (err) {
        return res.status(500).json({ success: false, message: "Internal Server Error", error: err.message });
    }
};

/*
{
    "name":"Sia",
    "city":"Ram",
    "phone":"9555400872",
    "email":"ram@gmail.com",
    "request":"Please describe in detail your request, question or issue with your product",
}
*/
