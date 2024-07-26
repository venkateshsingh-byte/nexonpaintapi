const express = require('express');
const router = express.Router();
const ContactController = require('../controller/contacts');

router.get('/',ContactController.getContact)
router.get('/:id',ContactController.getContactById)
router.post('/add',ContactController.addContact)

module.exports = router