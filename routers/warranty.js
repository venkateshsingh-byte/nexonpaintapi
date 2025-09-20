const express = require('express');
const router = express.Router();
const WarrantyController = require('../controller/warranty');
const uploadInvoices = require('../helper/uploadImages')

router.get('/',WarrantyController.getWarranty)
router.get('/:id',WarrantyController.getWarrantyById)
router.post('/add',uploadInvoices,WarrantyController.addWarranty)

module.exports = router