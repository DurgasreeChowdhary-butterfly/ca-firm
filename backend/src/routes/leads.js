const express = require('express');
const router = express.Router();
const { createLead } = require('../controllers/leadController');

// Public route - submit a lead
router.post('/', createLead);

module.exports = router;
