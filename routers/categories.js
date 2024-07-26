const router = require('express').Router();
const CategoryController = require('../controller/categories');

router.get('/',CategoryController.getCategory);
router.get('/:id',CategoryController.getCategoryById);   
router.get('/get/counts',CategoryController.countCategory);
router.post('/add',CategoryController.addCategory);
router.put('/edit/:id',CategoryController.editCategory);
router.delete('/:id',CategoryController.deleteCategory)

module.exports = router;