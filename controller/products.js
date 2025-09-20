const Product = require('../model/product');
const Category = require('../model/category');
const Subcategory = require('../model/subcategory');
const TypeOfProduct = require('../model/typeofproduct')
const mongoose = require('mongoose');


module.exports.getProduct = async function(req, res) {
  try {
    let filter = {};

    // Filter by product_name inside details array
    if (req.query.product_name) {
      const productNames = req.query.product_name.split(',').map(name => name.trim());
      filter['details.product_name'] = { $in: productNames };
    }

    const products = await Product.find(filter)
      .populate({
        path: 'details.category',
        model: 'Category', // Ensure Mongoose knows the model
      })
      .populate({
        path: 'details.subcategory',
        model: 'Subcategory',
      })
      .populate({
        path: 'details.typeofproduct',
        model: 'Typeofproduct',
      });

    res.status(200).json({
      success: true,
      message: "Product Data fetched Successfully!",
      products
    });

  } catch (error) {
    console.error("Error fetching products:", error);
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
    console.log('Request Body:', req.body);
    console.log('Request Files:', req.files);

    const {
      product_name,
      product_subname,
      product_desc,
      technical_datasheet,
      warranty_document,
      benefit,
      green_pro_certificate,
      application_process,
      meta_title,
      meta_desc,
      category,
      subcategory,
      typeofproduct,
      slug
    } = req.body;

    // file upload paths
    const basePath = `${req.protocol}://${req.get('host')}/public/uploads/`;
    const productImgFile = req.files?.find(file => file.fieldname === 'product_img');
    const product_img = productImgFile ? `${basePath}${productImgFile.filename}` : null;

    const basePathSmall = `${req.protocol}://${req.get('host')}/public/uploads/`;
    const productSmallImgFile = req.files?.find(file => file.fieldname === 'product_small_img');
    const product_small_img = productSmallImgFile ? `${basePathSmall}${productSmallImgFile.filename}` : null;

    // validate category
    if (!mongoose.Types.ObjectId.isValid(category)) {
      return res.status(400).json({ success: false, message: 'Invalid Category ID' });
    }
    const cat = await Category.findById(category);
    if (!cat) {
      return res.status(404).json({ success: false, message: 'Category not found' });
    }

    // validate subcategory
    if (!mongoose.Types.ObjectId.isValid(subcategory)) {
      return res.status(400).json({ success: false, message: 'Invalid Subcategory ID' });
    }
    const subcat = await Subcategory.findById(subcategory);
    if (!subcat) {
      return res.status(404).json({ success: false, message: 'Subcategory not found' });
    }

    // validate typeofproduct
    if (!mongoose.Types.ObjectId.isValid(typeofproduct)) {
      return res.status(400).json({ success: false, message: 'Invalid Typeofproduct ID' });
    }
    const top = await Typeofproduct.findById(typeofproduct);
    if (!top) {
      return res.status(404).json({ success: false, message: 'Typeofproduct not found' });
    }

    // create product with details array
    const product = new Product({
      details: [
        {
          product_name,
          product_subname,
          product_desc,
          technical_datasheet,
          warranty_document,
          benefit,
          green_pro_certificate,
          application_process,
          meta_title,
          meta_desc,
          product_img,
          product_small_img,
          category: cat._id,
          subcategory: subcat._id,
          typeofproduct: top._id,
          slug
        }
      ]
    });

    await product.save();
    return res.status(200).json({ success: true, message: "Product submitted successfully", product });

  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};


module.exports.editProduct = async function (req, res) {
    try {
        const { product_title, product_subtitle, short_desc, long_desc, category, subcategory, attributes,
            features, specs, installation_service, additional_info, returns_warranty, spend_save, need_help, free_shipping } = req.body;

        const basePathSingleImg = `${req.protocol}://${req.get('host')}/public/uploads/singleImg/`;
        const basePathColorImg = `${req.protocol}://${req.get('host')}/public/uploads/colorImg/`;

        // Ensure attributes are parsed correctly if received as a JSON string
        const parsedAttributes = (typeof attributes === 'string' ? JSON.parse(attributes) : attributes).map((attribute, index) => {
            const singleImgFile = req.files.find(file => file.fieldname === `attributes[${index}][single_img]`);
            const colorImgFile = req.files.find(file => file.fieldname === `attributes[${index}][color_image]`);

            return {
                sku: attribute.sku,
                sku_subtitle: attribute.sku_subtitle,
                single_img: singleImgFile ? `${basePathSingleImg}${singleImgFile.filename}` : attribute.single_img,
                price: attribute.price,
                sale_price: attribute.sale_price,
                color_name: attribute.color_name,
                color_image: colorImgFile ? `${basePathColorImg}${colorImgFile.filename}` : attribute.color_image,
                stock: attribute.stock
            };
        });

        // Check if the category ID is valid and exists
        if (!mongoose.Types.ObjectId.isValid(category)) {
            return res.status(400).json({ success: false, message: 'Invalid Category ID' });
        }

        const cat = await Category.findById(category);
        if (!cat) {
            return res.status(404).json({ success: false, message: "Category not found" });
        }

        // Check if the subcategory ID is valid and exists
        if (!mongoose.Types.ObjectId.isValid(subcategory)) {
            return res.status(400).json({ success: false, message: 'Invalid Subcategory ID' });
        }

        const subcat = await Subcategory.findById(subcategory);
        if (!subcat) {
            return res.status(404).json({ success: false, message: "Subcategory not found" });
        }

        const product = await Product.findByIdAndUpdate(req.params.id, {
            product_title,
            product_subtitle,
            short_desc,
            long_desc,
            category: cat._id,
            subcategory: subcat._id,
            attributes: parsedAttributes,
            features,
            specs,
            installation_service,
            additional_info,
            returns_warranty,
            spend_save,
            need_help,
            free_shipping
        }, { new: true });

        if (product) {
            return res.status(200).json({ success: true, message: "Product updated successfully", product });
        } else {
            return res.status(404).json({ success: false, message: "Product not found" });
        }
    } catch (error) {
        console.error('Error:', error);
        return res.status(500).json({ success: false, message: "Internal Server Error" });
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


