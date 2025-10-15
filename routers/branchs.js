const express = require('express');
const router = express.Router();
const BranchController = require('../controller/branchs');
const uploadBranchImg = require('../helper/uploadImages')

router.get('/',BranchController.getBranch)
router.get('/slug/:slug',BranchController.getBranchBySlug)
router.get('/:id',BranchController.getBranchById)
router.post('/add',uploadBranchImg,BranchController.addBranch)
router.put('/edit/:id',uploadBranchImg,BranchController.editBranch);
router.delete('/:id',BranchController.deleteBranch)

module.exports = router
