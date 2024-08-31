const Product = require('../model/product');
const Category = require('../model/category');
const Subcategory = require('../model/subcategory');
const Subsubcategory = require('../model/subsubcategory');
const mongoose = require('mongoose');


module.exports.getProduct = async function(req, res) {
    try {
        let filter = {};

        if (req.query.product_title) {
            const ProductTitle = req.query.product_title.split(',').map(id => id.trim());
            filter.product_title = { $in: ProductTitle };
        }

        if (req.query['attributes.sku']) {
            const ProductSku = req.query['attributes.sku'].split(',').map(id => id.trim());
            filter['attributes.sku'] = { $in: ProductSku };
        }

        if (req.query['subsubcategory.subsubcat_name']) {
            const SubSubCatA = req.query['subsubcategory.subsubcat_name'].split(',').map(id => id.trim());
            const subsubcategories = await Subsubcategory.find({ 'subsubcat_name': { $in: SubSubCatA.map(name => new RegExp(name, 'i')) } });
            const subsubcategoryIds = subsubcategories.map(subsub => subsub._id);
            filter.subsubcategory = { $in: subsubcategoryIds };
        }

        const products = await Product.find(filter)
            .populate('category')
            .populate('subcategory')
            .populate('subsubcategory');

        
        res.status(200).json({ 
            success: true, 
            message: "Product Data fetched Successfully!", 
            products 
        });
    } catch (error) {
        console.error("Error fetching products:", error);
        return res.status(500).json({ 
            success: false, 
            message: "Internal Server Error" 
        });
    }
};

module.exports.getByProductID = async function(req, res) {
    try {
        const product = await Product.findById(req.params.id).populate('category').populate('subcategory');
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

        const { product_title, product_subtitle, short_desc, long_desc, category, subcategory, subsubcategory, attributes } = req.body;

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

        // Check if the subsubcategory ID is valid and exists
        if (!mongoose.Types.ObjectId.isValid(subsubcategory)) {
            return res.status(400).json({ success: false, message: "Invalid Subsubcategory ID" });
        }

        const subsubcat = await Subsubcategory.findById(subsubcategory);
        if (!subsubcat) {
            return res.status(404).json({ success: false, message: "Subsubcategory not found" });
        }

        // Create a new product instance
        const product = new Product({
            product_title,
            product_subtitle,
            short_desc,
            long_desc,
            category: cat._id,
            subcategory: subcat._id,
            subsubcategory: subsubcat._id,
            attributes: parsedAttributes
        });

        // Save the product to the database
        await product.save();
        return res.status(200).json({ success: true, message: "Product submitted successfully", product });
    } catch (error) {
        console.error('Error:', error);
        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

module.exports.editProduct = async function (req, res) {
    try {
        const { product_title, product_subtitle, short_desc, long_desc, category, subcategory, subsubcategory, attributes } = req.body;

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

        // Check if the subsubcategory ID is valid and exists
        if (!mongoose.Types.ObjectId.isValid(subsubcategory)) {
            return res.status(400).json({ success: false, message: "Invalid Subsubcategory ID" });
        }

        const subsubcat = await Subsubcategory.findById(subsubcategory);
        if (!subsubcat) {
            return res.status(404).json({ success: false, message: "Subsubcategory not found" });
        }

        const product = await Product.findByIdAndUpdate(req.params.id, {
            product_title,
            product_subtitle,
            short_desc,
            long_desc,
            category: cat._id,
            subcategory: subcat._id,
            subsubcategory: subsubcat._id,
            attributes: parsedAttributes
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
};


module.exports.routingsubsubcategory = async function (req, res) {
    try {
        const { category, subcategory, subsubcategory } = req.params;
        //console.log("Check Query Params:", req.params);

        const query = {};

        // Fetch and validate category ID
        if (category) {
            const categoryObj = await Category.findOne({ cat_url: category });
            if (!categoryObj) {
                return res.status(404).json({ success: false, message: "Category not found" });
            }
            console.log("Check Category Id:",categoryObj)
            query.category = categoryObj._id; // Make sure this is an ObjectId
        }

        // Fetch and validate subcategory ID
        if (subcategory && query.category) {
            const subcategoryObj = await Subcategory.findOne({
                subcat_url: subcategory,
                category: query.category
            });
            if (!subcategoryObj) {
                return res.status(404).json({ success: false, message: "Subcategory not found" });
            }
            query.subcategory = subcategoryObj._id; // Make sure this is an ObjectId
        }

        // Fetch and validate subsubcategory ID
        if (subsubcategory && query.category && query.subcategory) {
            const subsubcategoryObj = await Subsubcategory.findOne({
                subsubcat_url: subsubcategory,
                category: query.category,
                subcategory: query.subcategory
            });
            if (!subsubcategoryObj) {
                return res.status(404).json({ success: false, message: "Subsubcategory not found" });
            }
            query.subsubcategory = subsubcategoryObj._id; // Make sure this is an ObjectId
        }

        console.log("Final Query Object:", query);

        // Find products based on the constructed query
        const products = await Product.find(query).populate('category subcategory subsubcategory');
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
};


