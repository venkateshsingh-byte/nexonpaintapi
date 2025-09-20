const express = require('express');
const router = express.Router();
const CareerController = require('../controller/careers');
const UploadCV = require('../helper/uploadImages')

router.get('/',CareerController.getCareer)
router.get('/:id',CareerController.getCareerById)
router.post('/add',UploadCV, CareerController.addCareer)

module.exports = router