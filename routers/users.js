const express = require('express');
const router = express.Router();
const UserController = require('../controller/users');

router.get('/', UserController.getUser);
router.get('/:id', UserController.getUserById);
router.post('/add',  UserController.addUser);
router.put('/edit/:id',  UserController.editUser);
router.delete('/:id', UserController.deleteUser);  
router.get('/get/counts',UserController.countUser);


router.post('/login',  UserController.loginUser);

module.exports = router;
