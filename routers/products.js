const router = require('express').Router();
const productController = require('../controller/products');
const ProductImg = require('../helper/uploadImages')

router.get('/', productController.getProduct);
router.get('/:id', productController.getByProductID);  
router.get('/get/counts', productController.countProduct);
router.post('/add', ProductImg, productController.addProduct);
router.put('/edit/:id', ProductImg, productController.editProduct);
router.delete('/:id', productController.deleteProduct);  
router.get('/:category?/:subcategory?', productController.routingsubcategory);  
//router.get('/category/:category', productController.routingcategory);  

module.exports = router; 