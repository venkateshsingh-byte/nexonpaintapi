const ejs = require("ejs");
const path = require("path");
const Contact = require('../model/contact');
const transporter = require("../utils/transporter");
 
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
        const Id = req.params.id;
        const contact = await Contact.findById(Id).sort();
        return res.status(200).json({success:true,contact});
    } catch {
        return res.status(500).json({success:false, message:"Internal Server Error"})
    }
}

module.exports.addContact = async function (req, res) {
  try {
    const {
      help_you,
      reaching_out,
      full_name,
      mobile_number,
      active_email,
      your_state,
      your_city,
      surface_painting,
      tell_more,
      agree,
    } = req.body;

    const contact = new Contact({
      help_you,
      reaching_out,
      full_name,
      mobile_number,
      active_email,
      your_state,
      your_city,
      surface_painting,
      tell_more,
      agree,
    });

    await contact.save();

    // ✅ Render email template
    const templatePath = path.join(__dirname, "../templates/EmailContact.ejs");
    const emailHtml = await ejs.renderFile(templatePath, { contact });

    // ✅ Send Email
    await transporter.sendMail({
      from: `"Website Contact" <${process.env.EMAIL_USER}>`,
      to: "venkatesh.singh@plugincomm.com", // admin email
      subject: "New Contact Form Submission",
      html: emailHtml,
    });

    return res.status(201).json({
      success: true,
      message: "Contact Form Submitted Successfully & Email Sent",
      contact,
    });
  } catch (err) {
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error", error: err.message });
  }
};

/*
{
    "name":"Sia",
    "city":"Ram",
    "phone":"9555400872",
    "email":"ram@gmail.com",
    "requirements":"Please describe in detail your request, question or issue with your product",
}
*/
