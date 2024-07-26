const City = require('../model/city');

module.exports.getCity = async function (req, res) {
    try {
      const city = await City.find().sort();
      return res.status(200).json({ success: true, message: "Get All city Successfully", City:city });
    } catch (err) {
      return res.status(500).json({ success: false, message: "Internal Server Error", error: err.message });
    }
  };
  
  module.exports.getCityById = async function (req, res) {
    try {
      const city = await City.findById(req.params.id);
      if (city) {
        return res.status(200).json({ success: true, message: "Get city By Id Successfully", City:city });
      } else {
        return res.status(404).json({ success: false, message: "city Not Found" });
      }
    } catch (err) {
      return res.status(500).json({ success: false, message: "Internal Server Error", error: err.message });
    }
  };
  
  module.exports.addCity = async function (req, res) {
    try {
      const { city_name } = req.body;
      
      const newCity = new City({
        city_name
      });
  
      const savedCity = await newCity.save();
      res.status(201).json({ success: true, message: "City Registered successfully!", user: savedCity });
    } catch (err) {
      res.status(500).json({ success: false, message: "City cannot be created!", error: err.message });
    }
  };
  
  module.exports.editCity = async function (req, res) {
    try {
      const { id } = req.params;
      const { city_name } = req.body;
  
      const updatedCity = await City.findByIdAndUpdate(
        id,
        {city_name},
        { new: true }
      );
  
      if (updatedCity) {
        res.status(200).json({ success: true, message: "City updated successfully", user: updatedCity });
      } else {
        res.status(404).json({ success: false, message: "City not found" });
      }
    } catch (err) {
      res.status(500).json({ success: false, message: "Internal Server Error", error: err.message });
    }
  };
  
  

  module.exports.deleteCity = async function (req, res) {
    try {
      const city = await City.findByIdAndDelete(req.params.id);
      if (city) {
        return res.status(200).json({ success: true, message: "City Deleted Successfully", city });
      } else {
        return res.status(404).json({ success: false, message: "City Cannot be deleted" });
      }
    } catch (err) {
      return res.status(500).json({ success: false, message: "Internal Server Error", error: err.message });
    }
  };


  module.exports.countCity = async function (req, res) {
    try{
      const cityCount = await City.countDocuments();
      if (cityCount) {
        return res.status(200).json({ success: true, success: true, cityCount: cityCount });
      } else {
        return res.status(404).json({ success: false, message: "User Cannot be Count" });
      }
    } catch (err) {
      return res.status(500).json({ success: false, message: "Internal Server Error", error: err.message });
    }
  }