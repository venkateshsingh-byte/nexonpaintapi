const router = require('express').Router();
const SubcategoryController = require('../controller/subcategories')

router.get('/', SubcategoryController.getSubcategory);
router.get('/:id',SubcategoryController.getSubcategoryByID);   
router.get('/get/counts',SubcategoryController.countSubcategory); 
router.get('/category/:categoryId', SubcategoryController.getSubcategoryByCategory);
router.post('/add',SubcategoryController.addSubcategory);
router.put('/edit/:id',SubcategoryController.editSubcategory);
router.delete('/:id',SubcategoryController.deleteSubcategory);

module.exports = router
