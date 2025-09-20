const router = require('express').Router();
const TypeOfProductController = require('../controller/typeofproducts');

router.get('/',TypeOfProductController.getTypeOfProduct);
router.get('/:id',TypeOfProductController.getTypeOfProductById); 
router.post('/add',TypeOfProductController.addTypeOfProduct);
router.put('/edit/:id',TypeOfProductController.editTypeOfProduct);
router.delete('/:id',TypeOfProductController.deleteTypeOfProduct)

module.exports = router;