const Product = require('../model/product');
const Category = require('../model/category');
const Subcategory = require('../model/subcategory');


module.exports.getProduct = async function(req, res) {
    try {
        const products = await Product.find().sort().populate('category').populate('subcategory');
        res.status(200).json({ success: true, message: "Product Data fetched Successfully!", products });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
}

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

        const { product_title, product_subtitle, short_desc, long_desc, category, subcategory, attributes } = req.body;

        const basePathSingleImg = `${req.protocol}://${req.get('host')}/public/uploads/singleImg/`;
        const basePathColorImg = `${req.protocol}://${req.get('host')}/public/uploads/colorImg/`;

        // Ensure attributes is parsed correctly
        const parsedAttributes = (typeof attributes === 'string' ? JSON.parse(attributes) : attributes).map((attribute, index) => {
            const singleImgFile = req.files.find(file => file.fieldname === `attributes[${index}][single_img]`);
            const colorImgFile = req.files.find(file => file.fieldname === `attributes[${index}][color_image]`);

            return {
                sku: attribute.sku,
                single_img: singleImgFile ? `${basePathSingleImg}${singleImgFile.filename}` : attribute.single_img,
                price: attribute.price,
                sale_price: attribute.sale_price,
                color_name: attribute.color_name,
                color_image: colorImgFile ? `${basePathColorImg}${colorImgFile.filename}` : attribute.color_image,
                stock: attribute.stock
            };
        });

        const cat = await Category.findById(category);
        if (!cat) {
            return res.status(404).json({ success: false, message: "Category not found" });
        }

        const subcat = await Subcategory.findById(subcategory);
        if (!subcat) {
            return res.status(404).json({ success: false, message: "Subcategory not found" });
        }

        const product = new Product({
            product_title,
            product_subtitle,
            short_desc,
            long_desc,
            category: cat._id,
            subcategory: subcat._id,
            attributes: parsedAttributes
        });

        await product.save();
        return res.status(200).json({ success: true, message: "Product submitted successfully" });
    } catch (error) {
        console.error('Error:', error);
        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

module.exports.editProduct = async function (req, res) {
    try {
        const { product_title, product_subtitle, short_desc, long_desc, category, subcategory, attributes } = req.body;

        const basePathSingleImg = `${req.protocol}://${req.get('host')}/public/uploads/singleImg/`;
        const basePathColorImg = `${req.protocol}://${req.get('host')}/public/uploads/colorImg/`;

        // Ensure attributes is parsed correctly
        const parsedAttributes = (typeof attributes === 'string' ? JSON.parse(attributes) : attributes).map((attribute, index) => {
            const singleImgFile = req.files.find(file => file.fieldname === `attributes[${index}][single_img]`);
            const colorImgFile = req.files.find(file => file.fieldname === `attributes[${index}][color_image]`);

            return {
                sku: attribute.sku,
                single_img: singleImgFile ? `${basePathSingleImg}${singleImgFile.filename}` : attribute.single_img,
                price: attribute.price,
                sale_price: attribute.sale_price,
                color_name: attribute.color_name,
                color_image: colorImgFile ? `${basePathColorImg}${colorImgFile.filename}` : attribute.color_image,
                stock: attribute.stock
            };
        });

        const cat = await Category.findById(category);
        if (!cat) {
            return res.status(404).json({ success: false, message: "Category not found" });
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