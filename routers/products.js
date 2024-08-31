const router = require('express').Router();
const productController = require('../controller/products');
const AttributeImg = require('../helper/uploadImages')

router.get('/', productController.getProduct);
router.get('/:id', productController.getByProductID);  
router.get('/get/counts', productController.countProduct);
router.post('/add', AttributeImg, productController.addProduct);
router.put('/edit/:id', AttributeImg, productController.editProduct);
router.delete('/:id', productController.deleteProduct);  
router.get('/:category?/:subcategory?/:subsubcategory?', productController.routingsubsubcategory);  
router.get('/category/:category', productController.routingcategory);  

module.exports = router; 