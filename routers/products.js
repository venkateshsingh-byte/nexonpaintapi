const router = require('express').Router();
const productController = require('../controller/products');
const ProductImg = require('../helper/uploadImages')

router.get('/slug/:slug', productController.getProductBySlug); 
router.get('/get/counts', productController.countProduct); 
router.get('/', productController.getProduct);
router.post('/add', ProductImg, productController.addProduct);
router.get('/:id', productController.getByProductID);  
router.put('/edit/:id', ProductImg, productController.editProduct);  
router.delete('/:id', productController.deleteProduct);  
router.get('/:category?/:subcategory?', productController.routingsubcategory); 

//router.get("/products/category/:categoryId", productController.getProductsByCategory); 
//router.get('/category/:category', productController.routingcategory);  

module.exports = router; 