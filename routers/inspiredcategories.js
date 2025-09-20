const router = require('express').Router();
const InspiredCategoryController = require('../controller/inspiredcategories');

router.get('/',InspiredCategoryController.getInspiredCategory);
router.get('/:id',InspiredCategoryController.getInspiredCategoryById);   
router.get('/get/counts',InspiredCategoryController.countInspiredCategory);
router.post('/add',InspiredCategoryController.addInspiredCategory);
router.put('/edit/:id',InspiredCategoryController.editInspiredCategory);
router.delete('/:id',InspiredCategoryController.deleteInspiredCategory)      

module.exports = router;