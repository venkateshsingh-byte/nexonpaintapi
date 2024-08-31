const mongoose = require('mongoose');
const Subsubcategory = require('../model/subsubcategory');
const Subcategory = require('../model/subcategory');
const Category = require('../model/category');

// Get all subsubcategories
module.exports.getSubsubcategory = async function(req, res) {
    try {
        const subsubcat = await Subsubcategory.find().sort().populate('category').populate('subcategory');
        if (subsubcat.length > 0) {
            return res.status(200).json({ success: true, message: "Get All Subsubcategories", subsubcat });
        } else {
            return res.status(404).json({ success: false, message: "Subsubcategories Not Found" });
        }
    } catch (error) {
        console.error('Error:', error);
        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

// Get subsubcategory by ID
module.exports.getSubsubcategoryByID = async function(req, res) {
    try {
        const subsubcat = await Subsubcategory.findById(req.params.id).populate('category').populate('subcategory');
        if (subsubcat) {
            return res.status(200).json({ success: true, message: "Get Subsubcategory By ID", subsubcat });
        } else {
            return res.status(404).json({ success: false, message: "Subsubcategory Not Found" });
        }
    } catch (error) {
        console.error('Error:', error);
        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

module.exports.getSubcategoryByCategory = async (req, res) => {
    try {
        const { categoryId } = req.params;
        console.log('Category ID received:', categoryId); // Log received category ID

        if (!mongoose.Types.ObjectId.isValid(categoryId)) {
            console.log('Invalid Category ID format:', categoryId);
            return res.status(400).json({ success: false, message: 'Invalid Category ID format' });
        }

        const subcategories = await Subcategory.find({ category: categoryId });
        console.log('Subcategories found:', subcategories); // Log found subcategories
        
        if (!subcategories || subcategories.length === 0) {
            console.log('No subcategories found for Category ID:', categoryId);
            return res.status(404).json({ success: false, message: 'Subcategory Not found' });
        }

        return res.status(200).json({ success: true, subcategories });
    } catch (error) {
        console.error('Error fetching subcategories:', error);
        return res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
};


// Get subsubcategories by subcategory ID
module.exports.getSubsubcategoryBySubCategory = async function(req, res) {
    const {  subcategoryId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(subcategoryId)) {
        return res.status(400).json({ success: false, message: 'Invalid ID Format' });
    }

    try {
        const subsubcategories = await Subsubcategory.find({ subcategory: subcategoryId }).populate('category').populate('subcategory');

        if (subsubcategories.length > 0) {
            return res.status(200).json({ success: true, message: "Get Subsubcategories By Category and Subcategory", subsubcategories });
        } else {
            return res.status(404).json({ success: false, message: "Subsubcategories Not Found" });
        }
    } catch (error) {
        console.error('Error fetching subsubcategories:', error);
        return res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
};

// Add new subsubcategory
module.exports.addSubsubcategory = async function(req, res) {
    try {
        const { category, subcategory, subsubcat_name, subsubcat_url, meta_title, meta_desc } = req.body;
        
        if (!mongoose.Types.ObjectId.isValid(category)) {
            console.log('Invalid Category ID:', category);
            return res.status(400).json({ success: false, message: 'Invalid Category ID' });
        }

        const cat = await Category.findById(category); 
        if (!cat) { 
            console.log('Category Not Found:', category);
            return res.status(404).json({ success: false, message: 'Category Not Found' });
        }

        if (!mongoose.Types.ObjectId.isValid(subcategory)) {
            console.log('Invalid Subcategory ID:', subcategory);
            return res.status(400).json({ success: false, message: 'Invalid Subcategory ID' });
        }

        const subcat = await Subcategory.findById(subcategory); 
        if (!subcat) {
            console.log('Subcategory Not Found:', subcategory);
            return res.status(404).json({ success: false, message: 'Subcategory Not Found' });
        }

        const subsubcat = new Subsubcategory({
            category: cat._id,
            subcategory: subcat._id,
            subsubcat_name,
            subsubcat_url,
            meta_title,
            meta_desc
        });

        await subsubcat.save();
        return res.status(200).json({ success: true, message: "Subsubcategory Added Successfully", subsubcat });
    } catch (error) {
        console.error('Error:', error);
        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

// Edit subsubcategory
module.exports.editSubsubcategory = async function(req, res) {
    try {
        const { category, subcategory, subsubcat_name, subsubcat_url, meta_title, meta_desc } = req.body;

        // Validate and find category
        if (!mongoose.Types.ObjectId.isValid(category)) {
            return res.status(400).json({ success: false, message: 'Invalid Category ID' });
        }
        const cat = await Category.findById(category);
        if (!cat) {
            return res.status(404).json({ success: false, message: 'Category Not Found' });
        }

        // Validate and find subcategory
        if (!mongoose.Types.ObjectId.isValid(subcategory)) {
            return res.status(400).json({ success: false, message: 'Invalid Subcategory ID' });
        }
        const subcat = await Subcategory.findById(subcategory);
        if (!subcat) {
            return res.status(404).json({ success: false, message: 'Subcategory Not Found' });
        }

        // Update subsubcategory
        const subsubcat = await Subsubcategory.findByIdAndUpdate(
            req.params.id,
            {
                subsubcat_name,
                meta_title,
                meta_desc,
                subsubcat_url,
                category: cat._id,
                subcategory: subcat._id
            },
            { new: true }
        );

        if (subsubcat) {
            return res.status(200).json({ success: true, message: 'Subsubcategory Updated Successfully', subsubcat });
        } else {
            return res.status(404).json({ success: false, message: 'Subsubcategory Not Updated' });
        }
    } catch (error) {
        console.error('Error:', error);
        return res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
};

// Delete subsubcategory
module.exports.deleteSubsubcategory = async function(req, res) {
    try {
        const subsubcat = await Subsubcategory.findByIdAndDelete(req.params.id);
        if (subsubcat) {
            return res.status(200).json({ success: true, message: "Subsubcategory Deleted Successfully", subsubcat });
        } else {
            return res.status(404).json({ success: false, message: "Subsubcategory Not Found" });
        }
    } catch (error) {
        console.error('Error:', error);
        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

// Count subsubcategories
module.exports.countSubsubcategory = async function(req, res) {
    try {
        const subsubcategoryCount = await Subsubcategory.countDocuments();
        return res.status(200).json({ success: true, subsubcategoryCount });
    } catch (err) {
        console.error('Error:', err);
        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};
