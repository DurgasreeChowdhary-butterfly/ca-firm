const express = require('express');
const router = express.Router();
const { getAvailableSlots, createAppointment } = require('../controllers/appointmentController');

router.get('/slots', getAvailableSlots);
router.post('/', createAppointment);

module.exports = router;
