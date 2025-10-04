const Product = require('../model/product');
const Category = require('../model/category');
const Subcategory = require('../model/subcategory');
const TypeOfProduct = require('../model/typeofproduct');
const ColorBuckets = require('../model/colorproductbucket')
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
    let {
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

    // Basic required checks
    product_name = (product_name || "").trim();
    if (!product_name) {
      return res.status(400).json({ success: false, message: "product_name is required" });
    }
    slug = (slug || "").trim() || product_name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
    if (!slug) {
      return res.status(400).json({ success: false, message: "slug is required or could not be derived" });
    }

    // Unique slug guard (and add a unique index on Product schema for 'slug')
    const existing = await Product.findOne({ slug }).select("_id");
    if (existing) {
      return res.status(409).json({ success: false, message: "Slug already exists" });
    }

    // Validate relations
    let cat = null, subcat = null, top = null;

    if (category) {
      if (!mongoose.Types.ObjectId.isValid(category)) {
        return res.status(400).json({ success: false, message: "Invalid Category ID" });
      }
      cat = await Category.findById(category);
      if (!cat) return res.status(404).json({ success: false, message: "Category not found" });
    }

    if (subcategory) {
      if (!mongoose.Types.ObjectId.isValid(subcategory)) {
        return res.status(400).json({ success: false, message: "Invalid Subcategory ID" });
      }
      subcat = await Subcategory.findById(subcategory);
      if (!subcat) return res.status(404).json({ success: false, message: "Subcategory not found" });
    }

    if (typeofproduct) {
      if (!mongoose.Types.ObjectId.isValid(typeofproduct)) {
        return res.status(400).json({ success: false, message: "Invalid TypeOfProduct ID" });
      }
      top = await TypeOfProduct.findById(typeofproduct);
      if (!top) return res.status(404).json({ success: false, message: "TypeOfProduct not found" });
    }

    // Files from multer
    const technical_PDF                = req.files?.technical_datasheet?.[0];
    const warranty_PDF                 = req.files?.warranty_document?.[0];
    const green_PDF                    = req.files?.green_pro_certificate?.[0];
    const product_single_image_banner  = req.files?.product_single_image_banner?.[0];
    const product_single_image_banner_small = req.files?.product_single_image_banner_small?.[0];
    const product_home_banner_img      = req.files?.product_home_banner_img?.[0];

    // Create document
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
      product_single_image_banner: product_single_image_banner ? product_single_image_banner.filename : null,
      product_single_image_banner_small: product_single_image_banner_small ? product_single_image_banner_small.filename : null,
      product_home_banner_img: product_home_banner_img ? product_home_banner_img.filename : null,
      category: cat?._id || null,
      subcategory: subcat?._id || null,
      typeofproduct: top?._id || null,
      slug
    });

    const savedProduct = await product.save();

    // 201 Created, return full doc (or keep your minimal response if you prefer)
    return res.status(201).json({
      success: true,
      message: "Product created successfully",
      product: savedProduct
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
      slug, // optional; if provided we’ll normalize & check uniqueness
      // optional explicit remove flags from the form (checkboxes)
      remove_technical_datasheet,
      remove_warranty_document,
      remove_green_pro_certificate,
      remove_product_single_image_banner,
      remove_product_single_image_banner_small,
      remove_product_home_banner_img
    } = req.body;

    // --- Validate relations (optional) ---
    let cat = null, subcat = null, top = null;

    if (category) {
      if (!mongoose.Types.ObjectId.isValid(category)) {
        return res.status(400).json({ success: false, message: "Invalid Category ID" });
      }
      cat = await Category.findById(category);
      if (!cat) return res.status(404).json({ success: false, message: "Category not found" });
    }

    if (subcategory) {
      if (!mongoose.Types.ObjectId.isValid(subcategory)) {
        return res.status(400).json({ success: false, message: "Invalid Subcategory ID" });
      }
      subcat = await Subcategory.findById(subcategory);
      if (!subcat) return res.status(404).json({ success: false, message: "Subcategory not found" });
    }

    if (typeofproduct) {
      if (!mongoose.Types.ObjectId.isValid(typeofproduct)) {
        return res.status(400).json({ success: false, message: "Invalid TypeOfProduct ID" });
      }
      top = await TypeOfProduct.findById(typeofproduct);
      if (!top) return res.status(404).json({ success: false, message: "TypeOfProduct not found" });
    }

    // --- Uploaded files (multer fields) ---
    const technical_PDF        = req.files?.technical_datasheet?.[0];
    const warranty_PDF         = req.files?.warranty_document?.[0];
    const green_PDF            = req.files?.green_pro_certificate?.[0];
    const product_banner       = req.files?.product_single_image_banner?.[0];
    const product_banner_small = req.files?.product_single_image_banner_small?.[0];
    const home_banner          = req.files?.product_home_banner_img?.[0];

    // --- Build $set incrementally; do not null-out existing unless remove flag is true ---
    const $set = {};

    if (typeof product_name !== "undefined")        $set.product_name = product_name;
    if (typeof product_subname !== "undefined")     $set.product_subname = product_subname;
    if (typeof product_desc !== "undefined")        $set.product_desc = product_desc;
    if (typeof benefit !== "undefined")             $set.benefit = benefit;
    if (typeof application_process !== "undefined") $set.application_process = application_process;
    if (typeof meta_title !== "undefined")          $set.meta_title = meta_title;
    if (typeof meta_desc !== "undefined")           $set.meta_desc = meta_desc;

    // relations (nullable)
    if (category)     $set.category = cat?._id || null;
    if (subcategory)  $set.subcategory = subcat?._id || null;
    if (typeofproduct)$set.typeofproduct = top?._id || null;

    // slug: normalize + uniqueness check (only if provided/changed)
    if (typeof slug !== "undefined" && slug !== null) {
      const normalized = String(slug).trim().toLowerCase();
      // ensure uniqueness against other docs
      const exists = await Product.findOne({ _id: { $ne: req.params.id }, slug: normalized }).lean();
      if (exists) {
        return res.status(409).json({ success: false, message: "Slug already in use" });
      }
      $set.slug = normalized;
    }

    // files: set new filename if uploaded; clear only when remove flag is truthy
    if (technical_PDF)        $set.technical_datasheet = technical_PDF.filename;
    else if (String(remove_technical_datasheet || "") === "true") $set.technical_datasheet = null;

    if (warranty_PDF)         $set.warranty_document = warranty_PDF.filename;
    else if (String(remove_warranty_document || "") === "true")   $set.warranty_document = null;

    if (green_PDF)            $set.green_pro_certificate = green_PDF.filename;
    else if (String(remove_green_pro_certificate || "") === "true") $set.green_pro_certificate = null;

    if (product_banner)       $set.product_single_image_banner = product_banner.filename;
    else if (String(remove_product_single_image_banner || "") === "true") $set.product_single_image_banner = null;

    if (product_banner_small) $set.product_single_image_banner_small = product_banner_small.filename;
    else if (String(remove_product_single_image_banner_small || "") === "true") $set.product_single_image_banner_small = null;

    if (home_banner)          $set.product_home_banner_img = home_banner.filename;
    else if (String(remove_product_home_banner_img || "") === "true") $set.product_home_banner_img = null;

    // --- Perform update with validators (matches schema constraints like required/unique) ---
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { $set },
      { new: true, runValidators: true, context: "query" }
    );

    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    return res.status(200).json({ success: true, message: "Product updated successfully", product });

  } catch (error) {
    // Handle duplicate key (e.g., slug unique) nicely
    if (error?.code === 11000 && error?.keyPattern?.slug) {
      return res.status(409).json({ success: false, message: "Slug already in use" });
    }
    console.error("Error:", error);
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

//Get Product By Slug 
module.exports.getProductBySlug = async function (req, res, next) {
  try {
    const { slug } = req.params;

    // Find product by slug
    const product = await Product.findOne({ slug }).lean();
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    // Find the first document where a bucket references this product._id
    const doc = await ColorBuckets.findOne(
      { "buckets.product": product._id },   // <-- correct path
      { "buckets.$": 1 }                    // <-- only return the matched bucket
    ).lean();

    const bucket = doc?.buckets?.[0];

    return res.json({
      success: true,
      data: {
        ...product,
        product_img: bucket?.product_img ?? null,
        product_small_img: bucket?.product_small_img ?? null,
      }
    });
  } catch (err) {
    next(err);
  }
};




