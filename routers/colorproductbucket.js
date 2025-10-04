const express = require('express');
const router = express.Router();
const ColorProductBucketController = require('../controller/colorproductbuckets');
const uploadColorProductBucket = require('../helper/uploadBuckets')

router.get('/',ColorProductBucketController.getColorProductBucket)
router.get('/:id',ColorProductBucketController.getColorProductBucketById)
router.post('/add',uploadColorProductBucket,ColorProductBucketController.addColorProductBucket)
router.put('/edit/:id',uploadColorProductBucket,ColorProductBucketController.editColorProductBucket);
router.delete('/:id',ColorProductBucketController.deleteColorProductBucket)
router.get("/buckets/category/:name", ColorProductBucketController.getBucketsByCategoryName);

module.exports = router