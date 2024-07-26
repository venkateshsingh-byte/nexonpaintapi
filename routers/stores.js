const router = require('express').Router();
const StoreController = require('../controller/stores')

router.get('/', StoreController.getStore);
router.get('/:id',StoreController.getStoreById);   
router.get('/get/counts',StoreController.countStore); 
router.get('/store/:cityId', StoreController.getStoreByCity);
router.post('/add',StoreController.addStore);
router.put('/edit/:id',StoreController.editStore);
router.delete('/:id',StoreController.deleteStore);

module.exports = router
