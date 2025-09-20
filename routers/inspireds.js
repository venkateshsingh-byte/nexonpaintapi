const express = require('express');
const router = express.Router();
const InspiredController = require('../controller/inspireds');   
const InspiredImgUpload = require('../helper/uploadImages')
 
router.get('/',InspiredController.getInspired);
router.get('/:id',InspiredController.getInspiredById);   
router.get('/get/counts',InspiredController.countInspired);
router.post('/add',InspiredImgUpload, InspiredController.addInspired);
router.put('/edit/:id',InspiredImgUpload, InspiredController.editInspired);
router.delete('/:id',InspiredController.deleteInspired)        

module.exports = router;