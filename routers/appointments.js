const express = require('express');
const router = express.Router();
const AppointmentController = require('../controller/appointments');

router.get('/',AppointmentController.getAppointment)
router.get('/:id',AppointmentController.getAppointmentById)
router.post('/add',AppointmentController.addAppointment)

module.exports = router