const Product = require('../model/product');
const Category = require('../model/category');
const Subcategory = require('../model/subcategory');
const TypeOfProduct = require('../model/typeofproduct')
const mongoose = require('mongoose');

module.exports.getProduct = async function(req, res) {
  try {
   
    const products = await Product.find()
      .populate('category')        // populate category name
      .populate('subcategory') // populate subcategory name
      .populate('typeofproduct');     // populate type name

    res.status(200).json({
      success: true,
      message: "Product Data fetched successfully",
      products
    });

  } catch (error) {
    console.error('Error fetching products:', error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message
    });
  }
};


module.exports.getByProductID = async function(req, res) {
    try {
        const product = await Product.findById(req.params.id).populate('category').populate('subcategory').populate('typeofproduct');
        if (product) {
            return res.status(200).json({ success: true, message: "Product fetched by ID Successfully", product });
        } else {
            return res.status(404).json({ success: false, message: "Product not found" });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
}


module.exports.addProduct = async function (req, res) {
  try {
    const {
      product_name,
      product_subname,
      product_desc,
      benefit,
      application_process,
      meta_title,
      meta_desc,
      category,
      subcategory,
      typeofproduct,
      slug
    } = req.body;


    // Validate relations (optional)
    let cat = null, subcat = null, top = null;

    if (category) {
      if (!mongoose.Types.ObjectId.isValid(category)) 
        return res.status(400).json({ success: false, message: "Invalid Category ID" });
      cat = await Category.findById(category);
      if (!cat) return res.status(404).json({ success: false, message: "Category not found" });
    }

    if (subcategory) {
      if (!mongoose.Types.ObjectId.isValid(subcategory)) 
        return res.status(400).json({ success: false, message: "Invalid Subcategory ID" });
      subcat = await Subcategory.findById(subcategory);
      if (!subcat) return res.status(404).json({ success: false, message: "Subcategory not found" });
    }

    if (typeofproduct) {
      if (!mongoose.Types.ObjectId.isValid(typeofproduct)) 
        return res.status(400).json({ success: false, message: "Invalid TypeOfProduct ID" });
      top = await TypeOfProduct.findById(typeofproduct);
      if (!top) return res.status(404).json({ success: false, message: "TypeOfProduct not found" });
    }

    // File uploads
    const technical_PDF = req.files?.technical_datasheet?.[0];  
    const warranty_PDF  = req.files?.warranty_document?.[0];  
    const green_PDF     = req.files?.green_pro_certificate?.[0]; 

    // Create single product
    const product = new Product({
      product_name,
      product_subname,
      product_desc,
      benefit,
      application_process,
      meta_title,
      meta_desc,
      technical_datasheet: technical_PDF ? technical_PDF.filename : null,
      warranty_document:  warranty_PDF ? warranty_PDF.filename : null,
      green_pro_certificate: green_PDF ? green_PDF.filename : null,
      category: cat?._id || null,
      subcategory: subcat?._id || null,
      typeofproduct: top?._id || null,
      slug
    });

    const savedProduct = await product.save();

    return res.status(200).json({
      success: true,
      message: "Product submitted successfully",
      product: {
        _id: savedProduct._id,
        dateCreated: savedProduct.dateCreated,
        __v: savedProduct.__v,
        id: savedProduct.id
      }   
    });

  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({ success: false, message: "Internal Server Error", error: error.message });
  }
};




module.exports.editProduct = async function (req, res) {
  try {
    const {
      product_name,
      product_subname,
      product_desc,
      benefit,
      application_process,
      meta_title,
      meta_desc,
      category,
      subcategory,
      typeofproduct,
      slug
    } = req.body;

    // Validate relations (optional)
    let cat = null, subcat = null, top = null;

    if (category) {
      if (!mongoose.Types.ObjectId.isValid(category)) 
        return res.status(400).json({ success: false, message: "Invalid Category ID" });
      cat = await Category.findById(category);
      if (!cat) return res.status(404).json({ success: false, message: "Category not found" });
    }

    if (subcategory) {
      if (!mongoose.Types.ObjectId.isValid(subcategory)) 
        return res.status(400).json({ success: false, message: "Invalid Subcategory ID" });
      subcat = await Subcategory.findById(subcategory);
      if (!subcat) return res.status(404).json({ success: false, message: "Subcategory not found" });
    }

    if (typeofproduct) {
      if (!mongoose.Types.ObjectId.isValid(typeofproduct)) 
        return res.status(400).json({ success: false, message: "Invalid TypeOfProduct ID" });
      top = await TypeOfProduct.findById(typeofproduct);
      if (!top) return res.status(404).json({ success: false, message: "TypeOfProduct not found" });
    }

    // File uploads
    const technical_PDF = req.files?.technical_datasheet?.[0];  
    const warranty_PDF  = req.files?.warranty_document?.[0];  
    const green_PDF     = req.files?.green_pro_certificate?.[0]; 

    // Prepare update object
    const updateData = {
      product_name,
      product_subname,
      product_desc,
      benefit,
      application_process,
      meta_title,
      meta_desc,
      technical_datasheet: technical_PDF ? technical_PDF.filename : undefined,
      warranty_document:  warranty_PDF ? warranty_PDF.filename : undefined,
      green_pro_certificate: green_PDF ? green_PDF.filename : undefined,
      category: cat?._id || null,
      subcategory: subcat?._id || null,
      typeofproduct: top?._id || null,
      slug
    };

    // Update product
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    return res.status(200).json({ success: true, message: "Product updated successfully", product });

  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({ success: false, message: "Internal Server Error", error: error.message });
  }
};




module.exports.deleteProduct = async function(req,res){
    try{
        const product = await Product.findByIdAndDelete(req.params.id);
        if(product){
            return res.status(200).json({success:true,message:"Product Deleted Successfully"})
        } else{
            return res.status(404).json({success:false, message:"Product not found"})
        }
    } catch {
        return res.status(500).json({success:false,message:"Internal Server Error"})
    }
}

module.exports.countProduct = async function (req, res) {
    try{
      const productCount = await Product.countDocuments();
      if (productCount) {
        return res.status(200).json({ success: true, success: true,productCount: productCount });
      } else {
        return res.status(404).json({ success: false, message: "User Cannot be Count" });
      }
    } catch (err) {
      return res.status(500).json({ success: false, message: "Internal Server Error", error: err.message });
    }
}
/*
module.exports.routingcategory = async function (req, res) {   
    try {
        const { category } = req.params;

        // Log the category parameter to verify it
        console.log('Category Parameter:', req.params);

        // Find the category in the database using the cat_url
        const categoryObj = await Category.findOne({ cat_url: category });

        // Log the result of the category query
        console.log('Category Object:', categoryObj);

        if (!categoryObj) {
            return res.status(404).json({ success: false, message: "Category not found" });
        }

        // Construct the query using the category ID
        const query = { category: categoryObj._id };

        // Find products based on the constructed query
        const products = await Product.find(query).populate('category');

        // Log the result of the products query
        console.log('Products:', products);

        if (!products.length) {
            return res.status(404).json({ success: false, message: "No products found" });
        }

        res.status(200).json({ success: true, message: "Product Category Data fetched Successfully!", products });
    } catch (error) {
        console.error('Error fetching products:', error);
        if (error.name === 'CastError') {
            return res.status(400).json({ success: false, message: "Invalid ID format in query" });
        }
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};*/


module.exports.routingsubcategory = async function (req, res) { 
    try {
        const { category, subcategory } = req.params;
        
        const query = {};

    
        if (category) {
            const categoryObj = await Category.findOne({ cat_url: category });
            if (!categoryObj) {
                return res.status(404).json({ success: false, message: "Category not found" });
            }
            console.log("Category Object:", categoryObj);
            query.category = categoryObj._id; 
        }

       
        if (subcategory && query.category) {
            const subcategoryObj = await Subcategory.findOne({
                subcat_url: subcategory,
                category: query.category
            });
            if (!subcategoryObj) {
                return res.status(404).json({ success: false, message: "Subcategory not found" });
            }
            console.log("SubCategory Object:", subcategoryObj);
            query.subcategory = subcategoryObj._id; 
        }

       
        console.log("Final Query Object:", query);

      
        const products = await Product.find(query).populate('category subcategory');
        if (!products.length) {
            return res.status(404).json({ success: false, message: "No products found" });
        }

        res.status(200).json({ success: true, message: "Product SubCategory Data fetched Successfully!", products });   
    } catch (error) {
        console.error('Error fetching products:', error);
        if (error.name === 'CastError') {
            return res.status(400).json({ success: false, message: "Invalid ID format in query" });
        }
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};


