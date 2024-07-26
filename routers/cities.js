const express = require('express');
const router = express.Router();
const CityController = require('../controller/cities');

router.get('/', CityController.getCity);
router.get('/:id', CityController.getCityById);
router.post('/add',  CityController.addCity);
router.put('/edit/:id',  CityController.editCity);
router.delete('/:id', CityController.deleteCity);  
router.get('/get/counts',CityController.countCity);

module.exports = router;
