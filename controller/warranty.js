const Warranty = require('../model/warranty');
const path = require("path");
const ejs = require("ejs");
const transporter = require("../utils/transporter");
 
module.exports.getWarranty = async function(req, res){
    try{
        const warranty = await Warranty.find().sort();
        return res.status(200).json({success:true,warranty});
    } catch {
        return res.status(500).json({success:false, message:"Internal Server Error"})
    }
}

module.exports.getWarrantyById = async function(req, res){
    try{
        const Id = req.params.id;
        const warranty = await Warranty.findById(Id).sort();
        return res.status(200).json({success:true,warranty});
    } catch {
        return res.status(500).json({success:false, message:"Internal Server Error"})
    }
}



module.exports.addWarranty = async function (req, res) {
  try {
    const {
      product_name,
      purchase_date,
      purchase_invoice_no,
      sku_purchased,
      no_bucket,
      quantity_titres,
      mfg_date,
      application_completion_date,
      dealer_name,
      dealer_mobile,
      dealer_address,
      contractor_name,
      contractor_molile,
      full_name,
      mobile_number,
      active_mail,
      site_address,
      your_state,
      your_city,
    } = req.body;

    const cvFile = req.files?.attached_invoices?.[0];
    if (!cvFile) {
      return res.status(400).json({ message: "Attached Invoices is required" });
    }

    const warranty = new Warranty({
      product_name,
      purchase_date,
      purchase_invoice_no,
      sku_purchased,
      no_bucket,
      quantity_titres,
      attached_invoices: cvFile.filename,
      mfg_date,
      application_completion_date,
      dealer_name,
      dealer_mobile,
      dealer_address,
      contractor_name,
      contractor_molile,
      full_name,
      mobile_number,
      active_mail,
      site_address,
      your_state,
      your_city,
    });

    await warranty.save();

    // ✅ Render email template with form data
    const templatePath = path.join(__dirname, "../templates/warrantyEmail.ejs");
    const emailHtml = await ejs.renderFile(templatePath, {
      product_name,
      purchase_date,
      purchase_invoice_no,
      sku_purchased,
      no_bucket,
      quantity_titres,
      mfg_date,
      application_completion_date,
      dealer_name,
      dealer_mobile,
      dealer_address,
      contractor_name,
      contractor_molile,
      full_name,
      mobile_number,
      active_mail,
      site_address,
      your_state,
      your_city,
      attached_invoices: cvFile.filename,
    });

    // ✅ Send email
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: "venkatesh.singh@plugincomm.com",  // replace with your email
      subject: "New Warranty Form Submitted",
      html: emailHtml,
    });

    return res
      .status(201)
      .json({ success: true, message: "Warranty Form Submitted Successfully", warranty });

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
