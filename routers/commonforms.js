const express = require('express');
const router = express.Router();
const CommonFormController = require('../controller/commonforms');

router.get('/',CommonFormController.getCommonForm)
router.get('/:id',CommonFormController.getCommonFormById)
router.post('/add',CommonFormController.addCommonForm)

module.exports = router