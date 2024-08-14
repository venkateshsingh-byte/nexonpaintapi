const router = require('express').Router();
const SubsubcategoryController = require('../controller/subsubcategoies');

// Define routes and map them to controller functions
router.get('/', SubsubcategoryController.getSubsubcategory);
router.get('/:id', SubsubcategoryController.getSubsubcategoryByID);
router.get('/get/counts', SubsubcategoryController.countSubsubcategory);
router.get('/category/:categoryId', SubsubcategoryController.getSubcategoryByCategory);
router.get('/subcategory/:subcategoryId',SubsubcategoryController.getSubsubcategoryBySubCategory)
router.post('/add', SubsubcategoryController.addSubsubcategory);
router.put('/edit/:id', SubsubcategoryController.editSubsubcategory);
router.delete('/:id', SubsubcategoryController.deleteSubsubcategory);

module.exports = router;
