const express = require('express');
const router = express.Router();
const HomeSliderController = require('../controller/homeslider');
const uploadHomeSlider = require('../helper/uploadImages')

router.get('/',HomeSliderController.getHomeSlider)
router.get('/:id',HomeSliderController.getHomeSliderById)
router.post('/add',uploadHomeSlider,HomeSliderController.addHomeSlider)
router.put('/edit/:id',uploadHomeSlider,HomeSliderController.editHomeSlider);
router.delete('/:id',HomeSliderController.deleteHomeSlider)

module.exports = router