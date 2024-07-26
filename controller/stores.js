const { default: mongoose } = require('mongoose');
const Store = require('../model/store');
const City = require('../model/city');

module.exports.getStore = async function (req, res) {
    try {
        const store = await Store.find().sort();
        return res.status(200).json({ success: true, message: "Get All Store Successfully", stores: store });
    } catch (err) {
        return res.status(500).json({ success: false, message: "Internal Server Error", error: err.message });
    }
};

module.exports.getStoreById = async function (req, res) {
    try {
        const store = await Store.findById(req.params.id);
        if (store) {
            return res.status(200).json({ success: true, message: "Get Store By Id Successfully", store });
        } else {
            return res.status(404).json({ success: false, message: "Store Not Found" });
        }
    } catch (err) {
        return res.status(500).json({ success: false, message: "Internal Server Error", error: err.message });
    }
};

module.exports.addStore = async function (req, res) {
    try {
        const { store_name, city } = req.body;

        if (!mongoose.Types.ObjectId.isValid(city)) {
            return res.status(400).json({ success: false, message: "Invalid city ID" });
        }

        const cityCheck = await City.findById(city);
        if (!cityCheck) {
            return res.status(404).json({ success: false, message: 'City Not Found' });
        }

        const newStore = new Store({
            store_name,
            city: cityCheck._id
        });

        const savedStore = await newStore.save();
        res.status(201).json({ success: true, message: "Store Registered Successfully!", store: savedStore });
    } catch (err) {
        res.status(500).json({ success: false, message: "Store cannot be created!", error: err.message });
    }
};

module.exports.editStore = async function (req, res) {
    try {
        const { id } = req.params;
        const { store_name, city } = req.body;

        if (!mongoose.Types.ObjectId.isValid(city)) {
            return res.status(400).json({ success: false, message: "Invalid city ID" });
        }

        const cityCheck = await City.findById(city);
        if (!cityCheck) {
            return res.status(404).json({ success: false, message: 'City Not Found' });
        }

        const updatedStore = await Store.findByIdAndUpdate(
            id,
            { store_name, city: cityCheck._id },
            { new: true }
        );

        if (updatedStore) {
            res.status(200).json({ success: true, message: "Store updated successfully", store: updatedStore });
        } else {
            res.status(404).json({ success: false, message: "Store not found" });
        }
    } catch (err) {
        res.status(500).json({ success: false, message: "Internal Server Error", error: err.message });
    }
};

module.exports.deleteStore = async function (req, res) {
    try {
        const store = await Store.findByIdAndDelete(req.params.id);
        if (store) {
            return res.status(200).json({ success: true, message: "Store Deleted Successfully", store });
        } else {
            return res.status(404).json({ success: false, message: "Store Not Found" });
        }
    } catch (err) {
        return res.status(500).json({ success: false, message: "Internal Server Error", error: err.message });
    }
};

module.exports.countStore = async function (req, res) {
    try {
        const countStore = await Store.countDocuments();
        return res.status(200).json({ success: true, storeCount: countStore });
    } catch (err) {
        return res.status(500).json({ success: false, message: "Internal Server Error", error: err.message });
    }
};

module.exports.getStoreByCity = async function (req, res){
    try{
        const {cityId} = req.params;
        const store = await Store.find({ city:cityId })   
        if(store || store.lenght ===0){
            return res.status(404).json({ success: false, message: 'Store Not found' });
        }

        return res.status(200).json({ success: true, store });
    } catch (error) {
      console.error('Error fetching Store:', error);
      return res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
    
}