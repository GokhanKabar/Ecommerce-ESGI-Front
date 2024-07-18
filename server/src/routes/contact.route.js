const express = require('express');
const { sendContactForm } = require('../controllers/contact.controller');
const router = express.Router();

router.post('/send-contact', sendContactForm);

module.exports = router;
